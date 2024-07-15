---
title: Adlists / Blocklists
---

This example would add the `Unified hosts + fakenews + gambling + social` block list from [GitHub StevenBlack/hostst](https://github.com/stevenblack/hosts):

```bash
/ip/dns/adlist
add url=https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews-gambling-social/hosts comment="GitHub stevenblack/hosts - Unified hosts + fakenews + gambling + social list" ssl-verify=yes
```

::callout
I can recommend to add a meaningful comment so you know where this list comes from besides the URL of the list.
::

For a list of some IP blocklists, see [IP-Blocklists page](/docs/networking/ip-blocklists).
