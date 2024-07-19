---
title: Cleanup Storage
---

```js
# Delete 7 days old OS generations and garbage
nix-env --delete-generations 7d
nix-store --gc
nix-channel --update
nix-env -u --always
nix-collect-garbage -d
nix-collect-garbage --delete-older-than 7d
```
