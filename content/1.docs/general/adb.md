---
title: ADB
icon: 'i-simple-icons-android'
---

## adb: `error: insufficient permissions for device`

If you have already tried to restart the `adb` server, make sure that the device "USB connection mode" is set to MTP/ "File Transfer".

Tap the notification to open up the USB mode preferences:

![Android USB Mode Notification](/docs/general/adb/adb-usb-notification.png)

In the USB mode preferences, the "Use USB for" should have "File transfer / Android Auto" option checked.

![Android USB Mode Preferences](/docs/general/adb/adb-usb-preferences.png)
