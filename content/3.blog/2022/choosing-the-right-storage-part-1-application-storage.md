---
title: "Choosing the right Storage: Part 1 Application Storage"
date: 2022-04-11T15:25:13+02:00
description: 'First part of our "Choosing the right Storage" series. Let''s dive into the data a web application needs to store.'
image: "/blog/2022/choosing-the-right-storage/choosing-the-right-storage.jpg"
authors:
  - name: Alexander Trost
    to: https://github.com/galexrt
    avatar:
      src: /images/profile-picture.jpg
---

::callout{icon="i-ph-info" color="blue"}
This blog post is originally from the Koor Technologies, Inc. website which due Koor Technologies, Inc. closure in early 2024 doesn't exist anymore.
::

**TL;DR** It is important to think about all the data that must be stored during the design phase of an application.

In this first post of a series about use cases for storage, we will look at the main types of "storage".
Let's dissect what data a classic PHP based web application would need to store.

Starting at the webserver, you have access and error logs of Apache, NGINX, whatever webserver you are using.
Access logs of the most common webservers contain one line for every request made to the webserver. Thankfully webservers are smart enough to write these logs in such a way that requests are not blocked.
Still they can grow in size in specific situations, such as a Distributed Denial of Service (DDOS) attack against the webserver.
Error logs can be used for debugging purposes when an error occured on the webserver side.
Besides the webserver's log files, the operating system the webserver is running on. The operating system will most likely run other services besides the webserver, that are needed to, e.g., administrate the server remotely (SSH; Secure Shell Server).

Now onto the web application, assuming that the web application has some sort of user login, there should be some way to store these "user sessions".
A small web application with one webserver could get away with storing the user sessions locally, as there is no need for them to be "shared".
But a medium to large web application with more than one webserver (e.g., for high availability) would use some database to store the sessions.
There's several database projects out there which can be used for storing sessions, the main take away is that depending on the scale other measures need to be taken.
For a very large web application, having a central "session database" can have advantages and disadvantages.
"Small" things like user sessions storage should be kept in mind and not forgotten when designing a (new) application.

The user has logged in and wants to upload a document to the web application. That's additional data that needs to be stored.
Where should such data be stored? There's different opinions and ways on how to accomplish this.
One approach for smaller file uploads can be to store them in the database, but this approach does not scale too well.
In the cloud native world Object Storage would be the answer (to everything). Object Storage in form of "S3 compatible storage" has been made well known by Amazon Web Services.
Amazon Web Services themselves are offering a service called "Amazon Simple Storage Service", short "Amazon S3".
The S3 Object Storage API allows for simple file upload and download. This can make it easy to be implemented in (new) applications to store certain data in an S3 compatible Object Storage.

Where should user posts be stored? For most use cases the answer here will be a database.
There's several different databases available each of them covers many different use cases. Among the most commonly used are MySQL, PostgreSQL and Microsoft SQL Server.
Most web applications are using MySQL or PostgreSQL databases. Even with more and more NoSQL databases popping up, it really depends on your use case.
Is your data mostly relational? Non relational data? Storing documents?
Still in the end no matter the database used, the database must be stored some where.

An important point that hasn't been touched on yet is that for every bit of data that is stored, the question "does it need a backup?" arises.
To that question the answer should most of the time be a definite "Yes".
We'll dive more into backups in a future post on our blog.

In the next part of the "Choosing the right Storage" series, we will look into the 3 most common storage types (Block Storage, Filesystem Storage, Object Storage).
