---
title: Certificates
icon: 'i-ph-shield-check'
---


## Create "Master of Disaster" User - `system:masters` Full Access

To quote [this great "Kubernetes — How to create a system:masters user and why you REALLY shouldn't" blog post](https://medium.com/@JoooostB/kubernetes-how-to-create-a-system-masters-user-and-why-you-really-shouldnt-8c17d19e7b8e) by [Joost Buskermolen](https://medium.com/@JoooostB):

> Although nothing prevents us from doing anything stupid with the Kubernetes API while being granted access, selectively assigning roles you need on a day-to-day basis to your account can prevent serious damage. Only use a `system:masters` account when you absolutely have to, but for your daily operations I'd advise using credentials with fine-grained access control.

```bash
openssl genrsa -out bicoe.key 4096
openssl req -new -key bicoe.key -out bicoe.csr -subj "/CN=bicoe/O=system:masters"

openssl x509 -req -in bicoe.csr -CA rootca.crt -CAkey rootca.key -CAcreateserial -out bicoe.crt
openssl x509 -in bicoe.crt -text -noout
```
