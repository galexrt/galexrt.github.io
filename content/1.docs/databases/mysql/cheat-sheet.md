---
title: "Cheat Sheet"
icon: 'i-ph-table'
---

## Re-Create the `debian-sys-maint` User

```bash
mysqldump --complete-insert --extended-insert=0 -u root -p mysql | grep 'debian-sys-maint'
```
