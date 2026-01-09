---
title: "Other exporters"
---

Checkout the [official Prometheus exporters list](https://prometheus.io/docs/instrumenting/exporters/#exporters-and-integrations) for many more exporters.

Some notable mentions:

- [smartctl_exporter](https://github.com/prometheus-community/smartctl_exporter) - Exports SMART stats as Prometheus metrics. Should be prefered over using node\_exporter's textfile collector + textfile scripts for SMART metrics.
