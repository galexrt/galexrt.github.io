---
title: GitLab CI
icon: 'i-simple-icons-gitlab'
---

## CI/CD Variables with Dollar Signs (`$`)

::callout{icon="i-ph-bug"}
**Bug**:
Dollar Signs (`$`) are resolved as a variable in GitLab CI.
::

If you have a variable value (e.g., Harbor robot account username) with a `$` in it, you need to "escape" it like this:

* From:
    ```plain
    secret$example123
    ```
* To:
    ```plain
    secret$$example123
    ```
