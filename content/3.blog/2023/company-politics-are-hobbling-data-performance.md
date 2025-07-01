---
title: "Company politics are hobbling your distributed data performance"
date: 2023-08-30T00:00:00+02:00
description: "Data storage isn’t everyone’s responsibility, but it is everyone’s problem. These are some reflections on where storage performance goes wrong."
image: "/blog/2023/company-politics-are-hobbling-data-performance.jpg"
authors:
  - name: Alexander Trost
    to: https://github.com/galexrt
    avatar:
      src: /images/profile-picture.jpg
---

::callout{icon="i-ph-info" color="info"}
This blog post is originally from the Koor Technologies, Inc. website which due Koor Technologies, Inc. closure in early 2024 doesn't exist anymore.
::

::callout
Cover photo credits go to [Car Stuck on Muddy Road](https://www.pexels.com/photo/car-stuck-on-muddy-road-13648107/) by [Alexandra Bakhareva](https://www.pexels.com/@alexalexal/)
::

I’ve discussed [debugging storage performance issues](/blog/2023/its-slow-and-i-dont-know-why) on this blog before, and I encourage you to check that post out if you haven’t already. Today, I want to focus on data storage problems that are a little more nebulous and hard to isolate. Some of these issues are actually preventable, and often arise from cultural and organizational factors.

Sometimes the root cause of a performance issue is unclear because the symptom appears unrelated. These issues always make me think of the YouTube channel [HVACR videos](https://www.youtube.com/@HVACRVIDEOS). In [this video](https://www.youtube.com/watch?v=qpfLysLcJ8M) in particular, Chris is called in about a water leak which turns out to have nothing to do with the faulty freezer in question. The root of your problem could be lurking in something that appears totally unrelated to where the problem is surfacing. Be ready to explore all possibilities, not just the obvious ones, or as Chris likes to call it, “Big picture diagnosis.”

But what do you do when the root of your storage problem is in another part of the organization? What if it’s a network problem and you can’t access the network logs or even get time with a network admin? These are some of the greatest data storage challenges, and they’re cultural, not technical.

## Data storage is everyone’s problem

If you’re having storage performance issues, it’s not just your storage team who’s going to feel it. Even though storage is usually managed by one team under operations or infrastructure, storage performance touches multiple parts of an organization.

The location of your storage team will impact what information it has access to, which can create problems when debugging (more on this later). Who they report into will also impact the storage budget, and whether you have a robust solution that’s actually fit for purpose.

Data storage is not immune to the fiefdom effect. Anytime you have teams or departments with differing political goals, you have misaligned incentives, which creates an environment where other groups and their needs are seen as adversarial. Now, when you have storage performance problems, your data gets stuck in the mud.

## The last silo in DevOps

I’m going to use the network as a primary example, because it can often be responsible for storage access issues, and network issues are often the hardest to debug. Despite advances in cross-functional collaboration in the past 15 years, DevOps didn’t solve for this—the networking team is still an island.

Now, we’re _not_ suggesting DevNetOps.

Networking is its own domain; network admins have a different skill set and operate with different technology. But the current dynamic does create problems for storage management and performance:

### Misaligned incentives

Network admins have to balance between stability and performance. At a lot of companies, making time to collaborate on troubleshooting is not incentivized because people aren’t aligned on what success is.

### Tech debt

Networks are often much older than the services they support. Changes to modernize networks threaten uptime, for example: to replace a switch, all connected servers need to be switched over, which can cause a short, but potentially noticeable outage. This requires coordination with the application team/s so they are on standby should an automatic failover mechanism fail. The challenge with balancing uptime with modernization means networks tend to operate with tech debt. Among other issues, this is how you end up with storage bottlenecks when the network capacity simply can’t serve the throughput you need.

### Lack of transparency

Network logs are (understandably) treated as sensitive, and the company can’t grant everyone access due to security concerns. But if you have to go to another group to read logs of the service you’re using, this creates bottlenecks. When your storage team has to get through a [BOFH](https://en.wikipedia.org/wiki/Bastard_Operator_From_Hell) to troubleshoot, everyone loses.

These problems aren’t unique to the network, but it tends to be where you run into these issues most. Because of the different skill set and sensitivity of network logs they are less likely to be transparent. (Sometimes it is simply more convenient to restrict access, because visibility exposes the presiding team to feedback and criticism.)

## How do you get ahead of storage problems?

A lot of the challenges I’ve pointed out above are rooted in a lack of planning and experience. Think about this: if you want to build a Kubernetes cluster, what do you need? Well, Kubernetes, obviously, but what else? There’s logging, monitoring, load balancers … You don’t want to wait until you have a problem to find out who takes care of what. If there’s a team that does logging for the whole company, establish upfront how you will work together when there’s an incident. If your team isn’t experienced in what you’re attempting, it might be worth seeking help.

### Investigate early and often

Chasing down the cause of odd behavior is another way to catch performance issues before they cause bottlenecks.

> “Paying attention to ‘fishy’ things lets you get ahead of the game with your infrastructure—instead of reacting to fires all the time, you can detect symptoms before they affect customers.” — [Incuriosity Will Kill Your Infrastructure](http://yellerapp.com/posts/2015-03-16-incuriosity-killed-the-infrastructure.html)

### Kill your Storage Admin? (the role, not the person)

At a previous company, we had a cross-functional pod, a “network consortium” of sorts, composed of people from across the organization, all responsible for managing and maintaining the network. You could think of it as “if you build it, you run it” for storage—being on call created a sense of shared responsibility and accountability for performance. This was an additional responsibility on top of people’s full-time roles, so probably not feasible for every organization.

You don’t need to merge teams to encourage transparency. If each team is more open and collaborative when it comes to other teams using their provided services, you get a similar effect to a cross-functional team. In many cases, placing everyone under a CIO who holds them accountable for working together can do the trick.

### Align on a common cause

To prevent territorialism, you need a company goal that supersedes departmental politics. Say what you want about DevOps, the principles of collaboration, shared responsibility, and coordination in service of a common goal (usually of serving customers better) are valuable. Working towards the same outcome prevents situations where a team can’t get help with debugging a problem because it doesn’t impact the other team’s goal.

## What’s Your Story?

We’d love to hear about your challenges with storage performance. [Tweet, er, X us](https://twitter.com/koor_tech) with your story.

---

_Our appreciation and gratitude to [Rebecca Dodd](https://thebasementoffice.co.uk/) who made this post possible._
