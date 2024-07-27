---
title: Raspberry Pi
---

::callout
For more information about Raspberry Pi `config.txt` please visit [Raspberry Pi Documentation - `config.txt`](https://www.raspberrypi.com/documentation/computers/config_txt.html).
::

## Disable Wifi and BT

```bash
dtoverlay=disable-wifi
dtoverlay=disable-bt
```

## Raspberry Pi 5 specific

### Enable NVMe and PCIe Gen 3

To enable NVMe and the experimental PCIe Gen 3 support add the following to the bottom of your `/boot/config.txt` file.

```bash
dtparam=nvme
dtparam=pciex1_gen=3
```

### Enable full USB current

Necessary if you use a PoE hat and want to boot of USB devices. You must make sure to have a power supply/PoE hat that delivers enough power `5V 5A`.

```
usb_max_current_enable=1
```
