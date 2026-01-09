---
title: MariaDB
icon: i-simple-icons-mariadb
---

> MariaDB is a popular open-source relational database management system that is a fork of MySQL. It is known for its performance, scalability, and robust feature set. MariaDB is often used as a drop-in replacement for MySQL, making it a great choice for applications that require a reliable and efficient database solution.

## MariaDB vs. MySQL

### MariaDB `JSON` Data Type "Limitations"

See [MariaDB `JSON` Data Type "Limitations"](../mysql/pitfalls.md#mariadb-json-data-type-limitations) in the MySQL Pitfalls documentation.

### No Support For JSON Multi-Valued Indexes

MariaDB doesn't support JSON multi-valued indexes, but MySQL 8.x does.
Based on this ticket https://jira.mariadb.org/browse/MDEV-25848 it might land in MariaDB 12.2 or later.
