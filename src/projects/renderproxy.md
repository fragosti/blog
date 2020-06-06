---
layout: project.njk
title: Renderproxy
description: Make your app crawlable without a single line of code
date: 2019-05-30
tags: project
iconImageName: renderproxy.png
githubUrl: https://github.com/fragosti/renderproxy
genericUrl: https://www.producthunt.com/posts/renderproxy
---

Renderproxy was a SaaS product for frontend developers looking to improve the SEO of their [Single Page App](https://huspi.com/blog-open/definitive-guide-to-spa-why-do-we-need-single-page-applications). Often times implementing [dynamic rendering](https://developers.google.com/search/docs/guides/dynamic-rendering) is a necessary step for purely client-side rendered Javascript web apps looking to improve their SEO. The goal of Renderproxy was to make this implementation as simple as possible for developers.

![Renderproxy Landing Page](/assets/img/renderproxy-landing.png)

The idea for Renderproxy came to me while at work. The [0x website](https://0x.org/) is completely written in React and was having some SEO issues. Single Page Apps have a hard time being crawled by search engine bots, and one way to fix this is to implement [dynamic rendering](https://developers.google.com/search/docs/guides/dynamic-rendering), such that bots get served up a pre-rendered version of your site. Google recommends this.

Looking online, I was hoping to find something like Renderproxy, but all the solutions I found required me to run my own server, or switch hosting providers. We ended up implementing our own custom solution.

With Renderproxy, all you need to do is sign up, and change your DNS settings.

Along the way, I realized it could do other cool things, like get you free custom domains to sites you've built with website builders. In general, it was the easiest and fastest way to set up a reverse proxy that I've seen.

Ultimately, Renderproxy acquired some customers but was not worth running anymore from a maintenance standpoint, so it was shut down a few months after being released. I realized halfway through building Renderproxy that while it did provide a unique solution, it only made sense for a very narrow set of use-cases, and for most use-cases I would recommend one of the many other solutions out there.

It also proved to be a project of declining relevance as many modern frameworks ([Next.js](https://nextjs.org/), and [JAMstack](https://jamstack.org/) more generally) ensure that you are set up for SEO success from the start. Fun project though!
