---
title: "Kubernetes: IPv6-only For Real In Good This Time"
date: 2025-10-13T14:09:13+02:00
description: "Let's set up a Kubernetes cluster that runs using IPv6-only networking, using the /64 networks of your machines, with Talos Linux and Cilium CNI."
image: "/blog/2025/kubernetes-ipv6-only-for-real-in-good-this-time.jpg"
authors:
  - name: Alexander Trost
    to: https://github.com/galexrt
    avatar:
      src: /images/profile-picture.jpg
---

(Photo by [RealToughCandy.com from Pexels.com](https://www.pexels.com/photo/person-holding-logo-of-there-is-no-place-like-home-11035359/), modified to fit the blog post theme)

## Intro

In this blog post I want to share my experience on setting up a Talos Kubernetes cluster that runs using IPv6-only networking. No IPv4 addresses on the servers, no IPv4 addresses on the pods, no IPv4 addresses on the services. Just pure IPv6!

Before I'll dive into config, flags and more, this blog post is heavily based upon ["Kubernetes PODs with global IPv6" blog post](https://dev.to/sergelogvinov/kubernetes-pods-with-global-ipv6-1aaj) by [Serge Logvinov on dev.to](https://dev.to/sergelogvinov).
It is about Talos Kubernetes cluster config but still with IPv4 networking enabled. In the grand scheme of things, the config is very similar to what I wanted to achieve, but for IPv6-only networking.

Additionally if you aren't into [Talos Linux](https://www.talos.dev/) (yet), I highly recommend checking it out, the shown configs should be easily adjustable for use with `kubeadm` and other cluster deployment tools.

## The Environment - "Pinch A Penny"

In my case I am using [Hetzner Cloud](https://www.hetzner.com/cloud) as my cloud provider, which provides native IPv6 support and gives each VM/server a **routed** and **publicly reachable** IPv6 `/64` network.

::callout
If you want to follow this blog post, make sure that your cloud provider supports IPv6 and gives you a a **routed** and **publicly reachable** IPv6 `/64` network for each of your VMs/servers.
::

So why am I "pinching a penny"? If I could get a working IPv6-only Kubernetes cluster going, I could save the costs of a public IPv4 address per server. So 0.60€/month per server, which is 7.20€/year per server.
It's not "much" I hear you potentially think? Yes, but the more nodes you run the more you could save, so... ;-)

### I heard that GitHub doesn't support IPv6?

Yes.., but [there is a discussion about it in the GitHub Community](https://github.com/orgs/community/discussions/10539) that is open since 2022 and I know of older discussions/issues about this topic.

::callout
Quick side note: If every company would at least slowly start to support IPv6 and take it seriously, I strongly believe that we would be in a much better place regarding IPv6 adoption.
It is annoying that a vital service that not just provides container images, but build and release artifacts of many open source projects, doesn't support IPv6.

I guess there are two mentions I want to make:

1. At least GitHub Pages supports IPv6, so that is at least one of (many) parts available over IPv6.
2. ["World IPv6 Day" event was held on 08. June 2011](https://www.worldipv6launch.org/), I hope I don't made you all feel too old.
::

It's an issue for this setup, because the Talos CCM (Cloud Controller Manager) is only published to [GHCR.io](https://ghcr.io/) (GitHub Container Registry) and that also doesn't support IPv6.
Technically speaking there's several methods to workaround this. In my case I am using the [NAT64 service](https://nat64.net/) from Kasper Dupont that provides free-to-use NAT64/DNS64 resolvers.
In a nutshell it translates IPv6 requests to IPv4 requests and vice versa.

I'll list the workarounds that come to my mind here:

- Using a NAT64/DNS64 service that translates IPv6 requests to IPv4 requests and vice versa. (e.g., [nat64.net](https://nat64.net/), etc.)
- Mirroring the images to another registry that supports IPv6 (e.g., Docker Hub, Quay.io, etc.) and use image overrides to pull from there.
- Using a pull-through/proxy registry that supports IPv6 (e.g., [Harbor](https://goharbor.io/), etc.) that caches the images on pull.
- You could keep the IPv4 address attached on your nodes and use it as normal. Though even just writing this, it feels weird and against the idea of an IPv6-only Kubernetes cluster..

## Talos Kubernetes Config - No IPv4, No Problem

::callout
Not using Talos Linux? No worries! The shown configs should be easily adjustable for use with `kubeadm` and other cluster deployment tools.

E.g., `machine.network.nameservers` would be `/etc/resolv.conf`, `cluster.network` would be in the `kubeadm` config file, etc.
::

The first thing we are going to do is to add the NAT64/DNS64 resolvers to our nodes' using MachineConfig patches and get the Talos Linux ready.

::callout
You might be able to update an existing cluster with these patches but I wouldn't recommend it. Creating a new cluster with these patches applied from the start is the way to go.
::

### Patch for all MachineConfigs

Patch for all machines/nodes (including control planes; explanation in code comments).

```yaml
machine:
  network:
    # Use NAT64/DNS64 resolvers to resolve IPv4-only hosts like, e.g., ghcr.io
    nameservers:
      # NAT64/DNS64 resolvers - https://nat64.net/
      # Make sure to read through the Terms of Service before using the service
      - 2a01:4f9:c010:3f02::1
      - 2a00:1098:2c::1
      - 2a01:4f8:c2c:123f::1
cluster:
  # Make sure Kubernetes thinks we are running in a "cloud" environment with a cloud controller manager
  # In this case we'll use the Talos Cloud Controller Manager (CCM) for Hetzner Cloud
  externalCloudProvider:
    enabled: true
  # Disable `kube-proxy` as we use Cilium with full kube-proxy replacement
  proxy:
    disabled: true
```

### Patch for Control Plane

Patch for the control plane nodes.

```yaml
cluster:
  network:
    # Talos shouldn't deploy any CNI, we'll deploy Cilium ourselves.
    cni:
      name: none
    # Only provide an IPv6 podSubnet here, so no IPv4 is allocated/used.
    # This range is more of a dummy, as through the CCM we'll allocate slices of each node's /64 network
    # to the pods running on that node.
    # Make sure that the podSubnet is unique and doesn't overlap with any other network in your
    # infrastructure.
    podSubnets:
      - "fd40:10::/96"
    # Only provide an IPv6 serviceSubnet here, so no IPv4 is allocated/used.
    serviceSubnets:
      - "fd40:10:100::/112"
  controllerManager:
    extraArgs:
      # Make sure the kube-controller-manager listens on all interfaces ("including" IPv6), this can be
      # a security implication as in a public network setting like Hetzner Cloud this would expose the
      # kube-controller-manager's endpoints to the public internet. Therefore it is recommended to setup
      # a firewall to only allow access from trusted IPs/networks.
      bind-address: "::"
      # Without disabling the node IPAM controller, this would make the controller hand out /112 networks
      # to each node.
      node-cidr-mask-size-ipv6: "112"
      # Disable Node IPAM controller as we use Talos CCM for the pod network for each node.
      controllers: "*,-node-ipam-controller"
  scheduler:
    extraArgs:
      # Make sure the kube-scheduler listens on all interfaces ("including" IPv6), this can be
      # a security implication, see controllerManager bind-address comment above.
      bind-address: "::"
  etcd:
    extraArgs:
      # Make sure the etcd metrics listens on all interfaces ("including" IPv6), this can be
      # a security implication, see controllerManager bind-address comment above.
      # Note: This is optional, only needed if you want to easily scrape etcd metrics.
      listen-metrics-urls: "http://[::]:2381"
```

### Patch for Worker Nodes

No additional patch needed for only the worker nodes.

## "I route, therefore I am" - Cilium CNI

Ironically, Cilium CNI technically does less routing because Hetzner Cloud already routes the `/64` networks to the respective servers.

If we don't tell Cilium to use Kubernetes for IP Address Management (IPAM), it would allocate a range itself which we don't want to happen.

```yaml
# This uses Talos kubespan service to connect to the Kubernetes API server.
# In non-Talos clusters this would be, e.g., the IP of your API server or a load balancer in front of it.
k8sServiceHost: "localhost"
k8sServicePort: "7445"

# Use Cilium with full kube-proxy replacement
kubeProxyReplacement: true

cni:
  # Yes, we want Cilium to  be our CNI.
  install: true

ipam:
  mode: "kubernetes"

bpf:
  masquerade: false

# This can depend on your cloud provider and setup.
loadBalancer:
  acceleration: "native"

k8s:
  # We don't want/need IPv4 Pod CIDR, so disable it.
  requireIPv4PodCIDR: false
  # But require a IPv6 Pod CIDR to be present on the node.
  requireIPv6PodCIDR: true

# Disable masquerading as the IPv6 networks are (publicly) routed/"accessible."
enableIPv4Masquerade: false
enableIPv6Masquerade: false

cgroup:
  autoMount:
    # Already done by Talos, no need to do it again in/by Cilium.
    enabled: false
  # This is the path on Talos Linux.
  # In non-Talos clusters you might need to adjust it and/or enable autoMount again.
  hostRoot: /sys/fs/cgroup

# Make sure the Cilium DaemonSet runs in privileged mode to be able to create everything it needs.
securityContext:
  privileged: true

ipv4:
  # Who needs that anyway? :-)
  enabled: false

ipv6:
  # IPv6-only, let's go!
  enabled: true

# Use native routing mode as Hetzner Cloud already routes the /64 networks to the respective servers,
# If you intend to enable both IPv4 and IPv6 you might need to adjust this mode accordingly, but
# otherwise the IPv4 networks need to be routable to each server as well.
routingMode: "native"
```

The helm install/upgrade command I used to install Cilium CNI version 1.17.2 with the above config in the `cilium-values.yaml` file.:

```bash
helm upgrade -i \
    --namespace=kube-system \
    --version=1.18.2 \
    -f cilium-values.yaml \
    cilium \
    cilium/cilium
```

## Cloud Controller To The Rescue - Allocating IPv6 CIDRs

As mentioned before, Hetzner Cloud gives each server a routed `/64` network. But how do we make sure that the pods on each node get use IPs from the `/64` network assigned to them?
That's where the Talos Cloud Controller Manager (CCM) comes into play.

With the following config it will allocate `/80` networks to each node from their respective `/64` network.

```yaml
# Enable the node IPAM controller to allocate a network based on each node's /64 network.
enabledControllers:
  - cloud-node
  - node-ipam-controller

extraArgs:
  # Enable allocating node CIDRs based on each node's /64 network.
  - --allocate-node-cidrs
  - --cidr-allocator-type=CloudAllocator
  # Make sure to allocate /80 networks to each node from their /64 network.
  - --node-cidr-mask-size-ipv6=80

daemonSet:
  # Run as a DaemonSet on each node.
  enabled: true

# Needs to run when the node(s) is not ready yet to be able to allocate the CIDR before Cilium can start up.
tolerations:
  - effect: NoSchedule
    operator: Exists
```

The helm install/upgrade command I used to install Talos CCM version 0.5.2 with the above config in the `talos-ccm-values.yaml` file:

```bash
helm upgrade -i \
    --namespace=kube-system \
     -f talos-ccm-values.yaml \
    talos-cloud-controller-manager \
    oci://ghcr.io/siderolabs/charts/talos-cloud-controller-manager \
    --version 0.5.2
```

## Here's How It Looks In Action

I have deployed Cilium's Star Wars™ demo application to test out the basic behavior, see [Getting Started with the Star Wars Demo - Cilium documentation](https://docs.cilium.io/en/stable/gettingstarted/demo/#deploy-the-demo-application).

```bash
$ kubectl create -n default -f https://raw.githubusercontent.com/cilium/cilium/HEAD/examples/minikube/http-sw-app.yaml
# Wait till the pods are ready
$ kubectl get -n default pods
```

```bash
$ kubectl get -A svc
NAMESPACE     NAME                             TYPE        CLUSTER-IP          EXTERNAL-IP   PORT(S)                  AGE
default       deathstar                        ClusterIP   fd40:10:100::b0da   <none>        80/TCP                   7m49s
default       kubernetes                       ClusterIP   fd40:10:100::1      <none>        443/TCP                  13m
default       talos                            ClusterIP   fd40:10:100::bbf3   <none>        50000/TCP                12m
kube-system   cilium-envoy                     ClusterIP   None                <none>        9964/TCP                 11m
kube-system   hubble-peer                      ClusterIP   fd40:10:100::e43b   <none>        443/TCP                  11m
kube-system   kube-dns                         ClusterIP   fd40:10:100::a      <none>        53/UDP,53/TCP,9153/TCP   12m
kube-system   talos-cloud-controller-manager   ClusterIP   None                <none>        50258/TCP                12m
```

```bash
$ kubectl get pod -o wide
NAME                         READY   STATUS    RESTARTS   AGE     IP                         NODE             NOMINATED NODE   READINESS GATES
deathstar-86f85ffb4d-4mt6r   1/1     Running   0          36s     2a01:4f8:c014:f084::3cd2   talos-worker-2   <none>           <none>
deathstar-86f85ffb4d-7jpb4   1/1     Running   0          2m12s   2a01:4f8:c014:34b1::2f8f   talos-worker-1   <none>           <none>
tiefighter                   1/1     Running   0          2m12s   2a01:4f8:c014:f084::f280   talos-worker-2   <none>           <none>
xwing                        1/1     Running   0          8s      2a01:4f8:c014:34b1::c396   talos-worker-1   <none>           <none>
```

```bash
$ kubectl get nodes -o wide
NAME                    STATUS                     ROLES           AGE     VERSION   INTERNAL-IP             EXTERNAL-IP   OS-IMAGE          KERNEL-VERSION   CONTAINER-RUNTIME
talos-control-plane-1   Ready                      control-plane   8m24s   v1.32.3   2a01:4f8:c014:b0a7::1   <none>        Talos (v1.11.2)   6.12.48-talos    containerd://2.1.4
talos-worker-1          Ready                      <none>          8m14s   v1.32.3   2a01:4f8:c014:34b1::1   <none>        Talos (v1.11.2)   6.12.48-talos    containerd://2.1.4
talos-worker-2          Ready,SchedulingDisabled   <none>          4m18s   v1.32.3   2a01:4f8:c014:f084::1   <none>        Talos (v1.11.2)   6.12.48-talos    containerd://2.1.4
```

Scheduling has been disabled for `talos-worker-2` so that the demo app is running "50/50" on the two nodes in the cluster.

```bash
$ kubectl exec tiefighter -- curl -s -XPOST deathstar.default.svc.cluster.local/v1/request-landing
Ship landed
$ kubectl exec xwing -- curl -s -XPOST deathstar.default.svc.cluster.local/v1/request-landing
Ship landed
$ kubectl get pod -o wide
NAME                         READY   STATUS    RESTARTS   AGE     IP                         NODE             NOMINATED NODE   READINESS GATES
deathstar-86f85ffb4d-7jpb4   1/1     Running   0          6m19s   2a01:4f8:c014:34b1::2f8f   talos-worker-1   <none>           <none>
deathstar-86f85ffb4d-q6l6f   1/1     Running   0          66s     2a01:4f8:c014:34b1::9811   talos-worker-1   <none>           <none>
tiefighter                   1/1     Running   0          6m19s   2a01:4f8:c014:f084::f280   talos-worker-2   <none>           <none>
xwing                        1/1     Running   0          4m15s   2a01:4f8:c014:34b1::c396   talos-worker-1   <none>           <none>
```

This seems to show that everything is working as expected! Pods are getting IPs from the `/64` networks of the respective nodes and communication between pods is working as expected.

## Summarizing Everything And Some Notes

With the configs shown above, we have a working Talos Kubernetes cluster that runs using IPv6-only networking, using the `/64` of each node for the pods running on that node.
Additionally we are using Cilium CNI in full kube-proxy replacement mode with Kubernetes-based IPAM to allocate the pod IPs and Talos CCM to allocate the respective `/80` networks from each node's `/64` network.

In addition to that, to workaround the lack of IPv6 connectivity of some services we are using NAT64/DNS64 resolvers to be able to pull container images from IPv4-only registries like GitHub Container Registry.

**Notes**:

- You want to make sure that your nodes have proper firewall rules in place to only allow access from your nodes to each other. You might be able to use [Cilium's Host Firewall feature](https://docs.cilium.io/en/latest/security/host-firewall/) for that though I haven't tested it yet.
- Make sure to double-check any application you deploy for proper IPv6 support. Some applications might still have issues with IPv6-only networking.
    - In the past I had issues with Zalando's postgres-operator not being able to create proper IPv6 connections to the PostgreSQL instances it created. Might be fixed in the meantime, I haven't tested it recently. Haven't deployed it yet but stumbled upon [this Percona Jira issue (PXC-3638)](https://perconadev.atlassian.net/browse/PXC-3638) about "manual" configuration being needed to make nodes sync/join correctly.

P.S. In my tests I even deployed the cluster using ARM64 VMs/servers on Hetzner Cloud and everything worked as expected!

## The Cherry On Top - GitHub Repository with Terraform Code and Configs

The repository contains all the code and configs to deploy a Talos Kubernetes cluster with IPv6-only networking on Hetzner Cloud using Terraform (and Packer) is available at
[https://github.com/galexrt/k8s-talos-ipv6-only](https://github.com/galexrt/k8s-talos-ipv6-only).

Make sure to checkout the [README.md](https://github.com/galexrt/k8s-talos-ipv6-only/blob/main/README.md) for instructions on how to use it.
