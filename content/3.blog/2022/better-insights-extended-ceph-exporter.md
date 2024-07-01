---
title: "Better Insights: Extended Ceph Exporter for your Ceph Clusters"
date: 2022-09-27T09:25:13+02:00
description: 'We are happy to announce that our `extended-ceph-exporter` project is hereby publicly available.'
image: "/blog/2022/better-insights-extended-ceph-exporter.jpg"
authors:
  - name: Alexander Trost
    to: https://github.com/galexrt
    avatar:
      src: /images/profile-picture.jpg
  - name: Gaurav Sitlani
---

::callout{icon="i-ph-info" color="blue"}
This blog post is originally from the Koor Technologies, Inc. website which due Koor Technologies, Inc. closure in early 2024 doesn't exist anymore.
::

::callout{icon="i-ph-check-circle" color="green"}
To continue the work on the `extended-ceph-exporter` project, I have created an independent fork on GitHub [galexrt/extended-ceph-exporter](https://github.com/galexrt/extended-ceph-exporter).
::

We are happy to announce that our `extended-ceph-exporter` project is hereby publicly available to anyone under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

## What is the `extended-ceph-exporter`?

It is a Prometheus metrics exporter to provide extended metrics from a Ceph cluster.

## What "extended" metrics are "exported"?

Currently we have two modules that focus on the RGW S3 object storage aspect of Ceph.
We are exporting the RGW Bucket Usage information and User Quota information which enables the users to understand the current usage about their Object Storage cluster.
This is to improve visibility into application’s object storage usage.
For these two metric modules we are getting the metrics through the `RGW S3 Admin API` using the `go-ceph` rgw/admin API.
The metrics are collected at the Prometheus metrics endpoint which are eventually used for displaying the information in a nice Grafana dashboard.

![Dashboard](https://github.com/koor-tech/extended-ceph-exporter/blob/main/grafana/ceph-rgw-bucket-usage-overview.png?raw=true)

The above dashboard will help in monitoring which buckets are consuming your storage based on the object count and bucket sizes.
If the user wants to know if they've set and enabled Quota on their bucket and how much storage they have consumed based on that, this will make the life easier with this information being right in front on a nice dashboard. Furthermore, it would really help in managing the Day 2 operation aspect of the buckets if there's a need to delete some data or scale up your cluster by adding more storage and increasing your Quota.

## Thanks!

Check it out on GitHub: [https://github.com/koor-tech/extended-ceph-exporter](https://github.com/koor-tech/extended-ceph-exporter).

If you have any feedback please feel free to share and start a [discussion](https://github.com/koor-tech/extended-ceph-exporter/discussions/) on the `extended-ceph-exporter` Github project.

::callout{icon="i-ph-check-circle" color="green"}
To continue the work on the `extended-ceph-exporter` project, I have created an independent fork on GitHub [galexrt/extended-ceph-exporter](https://github.com/galexrt/extended-ceph-exporter).
::
