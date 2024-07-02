---
title: "Architecture"
date: 2019-02-01
icon: 'i-ph-compass-tool'
---

_The source for the diagrams, can be found as `.graphml` at the same path as the images._

## Rook Ceph Components

Where the "basic" components are the rook-ceph-agent and `rook-discover` DaemonSet.

![rook-operator-cluster-architecture-overview.png](/docs/storage/rook/architecture/rook-operator-cluster-architecture-overview.png)

::callout{icon="i-ph-lightbulb-filament"}
**Info**:
    * Rook Ceph Discovery DaemonSet is **only started after at least one CephCluster has been created!**
    * Rook Ceph Agent ("Flex driver") was used in earlier Rook Ceph versions for mounting storage, before it a switch to use Ceph CSI driver was made.
::
