---
title: Quick NixOS VM
---

::callout
The files and instructions of this page have been based on <https://jeancharles.quillet.org/posts/2023-01-16-Basic-nix-vm-for-just-anything.html> by [Jean-Charles](https://jeancharles.quillet.org/) which was a great way for me to get NixOS VMs up'n'running easy to dev on projects.
::

## Requirements

- You need to have a virtualization provider set up in your running NixOS, see [Virtualization - NixOS Wiki](https://nixos.wiki/wiki/Virtualization).

::callout
I will be using QEMU/KVM in these examples.
::

## Steps

### 1. Init git repository and create files

```js
mkdir quick-vm
cd quick-vm
git init
```

Now create/copy the files from the [files section](#files).

### 2. Load Nix Flake Dependencies

```js
nix flake update
```

### 3. Customize the VM via the `vm.nix` file

My example `vm.nix` uses home-manager to manage the user which made some things for me easier.

### 4. Build and run VM

```bash
./result/bin/run-nixos-vm
```

#### If you want to be able to SSH into the VM run the following command instead:

```bash
QEMU_NET_OPTS="hostfwd=tcp::2222-:22" ./result/bin/run-nixos-vm
```

Then you can use `ssh` to connect via the `guest` user:

```js
ssh guest@localhost -p 22
```

## Files

```json [flake.nix]
{
  description = "Quick NixOS (24.05) VM";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-24.05";
  };

  outputs = { self, nixpkgs }: {

    nixosConfigurations.vm = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [ ./vm.nix ];
    };
  };
}
```

```json [vm.nix]
# Build this VM with nix build  ./#nixosConfigurations.vm.config.system.build.vm
# Then run is with: ./result/bin/run-nixos-vm
# To be able to connect with ssh enable port forwarding with:
# QEMU_NET_OPTS="hostfwd=tcp::2222-:22" ./result/bin/run-nixos-vm
# Then connect with ssh -p 2222 guest@localhost
{ lib, config, pkgs, ... }:
let
  home-manager = builtins.fetchTarball {
    url = "https://github.com/nix-community/home-manager/archive/release-24.05.tar.gz";
    sha256 = "sha256:0c83di08nhkzq0cwc3v7aax3x8y5m7qahyzxppinzwxi3r8fnjq3";
  };
in
{
  imports = [
    (import "${home-manager}/nixos")
  ];

  nixpkgs.config.permittedInsecurePackages = [
    # If you need Python 2.7 for some older project
    #"python-2.7.18.8"
  ];

  # Internationalisation options
  i18n.defaultLocale = "en_US.UTF-8";
  console.keyMap = "en";

  # Options for the screen
  virtualisation.vmVariant = {
    virtualisation.diskSize = 10 * 1024 * 1024;
    virtualisation.resolution = {
      x = 1280;
      y = 1024;
    };
    virtualisation.qemu.options = [
      # Better display option
      "-vga virtio"
      "-display gtk,gl=on,zoom-to-fit=false,show-cursor=on"
      # Enable copy/paste
      # https://www.kraxel.org/blog/2021/05/qemu-cut-paste/
      "-chardev qemu-vdagent,id=ch1,name=vdagent,clipboard=on"
      "-device virtio-serial-pci"
      "-device virtserialport,chardev=ch1,id=ch1,name=com.redhat.spice.0"
    ];
  };

  # A default user able to use sudo
  users.users.guest = {
    isNormalUser = true;
    home = "/home/guest";
    extraGroups = [ "wheel" ];
    initialPassword = "guest";
    shell = pkgs.zsh;
  };

  security.sudo.wheelNeedsPassword = false;

  # X configuration
  services.xserver.enable = true;
  services.xserver.xkb.layout = "de";

  services.displayManager.autoLogin.user = "guest";
  services.xserver.desktopManager.xfce.enable = true;
  services.xserver.desktopManager.xfce.enableScreensaver = false;

  services.xserver.videoDrivers = [ "qxl" ];

  # For copy/paste to (sometimes) work
  services.spice-vdagentd.enable = true;

  # Enable ssh
  services.sshd.enable = true;

  programs.nix-ld.enable = true;

  nixpkgs.config.allowUnfree = true; # Allow unfree package

  # Included system packages here
  environment.systemPackages = with pkgs; [
    curl
    dig
    git
    vscodium
    hey
    httpie
    google-chrome
    neovim
    wget
    wrk
    vim
  ];

  programs.zsh = {
    enable = true;
  };

  home-manager.users.guest = {
    home.stateVersion = "24.05";

    home.username = "guest";
    home.homeDirectory = "/home/guest";

    home.packages = with pkgs; [
      # Dev Tools
      autogen
      gcc
      gnumake
      autoconf
      libtool
      automake115x
      gettext
      gnum4
      glib
      glibc
      glibcLocales
      bison
      python3
      gtk3
      cmake
      pkg-config
      # Just add your own tools that you need here
    ];
  };

  system.stateVersion = "24.05";
}
```
