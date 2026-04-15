---
title: SSH
---

## "Multiplex" SSH Connection

```ini
Host *
    ControlPersist yes
    ControlMaster auto
    ControlPath ~/.ssh/connections/%C
```

In this case you must create the `~/.ssh/connections` directory and set its permissions to `700` to ensure security.
```bash
mkdir -m 0700 ~/.ssh/connections
```

::tip
There can be negative effects when using `ControlMaster` but I personally prefer to "multiplex" SSH connections for the convenience it provides.
<br>
E.g., if you kill the main connection, all the multiplexed connections will be killed as well. Also, if the main connection is lost due to network issues, all the multiplexed connections will be affected.
Still in case of password authentication this means you only need to enter the password once for the "initial main" connection.
::
