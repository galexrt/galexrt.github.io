---
title: Ingress
---

## Kubernetes NGINX Ingress Controller

### Installation

You can find the official Installation guides [here](https://kubernetes.github.io/ingress-nginx/deploy/).

### Securing your Endpoints: `/healthz`, `/metrics` and Friends

::callout
I'm talking about the [kubernetes/ingress-nginx controller](https://github.com/kubernetes/ingress-nginx) and **not** the [NGINX Inc one](https://github.com/nginx/kubernetes-ingress).
::

With this NGINX server block snippet you can make sure that these endpoints (you can extend the list), can't be accessed from externally.

```text [nginx-snippet.conf]
location ~ ^/(healthz|metrics|readiness) {
    deny all;
    return 404;
}
```

### Helm Chart Values

If you want to apply the `server-snippet` config option globally, you would add it to your Ingress NGINX Helm chart values like this:

```yaml [values.yaml]
controller:
  config:
    server-snippet: |
      location ~ ^/(healthz|metrics|readiness) {
        deny all;
        return 404;
      }
```

### Other Installations

When not using the Helm chart you would need to enable [the configmap for configuration]() ([Example](https://kubernetes.github.io/ingress-nginx/examples/customization/custom-configuration/)) and add the option to it, example:

```yaml [configmap.yaml]
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-configuration
data:
  server-snippet: |
    location ~ ^/(healthz|metrics|readiness) {
        deny all;
        return 404;
    }
```
::
