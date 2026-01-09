---
title: Pitfalls
---

## `mysql` CLI Console Password Character "Limit"

`mysql` command only reads in 79 characters of "password" from TTY/ "console". In my case I was copy'n'pasting/ the password store autotyping database passwords which doesn't work then (leads to `Access denied for user` errors because the password is wrong).
This "limit" doesn't seem to be documented anywhere I looked, so here we go. If you want to login to your users only use passwords 79 characters long when "typing" them on the console.

Thanks to this [Jira ticket (MXS-1766)](https://jira.mariadb.org/browse/MXS-1766) to pointing to the code behind the "limitation"!

I also need to give a shoutout to the people with which I reflected the issue and then stumbled upon the `mysql` CLI limitation.

**Code references**:

- [GitHub MariaDB/server - `10.3/client/mysql.cc` Line 1959](https://github.com/MariaDB/server/blob/10.3/client/mysql.cc#L1959)
- [GitHub MariaDB/server - `10.3/mysys/get_password.c` Line 63](https://github.com/MariaDB/server/blob/10.3/mysys/get_password.c#L63)

## Replication User Password Character Limit

The password for a replication user must be a maximum of `32` characters long.

## MySQL Memory/ Storage Size Suffixes

**TL;DR** The suffixes are in "Bytes". E.g., 16M = 16777216 Bytes.

```bash
mysql --max_allowed_packet=16777216
mysql --max_allowed_packet=16M
```

> The first command specifies the value in bytes. The second specifies the value in megabytes. For variables that take a numeric value, the value can be given with a suffix of K, M, or G to indicate a multiplier of 1024, 10242 or 10243. (For example, when used to set max\_allowed\_packet, the suffixes indicate units of kilobytes, megabytes, or gigabytes.) As of MySQL 8.0.14, a suffix can also be T, P, and E to indicate a multiplier of 10244, 10245 or 10246. Suffix letters can be uppercase or lowercase.

Quoted from: [MySQL 8.0 Reference Manual - 4.2.2.5 Using Options to Set Program Variables](https://dev.mysql.com/doc/refman/8.0/en/program-variables.html)

## MariaDB `JSON` Data Type "Limitations"

> The JSON alias was added to make it possible to use JSON columns in statement based replication from MySQL to MariaDB and to make it possible for MariaDB to read mysqldumps from MySQL.
>
> JSON is an alias for LONGTEXT COLLATE utf8mb4_bin introduced for compatibility reasons with MySQL's JSON data type. MariaDB implements this as a LONGTEXT rather, as the JSON data type contradicts the SQL:2016 standard, and MariaDB's benchmarks indicate that performance is at least equivalent.
>
> _Source: [JSON Data Type | Server | MariaDB Documentation](https://mariadb.com/docs/server/reference/data-types/string-data-types/json)_

So don't wonder if you create a table with a `JSON` column and then see it as `LONGTEXT` when you do a `SHOW CREATE TABLE ...` later on..

### MariaDB vs MySQL Functionality Differences

It feels that the "drift" of functionality between MariaDB and MySQL is more and more increasing over time.
For example, MariaDB doesn't support JSON multi-valued indexes, but MySQL 8.x does.

I wouldn't be too worried yet, but as someone who is developing an application that should run on "any MySQL database" it is something to keep in mind.

Be sure to checkout the pitfalls documented on this page and [the MariaDB vs. MySQL section here](mariadb.md#mariadb-vs-mysql).
