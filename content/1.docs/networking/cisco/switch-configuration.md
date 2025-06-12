---
title: Switch Configuration
icon: i-mdi-switch
---

## Basic Commands

- `enable` - Privileged mode.
- `configure terminal` - Enter global config mode
- `hostname NAME` - Set a hostname
- `configure terminal` - Enable config mode.
- `no ip domain lookup` - Disable accidental DNS lookup (in priv and non priv mode).
- `exit` - Go one mode back.

## Config Mode

Enter config mode using `configure terminal`.

- `line console 0` - Enter line `console 0` "interface".
- `interface Gi 0/48` - Enter Interface Gigabit 0/48 interface.
- `ip address IP_ADDR SUBNET_MASK` - Set IP\_ADDR and the SUBNET\_MASK for an interface.

## Make interface dedicated for mgmt

```bash
configure terminal
interface Gi 0/48
no interface port
int vlan1
shutdown
exit
ip default-gateway DEFAULT_GATEWAY
```

## Set IP address on interface

```bash
configure terminal
interface Gi 0/48
ip address IP_ADDR SUBNET_MASK
```

## "Activate" SSH RSA Key

```bash
crypto key generate rsa general-keys modulus 4096 label sw-azubi-1
```

## Show interface status

```bash
do show interface status
```

## Add passwords to console login thingy

```bash
configure terminal
line console 0
password YOUR_PASSWORD
line vty 0 4
login
password YOUR_PASSWORD
exit
```

In the global config mode:

```bash
enable secret YOUR_PASSWORD
```
