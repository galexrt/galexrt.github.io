---
title: Raspberry Pi
icon: i-simple-icons-raspberrypi
---

## Accessing `config.txt` on HassOS

1. Add "HassOSConfigurator" add-on repository `https://github.com/adamoutler/HassOSConfigurator` from [Adam Outler](https://github.com/adamoutler) via this link::br[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=https%3A%2F%2Fgithub.com%2Fadamoutler%2FHassOSConfigurator\&owner=adamoutler)
2. Make sure that the user you are logged into your Hassio installation has the "Advanced mode" enabled in the user profile "User settings" page.:br[![Open your Home Assistant instance and show your Home Assistant user's profile.](https://my.home-assistant.io/badges/profile.svg)](https://my.home-assistant.io/redirect/profile/)
3. Go to the add-on store, find and install the "HassOS SSH port 22222 Configurator" addon.:br[![Open your Home Assistant instance and show the add-on store.](https://my.home-assistant.io/badges/supervisor_store.svg)](https://my.home-assistant.io/redirect/supervisor_store/)
4. After having installed the add-on, click on it's installed add-on entry and make sure to uncheck the "Protection mode" option.:br[![Open your Home Assistant instance and show the dashboard of an add-on.](https://my.home-assistant.io/badges/supervisor_addon.svg)](https://my.home-assistant.io/redirect/supervisor_addon/?addon=1f3d020e_hassos_ssh_configurator_addon)
5. Go to the configuration tab of the add-on, add your **public** ssh key (e.g., `~/.ssh/id_rsa.pub`) and save. _Only Open SSH format public keys work._
6. Go back to the info tab and start the addon, now monitor the logs of the add-on by using the log tab and pressing the "Refresh" button till you see a text telling you it was successful.
7. Now you should restart the Hassio instance via the "Restart Home Assistant" dialog accessible via the top right "Power icon" button, in this menu click on "Advanced options" and select the "Reboot system" option.:br[![Open your Home Assistant instance and show the system dashboard.](https://my.home-assistant.io/badges/system_dashboard.svg)](https://my.home-assistant.io/redirect/system_dashboard/)
