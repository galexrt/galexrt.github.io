---
title: "Choosing the right Storage: Part 2 Common Storage Types"
date: 2022-04-21T15:25:13+02:00
description: 'Second part of our "Choosing the right Storage" series. Let''s dive into the 3 most common storage types.'
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

In the first part of this series, we have come across several different types of data that a typical web application would need to save "somewhere".
We have scratched the surface of where the data is saved to, but there is more to it.

Let's say a user has just created a new document in our web application. What will the web application do to store the document?
The web application connect to the database server and will instruct the database server to store it.
The database server adds the document to it's internal "housekeeping" list so it knows where document is located at in its "data store" system.
The "data store" system is highly sophisticated as it has logic to try to prevent data loss in case of, e.g., a power outage.
To keep it simple, the "data store" system can be seen as a librarian, a librarian knows where every book (document) is located at and keeps record about any movement of the books.
The document is now stored in the database server, but where exactly is it stored? It is stored on the storage of the server that the database server is running on.
For the "data store" system to work at its peak efficiency level, it uses the operating system I/O (input/output), caching and other subsystems.
The best storage type for database servers is block storage. Block storage is very "low level" in the operating system and by that can allow the operating system to leverage it well.

Now what if a user wants to upload a profile picture, where should the picture be stored?
As mentioned last time it heavily depends on your use case and scale which storage type makes most sense here.
For smaller to medium web applications, using filesystem storage is a viable option. A simple network share (e.g., NFS) is easy to setup and maintain upto a certain scale. The filesystem would be "attached" to every webserver that runs our web application, thanks to that all profile pictures are available on every webserver at all times.
In the cloud native world, object store would be the way to go for most similar scenarios. If an application already exists and needs to be augmented to use object storage, it will cost time but depending on the scale of the applications it can make a huge impact in regards to scalability and maintainability.

The advantages why object storage can be better than filesystem storage lie within the following questions:

* **How much space will be needed?**: An object storage can easily scale to petabytes of data, where a filesystem storage might have issues due to other factors to reach this scale.
* **How many files will need to be stored?**: Both filesystem and object storage can store many many files, but a filesystem storage is most often reaching it's scalability limits faster.

These are just two questions and there are so many parameters to take into account when deciding between filesystem and object storage.

Why wasn't block storage mentioned for storing profile pictures? Block storage is inherently a bad choice for most "multiple readers and writers at the same time" (e.g., dynamically scaling webservers) scenarios.

To break down the 3 most common storage types into one sentence each:

* Block Storage: Think of it like an external **USB disk** that has a "mass" to it.
* File/Filesystem Storage: Have you ever worked at a larger enterprise? Your colleagues and you probably had a bunch of **shares** that you could use to share documents with each other.
* Object Storage: Do you have an app on your phone that automatically uploads your camera photos and displays them somewhere online for you? Object store is kinda like that but without the fancy web interface.

This image might make iteasier for you to differentiate between the 3 most common storage types:

![Block vs. Filesystem vs. Object Storage](/blog/2022/choosing-the-right-storage/block-vs-filesystem-vs-object.png)

In the next part of the "Choosing the right Storage" series, we will look into backing up and restoring data.
