---
title: "It's Slow and I Don't Know Why"
date: 2023-07-25T00:00:00+02:00
description: "We've been there. Here are some debugging tools and tips for getting to the bottom of storage performance issues."
image: "/blog/2023/its-slow-and-i-dont-know-why.jpg"
authors:
  - name: Alexander Trost
    to: https://github.com/galexrt
    avatar:
      src: /images/profile-picture.jpg
---

::callout{icon="i-ph-info" color="info"}
This blog post is originally from the Koor Technologies, Inc. website which due Koor Technologies, Inc. closure in early 2024 doesn't exist anymore.
::

::callout
Cover photo credits go to [Close up Photo of Turtle](https://www.pexels.com/photo/close-up-photo-of-turtle-2613148/) by [David Dibert](https://twitter.com/dibert)
::

Today I'm going to talk about how I approach debugging storage performance problems. There's a kind of [pincer movement](https://en.wikipedia.org/wiki/Pincer_movement) I like to do to narrow in on the cause, covering these areas:

- Hardware
- Network
- Operating system
- Application
- Correlated jobs
- The type of storage you're using

The very first question I recommend asking is:

## What is your hardware capable of?

Hard drives are slow. If you're using a standardized framework that no one else seems to have an issue with, it could be your hardware. I often find that people have expectations of their hardware that just aren't realistic. Even if you implement smart caching or some other magic, there's no getting past the physical constraints of your hardware.

While SSDs (solid state drives) offer slightly better performance, even the newer NVMe (Non-Volatile Memory Express) SSDs have their limitations (for instance, [whether your NVMe SSD has power loss protection or not can impact its speed](https://blog.okami.dev/ceph-etcd-and-the-sync-hole/)). So, your first step is always to test your hardware.

## Fio

You can use [Fio](https://github.com/axboe/fio) (Flexible I/O Tester) for benchmarking and performance testing storage devices by simulating input/output (I/O) workloads. You can create customized workloads that closely resemble real-world usage patterns, by specifying the type of operations, the size of data being read or written, the number of threads or concurrent operations, and other parameters.

For example:

```
sudo fio \
--filename=device/file name \
--direct=1 \
--rw=randread \
--bs=4k \
--ioengine=libaio \
--iodepth=256 \
--runtime=120 \
--numjobs=4 \
--time_based \
--group_reporting \
--name=iops-test-job \
--eta-newline=1 \
--readonly
```

This script runs Fio, testing random reads of your device for 120 seconds. There are lots more [examples in the GitHub repo](https://github.com/axboe/fio/tree/master/examples).

## What is your network capable of?

If you've ruled out a hardware issue, the next layer to consider is your network capacity. The nature of storage management is that your client and database need to talk to each other. So even if your hardware is capable of higher throughput than what you're getting, if your network is limited to 1 gigabit, that's all you're going to get.

Every time you write 1 byte of data, it needs to be replicated. It's recommended that organizations using Ceph for storage management use two networks per Ceph cluster: one for "public" client communication with Ceph cluster components and one for data replication traffic (you can learn more in [our blog post about how this works in Kubernetes for Rook Ceph networking](/blog/2023/multus-is-the-way-to-go-for-rook-ceph-networking/)).

Of course, you're not always fortunate enough to be architecting your own network setup: at large organizations, you may be working with a network that is 5-10 years old and simply wasn't designed to be up to the load you're expecting of it today.

There are some tools that can help you test for networking issues:

### iperf

[Iperf3](https://github.com/esnet/iperf) lets you measure the maximum achievable bandwidth on TCP, UDP, and SCTP networks. It's commonly used to assess performance, latency, and packet loss between two devices, using a client-server model. You can adjust the duration of the test, amount of data sent, or network protocol, depending on your network setup and needs. Here's an example of [how to perform advanced network throughput testing in Linux with iperf](https://www.tecmint.com/test-network-throughput-in-linux/).

### Ancientt

For more advanced and granular network performance testing, you can use [Ancientt](https://github.com/galexrt/ancientt) to automatically run tools like iperf3 in dynamic environments like Kubernetes. Ancientt's output is a sheet where you can identify outlier nodes with poor performance—helping you to isolate variations in latency (jitter), out-of-order packets, retransmissions, and other anomalies. Check out a [demo of Ancientt in action here](https://github.com/galexrt/ancientt/blob/main/docs/demos.md).

## Is there a misconfiguration with your operating system?

You've ruled out your hardware. Your network is up to the job. Now what? You can continue your search upwards from the bottom (your operating system, kernel, drivers) or test from the top downwards (your application), closing in on the root of your problem.

![Linux 6.2 Storage Stack Diagram by "Werner Fischer" - Thomas-Krenn.AG](/blog/2023/its-slow-and-i-dont-know-why/Linux-storage-stack-diagram_v6.2.png)

::callout
Diagram by ["Werner Fischer"](https://www.thomas-krenn.com/en/wiki/User:Wfischer) from the [Linux Storage Stack Diagram - Thomas-Krenn Wiki](https://www.thomas-krenn.com/en/wiki/Linux_Storage_Stack_Diagram) licensed under CC-BY-SA 3.0.
::

Critically, you need to approach testing layer by layer, rather than running tests in parallel, which can lead to murky results. Ideally you should isolate your tests on storage (a real pincer movement would be simultaneous, but it's still a helpful visual).

### SAR

[SAR](https://linux.die.net/man/1/sar) (System Activity Reporter) enables you to collect data about your operating system's performance (things like CPU and memory usage, disk activity, etc.) You can save the `sar` command's output automatically to files where, over time, you may be able to spot patterns of high resource usage or overloading.

## When your storage performance slows down, what else is happening at the time?

Story time: In a previous role, I worked with a customer who was using Ceph and experiencing massive slowdowns with their storage performance. We started with their hardware and network capacity, but the cause eluded us. Non-hardware issues are harder to diagnose.

So, going by the bottom-up then top-down approach above, we looked at their application logs.

> *Wait a minute, these slowdowns keep happening at 2AM.*<br/>
> *Are there any jobs running at that time?*<br/>
> *Oh yes, they run backups at that time.*

For context, the [Ceph Manager](https://docs.ceph.com/en/quincy/mgr/#ceph-manager-daemon) is a vital component of the Ceph cluster. The customer had [autoscaling placement groups](https://docs.ceph.com/en/latest/rados/operations/placement-groups/) (PGs) enabled, which was creating an unintended effect. Each of the customer's backups of around 50GB was being read and immediately written to the same cluster, triggering autoscaling to accommodate the sudden increase in data.

When the backup was completed and the 50GB of data written, it simply disappeared from the cluster, prompting autoscaling to scale back down again. Now, this wasn't a bug or an issue so much as the computer doing what it was told to do, but this continual scaling up and down was extremely resource intensive, hence the hard slowdowns. The thing with autoscaling—in any context—is you can't just set it and forget it. You need to pay attention to the impact of autoscaling so you aren't caught out by a misconfiguration.

By looking at the timing of those slowdowns, we were able to correlate the issue with the backups, which helped us to close in on the cause. As a first step we introduced a delay that staggered the backups, reducing the stress on the system and therefore mitigating the slowdowns. We also disabled the PG autoscaler and set a calculated PG count for the affected storage pool that worked much better for the workload.

## Are you using the right kind of storage for your needs?

Performance issues can creep in when using a different storage system than your use case requires.

- Object storage: Ideal for storing and retrieving unstructured data, like backups. It's great for scalability and high availability, but it's not as fast as block storage.
- Block storage: Typically used for applications requiring low-level access to data storage, like databases, virtual machines (VMs), and enterprise applications. It's handy for situations where you can't afford latency or outages.
- File system storage: If you've got hierarchical directory structures and need a familiar interface and compatibility with other file-sharing applications, file system storage does the job. It can be slowed down, though, if you have file locking set up incorrectly—leading to unexplained timeouts.

We'll explore the different types of storage systems in more depth in an upcoming post.

## What's your story?

We'd love to hear about your challenges with storage performance. [Tweet us](https://twitter.com/koor_tech) (or [X us](https://x.com/koor_tech)?) with your story.

---

*Our appreciation and gratitude to [Rebecca Dodd](https://thebasementoffice.co.uk/) who made this post possible.*
