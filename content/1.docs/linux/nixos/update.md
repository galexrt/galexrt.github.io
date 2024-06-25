---
title: Update
---

```console
nix-channel --remove home-manager
nix-channel --add https://github.com/nix-community/home-manager/archive/release-24.05.tar.gz home-manager

nix-channel --remove nixos
nix-channel --add https://nixos.org/channels/nixos-24.05 nixos

nix-channel --update
```
