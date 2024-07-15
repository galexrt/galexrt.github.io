---
title: System Requirements
---

::callout{icon="i-ph-lightbulb-filament"}
**Tip**: Recommendations for Requirements
These are **recommendations** for requirements of Kubernetes Masters and Nodes.
::

## General

Network:

- **Bandwidth**: at the very least 1G, recommended for smaller, lower traffic environents is 10G, 25G or more.

::callout{icon="i-ph-lightbulb-filament"}
**Info**:
To reduce costs you can get away with just having **a single interface**, instead of, e.g., 2 interfaces being bonded together (it also reduces complexity).
::

## Master

### Storage

::callout{icon="i-ph-lightbulb-filament"}
**Warning**:
"SSDs or even NVMe based storage is more expensive but your ETCD will love and need it!"
**DO NOT USE** HDDs nor any kind of networked storage for ETCD!

Even a fast Ceph RBD (e.g., when running in VMs) can look good in the beginning but might "kill" the ETCD performance in the end!

**Too many users of Kubernetes or OpenShift do that and end up with slow performing clusters in many different ways, simply because the ETCD is slow (even though the kube-apiservers are caching a lot)**
::

Use at least SSDs (minimum SATA based, better NVMe based) or any other storage with **low latencies**! ETCD is pretty much latency bound. It needs "few" IOPS but latency is the killer (sequential writing, e.g., WAL and DB).
