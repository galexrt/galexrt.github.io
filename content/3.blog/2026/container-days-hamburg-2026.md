---
title: "ContainerDays Hamburg 2026"
date: 2026-09-02T08:00:00+02:00
description: "Blog post about the ContainerDays Hamburg 2026 conference and some of the talks I attended."
image: "/blog/2026/container-days-hamburg-2026/cds2026-registration-wardrobe.webp"
authors:
  - name: Alexander Trost
    to: https://github.com/galexrt
    avatar:
      src: /images/profile-picture.webp
---

Finally, I am attending ContainerDays again after a few years of not being able to attend because of planning issues.
This year the event was held in the harbor area again, to be exact at "Schuppen 52" instead of the previous year's "Kampnagel" location, which was closer in the city.

It almost feels like going back to the roots of the event, with "Schuppen 52" being quite close to the "Hafenmuseum", but "we", the attendees, have simply outgrown the "Hafenmuseum" and "Kampnagel" locations.
As a side note, my first ContainerDays was in 2018 at the "Hafenmuseum", different times and different jobs, but the same event and same great community.

Now let's dive into the talks. As we haven't mastered the art of cloning ourselves yet, I was obviously not able to attend all of them, but I hope that my selection of talks will at least provide you with some new knowledge.

---

## Day 1

### Sovereign by Design, Open by Default - Christian Hüning, Niklas Voss

The talk was about the relationship between digital sovereignty and open source. These two ideas are sometimes treated as opposites: sovereignty sounds like building something closed and controlled, while open source implies that everyone can inspect and use the result.
Their point was that openness can actually help build sovereignty. Open standards, interoperable components, and transparent supply chains make it easier to retain control over the infrastructure instead of depending on a single vendor.
The talk was presented in the context of the [NeoNephos Foundation](https://neonephos.org/), a vendor-neutral foundation supporting an open, sovereign cloud-native ecosystem.

![CDS2026 - Sovereign by Design, Open by Default - Christian talking](/blog/2026/container-days-hamburg-2026/cds2026-sovereign-by-design-1.webp)

The infrastructure itself also needs to be part of this story. Using [Metal³](https://metal3.io/) components, the hardware and network for Kubernetes clusters can be provisioned and managed through open, Kubernetes-native APIs.

This kind of sovereignty is particularly important for defence contracts and other public-sector workloads. It is not only about where a workload runs. It is also about who can operate the infrastructure, which jurisdiction applies, and whether the systems can still be used independently years later.

![CDS2026 - Sovereign by Design, Open by Default - Niklas talking](/blog/2026/container-days-hamburg-2026/cds2026-sovereign-by-design-2.webp)

Talos Linux is used as the operating system for the Kubernetes nodes, which made me smile. An immutable, API-driven operating system fits nicely with the goal of managing the whole infrastructure in a predictable and declarative way.

![CDS2026 - Sovereign by Design, Open by Default - KCP Workspace Architecture: Isolating & API Binding](/blog/2026/container-days-hamburg-2026/cds2026-sovereign-by-design-3.webp)

The presentation also showed the kcp workspace architecture. As I understood it, a cluster-or more precisely, its control planes-is treated as one single namespace. APIs and resources can then be isolated and selectively exposed through workspaces instead of making everything available everywhere.

One comparison from the talk stuck with me: permissions should be requested more like popups on smartphones. Access should be explicit and understandable, rather than silently granting every user or component more permissions than it needs.

This also connects to compliance enforcement and supply-chain security. Policies need to ensure that systems are configured safely, while the software supply chain needs to give us confidence that the software itself is safe and has not been tampered with.

Air-gapped environments make these requirements especially visible and painful. If an environment is completely offline, you can't just download a container image or package when it is needed. Everything has to be bundled, verified, and transferred into the environment in advance.

Using OCI as a common format helps with this process. The artifacts can be transported as files on physical media-so, as the talk joked, they could even be carried on a USB stick by a pigeon.
The Open Component Model (OCM) is a specification for describing and distributing software components in an OCI-compatible way. It can be used to define the dependencies of a workload,
including the exact versions of container images, configuration files, and other artifacts.

The phrase “public money, public code” was another important part of the talk. BWI is owned by the German government, so the argument is that publicly funded work should also create reusable value for the public.
The goal is not to create a foundation exclusively for the defence industry, but to contribute to an open ecosystem that can be used by everyone.

For me, the main takeaway was that sovereignty does not necessarily mean building a closed alternative. It is about retaining meaningful choices: where infrastructure runs, who can operate it, how software is verified, and whether the components remain usable by others.

### From Frankenstein to Kamaji: Lessons in Building a Single CAPI Cluster Across Multiple Providers - Xavier Avrillier, Antonia von den Driesch

![CDS2026 - From Frankenstein to Kamaji: Lessons in Building a Single CAPI Cluster Across Multiple Providers - Presenters talking](/blog/2026/container-days-hamburg-2026/cds2026-frankenstein-to-kamaji-1.webp)

Before starting with the talk, a quick clarification on an abbreviation used: "CAPI" stands for [Cluster API of Kubernetes](https://cluster-api.sigs.k8s.io/).

When creating and managing clusters with CAPI, [owner references](https://kubernetes.io/docs/concepts/overview/working-with-objects/owners-dependents/) come in clutch for cleanup and knowing which cluster owns which resources. In general, owner references and finalizers are a good way to manage resources in Kubernetes.
To increase the resilience of Kubernetes clusters, you might want to "stretch" a cluster across multiple providers, e.g., AWS and Azure. While "hybrid clusters" are possible in themselves, CAPI tooling might not fully support them.

By making the "management cluster" a "hybrid" cluster-or at least "connected" to both providers, vSphere and Proxmox-they can "easily" manage clusters with nodes across both providers, but it feels like **Frankenstein**.
(Disclaimer from the talk: Obviously, this is not supported by GiantSwarm upstream products.)

As mentioned before, some tooling around CAPI might not work as expected when using multiple providers. For example, [`clusterctl`](https://cluster-api.sigs.k8s.io/clusterctl/overview) can have issues connecting to control planes or machines in different providers. From my experience and what I saw, this feels more like a "network segmentation" issue than a tooling issue.

Their demo showed a brand-new CAPI cluster with nodes from both providers, vSphere and Proxmox. After a few seconds, the Proxmox nodes disappeared because the vSphere Cloud Controller Manager (CCM) was not aware of them.
But what does "CCM is not aware" mean here? The CCMs are responsible for managing the lifecycle of nodes in a Kubernetes cluster, including provisioning, scaling, and deleting nodes. So, when a node is created, most CCMs will "check" whether the node is "known" to the CCM. If it is not, the node will be deleted from the cluster.
Depending on how you see this, you could consider it a "safety" mechanism to prevent "unknown" nodes from being part of the cluster.
But in the case of a "hybrid" cluster, a CCM that deletes nodes from a different provider is not really what you want.

I personally ran into that situation on Hetzner Cloud (HCloud), where the HCloud CCM would delete "unknown" nodes, e.g., dedicated servers. To the credit of the HCloud CCM maintainers, they added a label/config option to prevent such nodes from being deleted from the Kubernetes cluster when they were considered "unknown".
Nowadays, the HCloud CCM even has some integration for dedicated servers, but at the time, adding or setting labels was the "safe" way to ensure the CCM did not remove the node from Kubernetes and break the cluster.

They built a custom vSphere CCM that ignores nodes with a certain name prefix. That "works", but labels feel "better" for this use case. Based on that, I think it would be good to add "label exclusion" of nodes as a feature to the "So you wanna build a CCM?" guidelines.
Keep that in mind when you wanna build hybrid clusters with multiple CCMs. You might run into issues with a CCM deleting nodes from another provider because it is not aware of them.
Additionally, what I currently consider a "Kubernetes limitation" is that you are not really expected to run multiple CCMs in a single cluster. You can only specify one "main" CCM in the Kubernetes Controller Manager.

So, to summarize, most CCMs are not designed to work across multiple providers. This is a "limitation" of the current CAPI ecosystem. If you wanna run a hybrid cluster across multiple providers, you might run into issues with CCMs deleting nodes from the cluster that they are not aware of.

To circle back to the project, they showed [Kamaji](https://kamaji.clastix.io/) for running hosted control planes. Running control planes as "normal" Pods in a management cluster can help reduce the resource overhead of managing multiple clusters.
Using such a "hosted control plane" for a cluster makes the control plane nodes "disappear" from the `kubectl get nodes` output. Since you don't have to take care of the control plane nodes directly, this can make managing a cluster easier or harder, depending on the situation.

![CDS2026 - From Frankenstein to Kamaji: Lessons in Building a Single CAPI Cluster Across Multiple Providers - Customer: "I need bare metal nodes"](/blog/2026/container-days-hamburg-2026/cds2026-frankenstein-to-kamaji-2.webp)

Chef's kiss for the meme about the customer not wanting to waste "expensive" resources on control plane nodes. :-D

### So I generated over ~~3000~~ 10000+ SBOMS for the CNCF ecosystem - Mario Fahlandt

(I have taken the liberty of using the "updated" title from Mario's presentation.)

![CDS2026 - So I generated over 10000+ SBOMS for the CNCF ecosystem - Mario Fahlandt - SBOM in 60 seconds](/blog/2026/container-days-hamburg-2026/cds2026-sboms-1.webp)

The [EU's "Cyber Resilience Act"](https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act) is one of the things pushing software transparency forward.
The goal is that you should be able to get an SBOM for something like the new AI smart oven in your kitchen and know what software it is actually running.

The CNCF started a project to generate SBOMs for its projects, mainly to find out whether the licenses of the libraries and other software components are compatible.

[SPDX 2.3](https://spdx.github.io/spdx-spec/v2.3/) seems to be the standard they are using for SBOM generation, though a quick search reveals there are different formats.

Their first, "basic" way of generating SBOMs was quite limited. The dependencies that are part of the build process are not only `devDependencies`. GitHub Actions, container images, and other tools used to build and publish the software are also part of the software supply chain and should be included in the SBOMs.

They use [Waybill](https://github.com/kusari-oss/waybill) to generate the SBOMs. From the talk, it sounds like it works well for projects that use multiple languages, for example JavaScript and Golang.

Using GitHub Actions at this scale also caused some issues. For example, there were page-loading errors with so many tasks and artifacts.

The [BOMHort project](https://github.com/seebom-labs/BOMHort) is an [OpenSSF sandbox project](https://openssf.org/). The name comes from the German word "Hort", which can mean a place where treasures are kept-or, in this case, where dragons hoard their riches.

![CDS2026 - So I generated over 10000+ SBOMS for the CNCF ecosystem - Mario Fahlandt - BOMHort project and logo](/blog/2026/container-days-hamburg-2026/cds2026-sboms-2.webp)

![CDS2026 - So I generated over 10000+ SBOMS for the CNCF ecosystem - Mario Fahlandt - What BOMHort does](/blog/2026/container-days-hamburg-2026/cds2026-sboms-3.webp)

They are working on fixing some of the limitations around licenses in SBOMs. For example, someone could accidentally modify a license and end up with "Mario's Apache license", which might not really be an Apache License anymore.

The architecture of BOMHort looks like this:

![CDS2026 - So I generated over 10000+ SBOMS for the CNCF ecosystem - Mario Fahlandt - BOMHort architecture](/blog/2026/container-days-hamburg-2026/cds2026-sboms-4.webp)

From the 10000+ SBOMs they analyzed, these were some of the findings:

- `NOASSERTION` - No license was **identified**, or there was **uncertainty** about the license or other properties of the project or its dependencies.
- "Unresolvable Dependencies" - Dependencies could **not be resolved**, for example because repositories had been removed.
- Licensing - Not every CNCF project makes sure that the correct licenses are specified and used by its dependencies.

![CDS2026 - So I generated over 10000+ SBOMS for the CNCF ecosystem - Mario Fahlandt - The toolchain](/blog/2026/container-days-hamburg-2026/cds2026-sboms-5.webp)

Generating SBOMs after the build is not optimal. Generating them during the build is better, and signing and enriching them is the cherry on top.

![CDS2026 - So I generated over 10000+ SBOMS for the CNCF ecosystem - Mario Fahlandt - Five steps](/blog/2026/container-days-hamburg-2026/cds2026-sboms-6.webp)

"Everything, all in one place"-check out these resources: <https://cncf.io/security> and <https://openssf.org/>.

Hopefully, the "Cyber Resilience Act" causes companies to put more money into actual open source maintenance, instead of "just opening an issue" in the repository and "calling it a job well done."

**In my opinion:** Maintainers being paid for fixing issues and/or maintaining the software would be a nice change, but there is more to it than that.
If you take a project as "basic" but important as `curl`, it is critical that development of such a library continues no matter what.
As things get more expensive, people will have less "free time" to put into open source libraries and projects.
I think the old saying that "time is money" is simply at play here and is a factor for motivation.

You can call me greedy, but if some of my "slightly" more "popular" open source projects brought in a "few bucks"-not hundreds of euros, just a few euros as motivation to keep working on and improving them, that would be nice.
It would also help "everyone" using the project for their own or their company's infrastructure.

It will be quite interesting to see what companies will do when this goes into effect.

### One Platform Could Not Fit Them All - Artem Lajko, Annika Opitz

![CDS2026 - One Platform Could Not Fit Them All - Artem Lajko, Annika Opitz - Terminology](/blog/2026/container-days-hamburg-2026/cds2026-one-platform-1.webp)

Every team builds its own platform. A central platform team will have to work with teams that have very different levels of knowledge and experience.
A central platform team should mostly be about knowledge sharing and helping teams.
Even with a central approach/team, there are still "hard decisions" to make. The CNCF Landscape is huge, and not every tool is the right one for every team.
"Do you work to buy tools or do you work to use them?"

Reports show that even after spending "millions" on internal developer platforms, most teams (64%) still run `kubectl` directly to do things on the "platform". So the "platform" is being "bypassed".

This is where [Kubara](https://kubara.io/) comes in. It packages and distributes "modules" or "apps" for teams to use.

They use a "HUB" cluster for the common tools and "Spoke" clusters for the actual workloads.
If you compare it to other solutions, a "HUB" cluster is basically a management cluster for the "Spoke" clusters.

![CDS2026 - One Platform Could Not Fit Them All - Artem Lajko, Annika Opitz - 2. Add Spoke Clusters. Distribute Workload.](/blog/2026/container-days-hamburg-2026/cds2026-one-platform-2.webp)

Argo CD, GitOps, Helm, and Kustomize are used heavily for this approach.
Adding the "Spokes" also configures Argo CD for them, so they can then be managed centrally.

The (real) challenge is updating more than 15,000 clusters.

Managing that many clusters and their applications needs a different architecture.
Sveltos is used to manage more clusters, simply as a "wrapped application" in Kubara.

In a load test, Sveltos used a lot less memory and CPU than Argo CD. Sadly, I didn't get a chance to take a screenshot. Make sure to check the recordings.

Moving from "inner source" to open source is a challenge:

- Documentation needs to be written for people who are not part of the "inner" circle.
- Legal and trademarks: who pays for them in the company?
- Marketing and promotion.
- A catchy logo or icon.

There is also a project Slack, and community meetings are hosted regularly. If you want to learn more, be sure to check out the documentation and join the Kubara community.

(They are not tied to a specific Kubernetes cluster provider. You "just need a kubeconfig" to get started, although a provider that offers Cluster API would be recommended/needed.)

---

## Day 2

### Building Production-Ready Kubernetes Operators - Fortune Ndlovu

Operators let us extend the Kubernetes API and package deployment and operational knowledge into it.
Helm "only" handles some of the steps involved in running an application, such as installing and "upgrading" it.
Tools like Ansible can go further and manage the whole application lifecycle. Operators can do something similar, but in the native Kubernetes way.

Configuration has several layers, e.g., "defaults" from the operator, options from the CustomResource, and additional overrides that a user can provide via ConfigMaps/Secrets, etc.
To give a concrete example, the "defaults" from an operator could be very specific. With older Java versions, we had to add `-Xms` and `-Xmx` to set the JVM memory limits, while "newer" versions could "read" the container information instead of "confusing" it with the host's resources.
This means that if an operator deploys a Java application as a container, it would need to use "other defaults" for the application to run smoothly.

An operator would need to ensure that the application is running and healthy, which is the operational part of running an application.
One thing that can easily be overlooked is the operator "informing" the application or its deployments about configuration changes.
One way to do this is by using a "config hash", which causes Kubernetes to "auto-restart" the necessary resources when the configuration changes.

They call these customized operators "Flavours", depending on the customer or use case.

![CDS2026 - Building Production-Ready Kubernetes Operators - Fortune Ndlovu - How a flavour extends RHDH](/blog/2026/container-days-hamburg-2026/cds2026-operators-1.webp)

They seemingly allow ConfigMaps to be referenced but also included in a CustomResource. If that is how they are doing it, it can make deploying the application easier, as "everything" would be contained in the one YAML file for the CR.

In the demo, they used a "custom" operator to deploy Backstage. The deployed Backstage instance also included the Lightspeed chatbot, but the chatbot was not working at first.
The initially applied custom resources were missing secrets for, e.g., accessing the AI model. After updating the Custom Resource with the ConfigMaps and Secrets, the operator reconciled the application and the chatbot started working.

Repository URL: <https://github.com/redhat-developer/rhdh-operator>

### Kubernetes RBAC at scale without losing your sanity - Kevin Gimbel

RBAC (Role-Based Access Control), quickly summarized, gives access based on roles. There is no "denying" access, only granting access.

Since Kubernetes 1.8 was released in December 2018, RBAC has been the default authorization mode in Kubernetes. So, we have been using RBAC in Kubernetes for quite a long time, but it is still something you can easily get wrong.
While `aggregationRule` has been part of `ClusterRole` since Kubernetes 1.6 (July 2017), not everyone might be aware of it. The talk highlights the feature and how it can be used to make RBAC easier to manage at scale.

![CDS2026 - Kubernetes RBAC at scale without losing your sanity - Kevin Gimbel - How does RBAC look in Kubernetes?](/blog/2026/container-days-hamburg-2026/cds2026-rbac-1.webp)

To start off, `aggregationRule` is already a standard `ClusterRole` feature in Kubernetes. You do not need an additional operator or any flags on your `kube-apiserver` and friends.
It allows you to, you guessed it, aggregate roles into other "bigger" roles based on label selectors.

The example below would aggregate `ClusterRole`s with the label `rbac.authorization.k8s.io/aggregate-to-developer=true` into the `ClusterRole` named `developer`.

![CDS2026 - Kubernetes RBAC at scale without losing your sanity - Kevin Gimbel - Kubernetes ClusterRole `aggregrationRule` YAML example](/blog/2026/container-days-hamburg-2026/cds2026-rbac-2.webp)

::note
The indentation of the label in the `matchLabels:` block in the `aggregationRule` in the picture is not correct, but you get the idea.
::

Using `aggregationRule` can make it easy to grant access to, e.g., new CRDs. Some operators I know, e.g., [prometheus-operator](https://github.com/prometheus-operator/prometheus-operator), come with `ClusterRole`s for the "default" Kubernetes RBAC roles (e.g., `admin`, `edit`, `view`) to easily allow users of the cluster to use the operator's CRDs.

OpenID Connect (OIDC) provides the "users" on the fly, as Kubernetes does not "store" information about users and groups directly. The login token contains the user information, e.g., name and groups/roles.
This information can then be used in `ClusterRoleBinding`s and `RoleBinding`s to grant access to users and/or the groups they are part of.
The login token is basically a JWT (JSON Web Token):

![CDS2026 - Kubernetes RBAC at scale without losing your sanity - Kevin Gimbel - OIDC Login Flow](/blog/2026/container-days-hamburg-2026/cds2026-rbac-3.webp)

In the past, OIDC could only be configured using `--oidc-*` flags on the `kube-apiserver`. In more recent Kubernetes releases, it can be configured using the [`AuthenticationConfiguration` API resource (`apiserver.config.k8s.io/v1`)](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#api-server-authn-config-file).
This makes the process a bit more streamlined, as it is just another YAML file to place next to the `kube-apiserver` configuration.

One thing that is still annoying with OIDC login is that you need to create a `kubeconfig` file for the user to use, which contains the OIDC "plugin" configuration for the OIDC login, e.g., [kubelogin by int128](https://github.com/int128/kubelogin).
So the user might even need to install additional software besides `kubectl` just to log in to the Kubernetes cluster.

![CDS2026 - Kubernetes RBAC at scale without losing your sanity - Kevin Gimbel - kubeconfig YAML example for OIDC login](/blog/2026/container-days-hamburg-2026/cds2026-rbac-4.webp)

Thanks for the recap slide, Kevin Gimbel! Makes it easier to remember the key points of the talk.

![CDS2026 - Kubernetes RBAC at scale without losing your sanity - Kevin Gimbel - Recap](/blog/2026/container-days-hamburg-2026/cds2026-rbac-5.webp)

For more information about RBAC in Kubernetes, check out the [Kubernetes RBAC documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) and for more information on authentication, check out the [Kubernetes Authentication documentation](https://kubernetes.io/docs/reference/access-authn-authz/authentication/).

### Bootable Containers: An entire OS as a Containerfile - Robert Guske

I haven't been able to attend the whole talk, but I took a few important points for implementing a "fully containerized RHEL OS" approach away from it.

![CDS2026 - Bootable Containers: An entire OS as a Containerfile - Robert Guske - An opinionated way of deploying, configuring, and managing immutable image-based Linux systems](/blog/2026/container-days-hamburg-2026/cds2026-bootable-containers-1.webp)

While it feels a bit weird to "install" a "container" image as an OS, it is still a very interesting way to manage Linux systems. Especially if you think about Flatcar Linux, Talos Linux, and similar systems, which are already somewhat "containerized" OSes.
So, this approach is already being used for quite a few Kubernetes clusters and basically all OpenShift 4 clusters.

Being able to "configure" your OS via a "Containerfile" could make things easier. You could "just" build a new image with the updated configuration and deploy it to your systems.
To update it, you simply build a new image with the updated configuration and deploy it to your systems. "All you need" is an image registry to store the images.
For the "first install", you could use the good old PXE boot approach on bare metal. In the cloud, you could use the cloud provider's "image" service to deploy the image to the systems.

Instead of installing and updating packages, the future seems to be moving towards "installing" container images and updating them from your normal everyday container registry.

![CDS2026 - Bootable Containers: An entire OS as a Containerfile - Robert Guske - Bootc: Image-based updates perfected](/blog/2026/container-days-hamburg-2026/cds2026-bootable-containers-2.webp)

As already mentioned, updating the OS is as simple as pulling the updated container image and rebooting the system. With this approach, you could also roll back if needed.
Similar to Flatcar Linux and Talos Linux, most Android smartphones use [A/B (seamless) system updates](https://source.android.com/docs/core/ota/ab), where two system partitions help ensure that an update can be rolled back if something goes wrong.

### Kafka Without Disks: Making Streaming Brokers Disposable on K8S - Anton Borisov

This is a topic I don't know much about, but I was interested in the "disposable" aspect, as one thing I do know is that Kafka needs persistent storage to work well. :-D

![CDS2026 - Kafka Without Disks: Making Streaming Brokers Disposable on K8S - Anton Borisov - Why are we triple-mirroring every hot byte when the object store already handles durability?](/blog/2026/container-days-hamburg-2026/cds2026-kafka-without-disks-1.webp)

I think I have heard that question before... "Why would a database cluster 'triple replicate' the data while the underlying Ceph storage also 'triple replicates' the data? Isn't that a bit overkill?"
It was also interesting to hear a bit about how the project handles this with KIPs (Kafka Improvement Proposals).

![CDS2026 - Kafka Without Disks: Making Streaming Brokers Disposable on K8S - Anton Borisov - The Good - Slack's KIP-1176](/blog/2026/container-days-hamburg-2026/cds2026-kafka-without-disks-2.webp)

From what I gathered, the implementation they went with feels a lot like how Thanos ("long-term Prometheus monitoring storage") handles this. Thanos queries the "hot" data from the "live" Prometheus via a sidecar, while the "cold" data is stored in object storage, e.g., S3.

It was interesting to hear about Kafka, especially how they are trying to make it "disposable" on Kubernetes.

---

## Day 3

### Federated Identity for Distributed Systems: Understanding SPIFFE - Leon Krass

For authentication and authorization in a distributed "world", you need to know which "user" or "agent" is trying to access a resource.

In the talk, they split identities into two categories:

- Human identities - your classical "meatbag" human user.
- Non-human identities - In the past, this mostly meant "robot users" or "service accounts". Nowadays, with the rise of AI, it could also be an AI agent or "bot" trying to access a resource.

This makes a huge difference in how you handle them. A human may use a password or other identifying information, while a non-human identity will usually use a token or certificate to "prove" its identity.

![CDS2026 - Federated Identity for Distributed Systems: Understanding SPIFFE - Leon Krass - Non-Human Identities](/blog/2026/container-days-hamburg-2026/cds2026-spiffe-1.webp)

Broken down further, a human identity is a physical entity with attributes, such as a name or email address, that are mapped to digital attributes.
A non-human identity is a digital entity with digital attributes, for example, a Kubernetes service account.

![CDS2026 - Federated Identity for Distributed Systems: Understanding SPIFFE - Leon Krass - Trust Boundaries and Identity Federation](/blog/2026/container-days-hamburg-2026/cds2026-spiffe-2.webp)

In the past, distributed systems were mostly "static", so using something like an IP address as the identity was often enough. In a dynamic system-where workloads can scale, move between platforms, or be replaced-the network identity is no longer enough.

This becomes even more challenging when authentication and authorization need to work across platforms. In the age of AI, you especially want to know what an agent did, while also being able to limit what that agent is allowed to do, including across platforms.

![CDS2026 - Federated Identity for Distributed Systems: Understanding SPIFFE - Leon Krass - Challenges with (Non-) Human Identities](/blog/2026/container-days-hamburg-2026/cds2026-spiffe-3.webp)

[SPIFFE](https://spiffe.io/) stands for "Secure Production Identity Framework For Everyone".

"The Bottom Turtle Analogy"

![CDS2026 - Federated Identity for Distributed Systems: Understanding SPIFFE - Leon Krass - The Bottom Turtle Analogy](/blog/2026/container-days-hamburg-2026/cds2026-spiffe-4.webp)

The idea is basically a chain of trust, or a "trust chain".

SPIFFE provides non-human identities that can be cryptographically verified and used across platforms.
An SVID, or "SPIFFE Verifiable Identity Document", is the document containing that identity. It is usually represented as an X.509 certificate or a JWT and can be used to verify the identity of a workload.
In the end, the cryptography itself is not new. Certificates, JWTs, signing, and verification are all established technologies. SPIFFE provides a common framework for using them to identify workloads.

A SPIFFE identity service can establish and federate trust across platforms, for example between a Kubernetes cluster and a VM-based system.

SPIRE is the reference implementation of SPIFFE. Red Hat OpenShift and HashiCorp Vault Enterprise also support or integrate with SPIFFE/SPIRE.

![CDS2026 - Federated Identity for Distributed Systems: Understanding SPIFFE - Leon Krass - SPIFFE + SPIRE Live Demo](/blog/2026/container-days-hamburg-2026/cds2026-spiffe-5.webp)

They also showed a CSI driver for using SPIFFE/SPIRE identities in Kubernetes-based environments.
SPIRE also provides CRDs for configuring the SPIFFE/SPIRE service in Kubernetes. For example, the trust domain can be configured, and pod label selectors can be used to determine which pods should receive a SPIFFE identity.

In the X.509 demo, a client retrieved a certificate from SPIRE and used it to authenticate to a server that also had a SPIFFE identity. The client and server were able to verify each other's certificates because the certificates were issued by the same certificate authority within the same SPIFFE trust domain.

That is the main benefit of SPIFFE: workloads can authenticate based on who they are instead of where they currently run or which IP address they have.

### Kubernetes as the Universal Control Plane: From Pods to Multi-Cloud Infrastructure - Rabieh Fashwall

> "Infrastructure as Code is great until there's a bug and finops/finance is on your back (about the bill)."
> - Rabieh Fashwall (The quote is not fully verbatim, but the meaning is the same.)

Every cloud provider has its own CLIs, tooling, and Terraform code for creating resources. For example, "creating a database" can mean something very different across providers in regard to what needs to happen.
This can lead to fragmentation. Every team ends up with its own toolchain and way of doing things. A company-wide "cloud strategy" can turn into a game of "disk fragmentation" when trying to
manage resources across multiple clouds and, more importantly, consolidate cloud resources and costs.

If you wanna create a database in the cloud, you gotta create VPCs, subnets, security groups/profiles, etc., to get it up and running and integrate it into your existing cloud infrastructure.
In the "YAML world", aka Kubernetes, this can be simpler when using custom resources and operators. A "Database" custom resource definition (CRD) could be used to define the desired state of a database, and an operator would be responsible for managing the lifecycle of that database.

![CDS2026 - Kubernetes as the Universal Control Plane: From Pods to Multi-Cloud Infrastructure - Rabieh Fashwall - Crossplane: The Cloud-Native Infrastructure Manager](/blog/2026/container-days-hamburg-2026/cds2026-crossplane-1.webp)

But how would you go about creating operators for every resource and every cloud provider? That would definitely be a lot of work just to get some cloud resources managed in Kubernetes. This is where a tool like Crossplane comes into play.
Crossplane allows you to manage cloud resources through Kubernetes APIs. Cloud resources can then be defined and managed as Kubernetes custom resources, so you can use the same declarative approach you already know from Kubernetes.
To interject, calling Crossplane just a "tool" would be an understatement. It is more like a framework for building your own operators for cloud resources. It also comes with a lot of community-built providers, e.g., for AWS, Azure, GCP, etc., as well as a "provider for Kubernetes" to manage resources in other Kubernetes clusters.

With the Kubernetes provider, you could even manage Kubernetes clusters via the Cluster API (CAPI) and the Cluster API provider for your cloud provider of choice, e.g., AWS, Azure, GCP, etc. It's just YAML in the end.

![CDS2026 - Kubernetes as the Universal Control Plane: From Pods to Multi-Cloud Infrastructure - Rabieh Fashwall - Demo Time: From kubectl to a running database](/blog/2026/container-days-hamburg-2026/cds2026-crossplane-2.webp)

But to get back to the talk, it focused on using Crossplane to manage cloud resources for developers and teams.
The demo showed how Crossplane could provision a cloud database through a `DatabaseClaim`. The `DatabaseClaim` is a Crossplane custom resource that defines the desired state of a database.
The credentials were stored in a Kubernetes Secret, which can be used by apps to connect to the database. The demo also showed that changing the `DatabaseClaim` would trigger Crossplane to update the database resource accordingly, e.g., changing the size of the database from `small` to `medium`.

![CDS2026 - Kubernetes as the Universal Control Plane: From Pods to Multi-Cloud Infrastructure - Rabieh Fashwall - The Power Combo: Crossplane + Cluster API](/blog/2026/container-days-hamburg-2026/cds2026-crossplane-3.webp)

[Crossplane](https://www.crossplane.io/) is great, but what happens when you combine it with the powerful Cluster API (CAPI)? The demo showed how easy it can be to create a cluster and scale it up or down (adding or removing nodes) with Cluster API.
Bringing Crossplane back into the picture, developers could "easily" create a new test environment with a cluster and a database using GitOps.
In the demo, they used ArgoCD for the GitOps part, but you could use any GitOps tool of your choice, e.g., FluxCD.

![CDS2026 - Kubernetes as the Universal Control Plane: From Pods to Multi-Cloud Infrastructure - Rabieh Fashwall - The Internal Developer Platform: Self-Service Infrastructure](/blog/2026/container-days-hamburg-2026/cds2026-crossplane-4.webp)

![CDS2026 - Kubernetes as the Universal Control Plane: From Pods to Multi-Cloud Infrastructure - Rabieh Fashwall - Challenges You'll Face](/blog/2026/container-days-hamburg-2026/cds2026-crossplane-5.webp)

I have to say that the title of the talk felt like it promised something more or something "new" than it delivered. Still, it was a good refresher on Crossplane and CAPI, especially the last two pictures about the layers of developer self-service and the "challenges you'll face."
As a consultant, the pain is real. Just shoving Crossplane, CAPI, and GitOps tools into a company and saying, "Here you go, now you can self-service your infrastructure," is not going to work.
There are many more factors to consider, e.g., security, compliance, cost management, etc., but also the "human factor."
One point about the "human factor" I want to highlight is that some people, or even whole teams, might not actually want to "self-service" the infrastructure for their applications. You gotta show them gradually that it actually makes their lives easier.

---

## The Future

Based on the plans laid out for upcoming ContainerDays and AIContext conferences, ContainerDays seems to be successful. I have to agree that ContainerDays is my favorite conference, besides events such as FOSDEM. Those are great as well, but in their own category.

Be sure to check out the [ContainerDays YouTube channel](https://www.youtube.com/@ContainerDays) for the upcoming recordings and check the [ContainerDays website](https://www.containerdays.io) for upcoming ContainerDays and AIContext-related events (use the "View all events" button in the top right of the page). I should be attending next year's ContainerDays in Hamburg if my planning works out.

![CDS2026 - Future Events World Map](/blog/2026/container-days-hamburg-2026/cds2026-future-events.webp)
