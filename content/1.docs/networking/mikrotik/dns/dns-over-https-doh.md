---
title: DNS over HTTPS (DOH)
---

## 1. Import CA certs

This is required to verify the certificates provided by the DoH server(s).

```js
# On your Mikrotik Router
/tool fetch url=https://curl.se/ca/cacert.pem
/certificate import file-name=cacert.pem passphrase=""
```

## 2. (Optional) Setup Static DNS entry for DoH domain name

In this guide I will be using Cloudflare "Block malware" DoH server,<https://developers.cloudflare.com/1.1.1.1/setup/#dns-over-https-doh>, in the end the process is the same for any DoH domain name.

Resolve the domain name, e.g., `security.cloudflare-dns.com` , using a tool such as `nslookup IP_ADDRESS` , `host IP_ADDRESS` to get the IP addresses behind that domain name.

```js
$ host security.cloudflare-dns.com
security.cloudflare-dns.com has address 1.1.1.2
security.cloudflare-dns.com has address 1.0.0.2
security.cloudflare-dns.com has IPv6 address 2606:4700:4700::1112
security.cloudflare-dns.com has IPv6 address 2606:4700:4700::1002
```

::callout
If you have IPv6 available, I would recommend using the IPv6 address(es) (DNS AAAA records) instead of IPv4. Though this will depend on your ISPs performance of IPv4 vs IPv6.
::

Use the following commands to add the static DNS records to your Mikrotik router's DNS server:

### Using IPv4 addresses

```js
# On your Mikrotik Router
/ip dns static
add address=1.1.1.2 name=security.cloudflare-dns.com type=A
add address=1.0.0.2 name=security.cloudflare-dns.com type=A
```

### Using IPv6 addresses

```js
# On your Mikrotik Router
/ip dns static
add address=2606:4700:4700::1112 name=security.cloudflare-dns.com type=AAAA
add address=2606:4700:4700::1002 name=security.cloudflare-dns.com type=AAAA
```

### Using both

Just run the commands from the IPv4 and IPv6 section after each other.

## 3. Enable DoH server

::callout
You might need to adjust your firewall rules to allow traffic from/to the DNS DoH server addresses, but that depends on your network setup so it is out of scope for this guide.
::

```js
# On your Mikrotik Router
/ip/dns
set use-doh-server="https://security.cloudflare-dns.com/dns-query" servers="" verify-doh-cert=yes
```

Make sure that you provide the whole URL to the DoH server's API including the path (`/dns-query` ) and `https://` protocol parts.

## 4. Test DNS resolution

On any device that uses the Mikrotik router's DNS server you can use the `host`, `nslookup`, etc., commands to see if you can still successfully resolve DNS names.

```js
$ host example.com
example.com has address 93.184.215.14
example.com has IPv6 address 2606:2800:21f:cb07:6820:80da:af6b:8b2c
example.com mail is handled by 0 .
```

## DNS resolution via DoH not working?

### Check the router's logs for errors

```js
# On your Mikrotik Router
/log/print
```

### DoH server requires HTTP2?

This can be hard to debug, but if you use "modern" DoH servers, like, e..g, [Mullvad VPN](https://mullvad.net/en/help/dns-over-https-and-dns-over-tls), your Mikrotik router will be unable to resolve any DNS records with errors in the router logs.

Reason for that is that Mikrotik's RouterOS doesn't seem to support HTTP2 which is required for some DoH servers, see [https://forum.mikrotik.com/viewtopic.php?t=204217#p1054921.](https://forum.mikrotik.com/viewtopic.php?t=204217#p1054921)
