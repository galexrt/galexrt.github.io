---
title: 'Golang: go get from GitLab'
authors:
  - name: Alexander Trost
    to: https://github.com/galexrt
    avatar:
      src: /images/profile-picture.jpg
date: "2017-06-02T14:39:01+02:00"
tags:
  - Golang
  - GitLab
image:
  src: '/blog/covers/go-logo_lightblue.png'
---

I just now came across the problem that I created a repository on a private GitLab instance for a Golang project and could not just use `go get ...` to get it.
After a short Google search, I came across this StackOverflow question and thankfully it had a working answer.

The original StackOverflow question can be found here: [StackOverflow - how do you use golang with a private gitlab repo?](https://stackoverflow.com/questions/29707689/how-do-you-use-golang-with-a-private-gitlab-repo/37844256#37844256), the question was asked by User [James Fremen](https://stackoverflow.com/users/2904939/james-fremen).
> **NOTE**
>
> I will quote the question and answer which worked here so it is sort of archived here.

## The original question
> GitLab is a free, open-source way to host private .git repositories but it does not seem to work with golang. When you create a project it generates a URL of the form:
>
>```bash
git@1.2.3.4:private-developers/project.git
```
> where: 1.2.3.4 is the IP address of the gitlab server private-developers is a user group which has access to the private repo
>
> Golang 1.2.1 doesn't seem to understand this syntax.
>
>```bash
go get git@1.2.3.4:private-developers/project.git
```
> results in:
>```bash
package git@23.251.148.129/project.git: unrecognized import path "git@1.2.3.4/project.git"
```
> Is there a way to get this to work?
>
> thanks!

Author of the question [James Fremen](https://stackoverflow.com/users/2904939/james-fremen)

## The answer that worked for me
> Run this command:
>
>```bash
git config --global url."git@1.2.3.4:".insteadOf "https://1.2.3.4/"
```
>Assuming you have the correct privileges to `git clone` the repository, this will make go get work for all repos on server `1.2.3.4`.
>
> I tested this to work with go version 1.6.2 and 1.8.

Author of the answer [Rick Smith](https://stackoverflow.com/users/616644/rick-smith)

### Example for DNS names
So for example with dns names, it would be for a gitlab running at `gitlab.example.com`.
```bash
git config --global url."git@gitlab.example.com:".insteadOf "https://example.com/"
```

## Summary
With that change, you can now successfully run `go get gitlab.example.com/example-user/example-project`.

Have Fun!
