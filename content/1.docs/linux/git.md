---
title: git
icon: 'i-simple-icons-git'
---

## Removes Any Files and Directories Not Commited

```bash
# `-i` will run the cleaning process interactively
$ git clean -i -d
# Setting `-f` instead of `-i` will remove everything "not commited" automatically
$ git clean -f -d
```

## Aliases

In your git config (e.g., `~/.config/git/config`) add a `[alias]` section:

```ini
# ...
[alias]
    alias_name = "your alias command(s)"
# ...
```

### Remove branches that don't have a remote branch

::callout{icon="i-ph-warning" color="warn"}
Make sure that you don't have important local branches without a remote branch.
::

```ini
[alias]
	bclean = "!git fetch -p && for branch in $(git branch -vv | gawk '{print $1,$4}' | awk '/ gone]/{if ($1!=\"*\") print $1}'); do git branch -D $branch; done && echo 'Removed branches without remote anymore.'"
```
