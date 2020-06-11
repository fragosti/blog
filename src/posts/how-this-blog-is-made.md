---
layout: post.njk
title: How This Blog is Made
description: Building a Statically Generated Blog with Eleventy
date: 2020-06-01
tags: post
templateEngineOverride: md
---

Long story short, this blog is implemented using [Eleventy](https://www.11ty.dev/), specifically by using [eleventy-starter](https://github.com/eastslopestudio/eleventy-starter) as a starting point. Feel free to check out [the code](https://github.com/fragosti/blog).

Before landing and settling on Eleventy I checked out the extremely popular [Gatsby](https://www.gatsbyjs.org/). As someone accustomed to React and Typescript it seemed like the natural choice. Going through the docs was easy enough, and I even [found a theme](https://github.com/LekoArts/gatsby-themes/tree/master/themes/gatsby-theme-minimal-blog) that I ended up mostly keeping for the final implementation.

However, I found the API complex and confusing. While I was familiar with most of the frameworks used, I couldn't wrap my head around how it all fit together. In particular, implementing a simple collection of posts took way too much ceremony and involved a [GraphQL](https://graphql.org/) API. While I love GraphQL, it all seemed overkill to me, and so I gravitated towards Eleventy because it seemed like the simplest tool for the job.

## A Look into Eleventy

Eleventy was a pleasure to work with. I know there are other great solutions out there ([Hugo](https://gohugo.io/) and [NextJS](https://nextjs.org/) come to mind), but I really didn't have many complaints while building this blog.
To learn more about the basics, I recommend the [tutorials](https://www.11ty.dev/docs/tutorials/) or [A Brief Tour of the Eleventy Static Site Generator](https://www.digitalocean.com/community/tutorials/js-eleventy) by Digital Ocean.

> 11ty is easy to use, doesn’t get in your way and spits out exactly what you put in, so there’s no surprise or hidden code bloat. At its most basic, 11ty just compiles files it finds from your working directory into static HTML files. Plus, since it’s written in JavaScript, you gain access to the whole of npm in terms of packages you can use in your project.

As a sample, this is basically how you would implement a page showing your [collection](https://www.11ty.dev/docs/collections/) of posts in Eleventy.

First you would create a `my-first-post.md` file.

```
---
layout: post.njk
title: My First Blog Post
date: 2019-11-30
tags: post
---

My first blog post content.
```

And because of the `tags` field, that post content and meta-data is available in templates to render in `collections.post`.

```html
<ul>
  {%- for post in collections.post | reverse | limit(postsListLimit) -%}
  <li class="py-3">
    <h3>
      <a href="{{ post.url | url }}">{{ post.data.title }}</a>
    </h3>
    <label>
      {{ post.date | dateReadable }}
    </label>
    <p class="line-clamp py-1">
      {% excerpt post %}
    </p>
  </li>
  {%- endfor -%}
</ul>
```

What I like about Eleventy is that it comes with sane defaults, and that the "guts" of the blog are taken care of for you.

## The Stack

Eleventy provides the skeleton for creating a blog, but doesn't have opinions on styling, bundling, etc...

For styling I used [Tailwind CSS](https://tailwindcss.com/) with custom fonts, and a variant for [dark-mode](/posts/how-this-blog-is-made/#dark-and-light-mode). This kept the custom styles I had to write in the project to a minimum.

For the bundler, I opted for [ParcelJS](https://parceljs.org/). While Eleventy takes care of processing the markdown and HTML, Parcel takes care of processing the Javascript, CSS and even [minifies and optimizes my images](/posts/how-this-blog-is-made/#image-optimization-and-lazy-loading).

Finally, for the little custom Javascript on the site, I used [Stimulus](https://stimulusjs.org/) (created by the folks at Basecamp). I can't say that it was a concious choice – it was what came by default in the starter, and worked well enough.

[Turbolinks](https://github.com/turbolinks/turbolinks) is in the mix as well.

All this is deployed to [Netlify](https://www.netlify.com/)! The few icons you see are all from [Feather Icons](http://feathericons.com/).

Even when going deeper with Eleventy, and trying to implement more custom functionality, I've found I can get things done relatively quickly. Below are some examples.

## Creating "Components"

If you're used to writing React, you're familiar with creating "components". This is not 100% supported in Eleventy, but you can get very close (and there is a [GitHub issue](https://github.com/11ty/eleventy/issues/189) about it).
While I've seen a few approaches, I ended up using the one I found most prominently used in the official [eleventy-base-blog](https://github.com/11ty/eleventy-base-blog/).
The gist is to create [partial templates](https://rphunt.github.io/eleventy-walkthrough/partials-and-include.html), and include them in full pages or layouts. We saw an example of a partial template earlier. This time around, you may notice that the template depends on an external variable `postsListLimit`, which will limit the number of posts rendered when available.

```html/1
<ul>
  {%- for post in collections.post | reverse | limit(postsListLimit) -%}
  <li class="py-3">
    <h3>
      <a href="{{ post.url | url }}">{{ post.data.title }}</a>
    </h3>
    <label>
      {{ post.date | dateReadable }}
    </label>
    <p class="line-clamp py-1">
      {% excerpt post %}
    </p>
  </li>
  {%- endfor -%}
</ul>
```

The `limit` [filter](https://www.11ty.dev/docs/filters/) is available below.

```js
eleventyConfig.addFilter('limit', function (array, limit) {
  if (!limit) {
    return array
  }
  return array.slice(0, limit)
})
```

Using your partial template, and defining `postsListLimit`, can be seen below.

```html/7
<div class="divide-y divide-gray-500 mb-5 mt-8">
  <div class="flex flex-row justify-between py-2">
    <h2>Latest Posts</h2>
    <a class="link self-center" href="/posts">Read all posts</a>
  </div>
  <div></div>
</div>
{% set postsListLimit = 3 %} {% include "postslist.njk" %}
```

As long as your partials are in your `_includes` [directory](https://www.11ty.dev/docs/config/#directory-for-includes), you'll be able to import them.
This **feels** close enough to importing a React component and rendering it with props.

## Dark and Light Mode

A feature you see almost everywhere nowadays is the ability to switch between dark and light mode. While Tailwind CSS provides an example of [implementing dark mode with a media query](https://tailwindcss.com/docs/breakpoints/#dark-mode) for browsers and operating systems that support it, I wanted to create a simple toggle (the moon or sun icon in the upper right corner of this blog).

On the styling side, there is a plugin called [tailwindcss-dark-mode](https://github.com/ChanceArthur/tailwindcss-dark-mode) that does a lot of the heavy lifting for you. These are the relevant parts of my `tailwind.config.js`.

```js/12-21
const { theme, variants } = require('tailwindcss/defaultConfig')

module.exports = {
  purge: ['./src/assets/js/**/*.js', './src/**/*.njk', './src/**/*.md'],
  theme: {
    extend: {
      fontFamily: {
        primary: ["'Inter'", ...theme.fontFamily.sans],
        secondary: ["'Noto Sans'", ...theme.fontFamily.sans],
      },
    },
  },
  variants: {
    borderColor: ['dark', 'dark-hover', ...variants.borderColor],
    textColor: ['dark', 'dark-hover', ...variants.textColor],
    backgroundColor: ['dark', 'dark-hover', ...variants.backgroundColor],
  },
  plugins: [require('tailwindcss-dark-mode')()],
}
```

The `variants` section tells Tailwind CSS to create `dark` and `dark-hover` utility classes for border, text and background colors, which is all I need.
As you might expect, the `plugins` section imports and uses the plugin.
What this means is that you can apply CSS class names such as `dark:bg-gray-900` or in my case, write CSS like this.

```css
.mode-dark {
  body {
    @apply text-white;
  }
  .link {
    @apply text-gray-600;
  }
  .link:hover {
    @apply text-white;
  }
  p {
    @apply text-gray-400;
  }
  p a {
    @apply text-indigo-300;
  }
  label {
    @apply text-gray-600;
  }
  h3 {
    @apply text-gray-100;
  }
  blockquote {
    @apply border-indigo-300;
  }
}
```

That `.mode-dark` CSS class is the default class used by [tailwindcss-dark-mode](https://github.com/ChanceArthur/tailwindcss-dark-mode), but how does that class get added to your `<html>` element? That is entirely up to you.
In my case, I went ahead and implemented it in Stimulus. The controller is a simple class that allows you to toggle dark mode on and off. It also persists the state to `localStorage`, so that you can maintain the same mode across sessions.

```js
import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['lightToggle', 'darkToggle']
  initialize() {
    const isLightMode =
      (localStorage && localStorage).getItem('isLightMode') === 'true'
    if (isLightMode) {
      this.useLightMode()
    }
  }
  useDarkMode() {
    document.documentElement.classList.add('mode-dark')
    localStorage.setItem('isLightMode', false)
    this.darkToggleTarget.classList.add('hidden')
    this.lightToggleTarget.classList.remove('hidden')
  }
  useLightMode() {
    document.documentElement.classList.remove('mode-dark')
    localStorage.setItem('isLightMode', true)
    this.darkToggleTarget.classList.remove('hidden')
    this.lightToggleTarget.classList.add('hidden')
  }
}
```

The corresponding HTML is:

```html
<div data-controller="dark-mode-controller" class="link mt-8 mb-6">
  <i
    data-feather="moon"
    data-target="dark-mode-controller.darkToggle"
    class="hidden"
    data-action="click->dark-mode-controller#useDarkMode"
  ></i>
  <i
    data-feather="sun"
    data-target="dark-mode-controller.lightToggle"
    data-action="click->dark-mode-controller#useLightMode"
  ></i>
</div>
```

And don't forget to initialize Stimulus

```js
import { Application } from 'stimulus'

import DarkModeController from './controllers/dark_mode_toggle'

const application = Application.start()
application.register('dark-mode-controller', DarkModeController)
```

## Image Optimization and Lazy-Loading

Turns out images are whole thing. You can spend a lot of time creating a system that optimizes and re-sizes your images and makes sure that the right image dimensions are served to the right devices. Eleventy even [has an official plugin](https://github.com/11ty/eleventy-img) to do this.

In this regard my goals were a bit different:

- To be able to just dump images in the `img/` directory.
- To be able to reference images from that directory without worrying too much about what size they were.
- To have decent performance and UX.

Given these goals, what I'm about to describe may not be the ultimate cutting edge best practice, but it works for me.
The first and easiest step is to make sure your images are optimized and compressed, even if they are the same dimensions when they come out the other end. For this, I used [parcel-plugin-imagemin](https://github.com/DeMoorJasper/parcel-plugin-imagemin) which allows ParcelJS to apply those optimizations during the build. I found that this alone reduced the size of my images by 80% for free.

```bash
7:39:10 PM: \$ cross-env NODE\*ENV=production parcel build ./src/assets/\*\*/\_ --out-dir ./dist/assets --no-source-maps
7:39:11 PM:
7:39:34 PM: ✨ Built in 23.57s.
7:39:34 PM: dist/assets/img/yelp-search-home.png 432.99 KB 22.31s
7:39:34 PM: dist/assets/img/codenail-framed-poster.jpeg 347.73 KB 18.52s
7:39:34 PM: dist/assets/img/yelp-search-ios.jpg 186.6 KB 16.85s
7:39:34 PM: dist/assets/img/yelp-nearby-ios.jpg 156.13 KB 16.42s
7:39:34 PM: dist/assets/js/app.js 80.55 KB 21.05s
7:39:34 PM: dist/assets/img/instant-kitty.png 42.58 KB 3.23s
7:39:34 PM: dist/assets/img/renderproxy-landing.png 32.99 KB 13.61s
7:39:34 PM: dist/assets/img/instant-dai.png 22.86 KB 2.92s
7:39:34 PM: dist/assets/img/0x-api-big.png 22.62 KB 13.54s
7:39:34 PM: dist/assets/img/instant-rep.png 21.34 KB 3.02s
7:39:34 PM: dist/assets/img/0x-api-banner.png 11.96 KB 3.32s
7:39:34 PM: dist/assets/css/app.css 8.47 KB 18.61s
7:39:34 PM: dist/assets/img/renderproxy.png 4.85 KB 3.02s
7:39:34 PM: dist/assets/img/0x-api.png 4.67 KB 1.42s
7:39:34 PM: dist/assets/css/prism.css 2.32 KB 18.62s
7:39:34 PM: dist/assets/img/codenail.png 1.56 KB 933ms
7:39:34 PM: dist/assets/img/yelp.png 1.03 KB 1.14s
7:39:34 PM: dist/assets/img/0x.svg 887 B 737ms
7:39:34 PM: dist/assets/img/just-a-level.png 391 B 926ms
```

The second step I took was to use [eleventy-plugin-lazyimages](https://github.com/liamfiddler/eleventy-plugin-lazyimages#readme). This plugin scans your markup for `<img>` tags, seeds them with inline low-res images, and loads the full resolution images once the image is near the viewport. The result is HTML like the following:

```html
<img
  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGCAYAAAD37n+BAAABAElEQVR4AW3BQUvCUADA8f/mc1MbPSnNhtliFNqhoCIIgk5Rhw4RHTv3JfoanfoEHfsgBYlQUSR4MoXAnDr3Xlvr1K3fzzg73E51NMUwTRaXfDxvmW8VYuopb50O7U6X2UKe3c0GVi6HSGPNgltlfWMHFX4xfn3E3drHETb9wRAr80HdczENA6U14vzikr2DI5QKMX9iZhyHJE54aT1w0qhzfJowGU8oFQq0724RtZU1yhUXKSV/0jTl5vqKwWRItVjhvvlOrEJWvRpCzpX4T9TrEmQsbDHA9z0++31G0wgRBAHPT02KUpK3bRKtyWYzSFlm1Osh513IS9JYEQRjfgEOTl/TD5hJ6AAAAABJRU5ErkJggg=="
  alt="My Alt Title"
  loading="lazy"
  data-src="/assets/img/my-image.png"
  class="lazyload"
  width="1000"
  height="1000"
/>
```

I found that using these two plugins, along with being smart about which images I use, was Good Enough™ for me.

## Markdown Plugins

At some point while working with markdown files in Eleventy you may find that you want some custom behavior. Fortunately, [this is supported](https://www.11ty.dev/docs/languages/markdown/), as Eleventy allows you to add and configure your own `markdown-it` instance.

While there may be a lot of ways you want to configure your markdown parser, I'm going to go over how I implemented perma-links for my headings, and how I automatically made external links open in a new tab.

Perma-links, which you can check out by hovering over any heading, were added by using [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor) and the "link" icon from [feather-icons](http://feathericons.com/). Simply enable the `permalink` option and set the `permalinkSymbol` to the icon of your choice.

To ensure external links open in a new tab, I used [markdown-it-link-attributes](https://github.com/crookedneighbor/markdown-it-link-attributes), which lets you apply attributes to links meeting a certain criteria. In my case, I made sure to add `target=_blank` and `rel= noopener noreferrer` to all links with absolute URLs, since I only use relative URLs for internal links.

```js
/**
 * Set markdown libraries
 *
 * @link https://www.11ty.dev/docs/languages/markdown/#optional-set-your-own-library-instance
 */
eleventyConfig.setLibrary(
  'md',
  markdownIt({ html: true })
    .use(markdownItAnchor, {
      permalink: true,
      permalinkSymbol: '<i data-feather="link" class="link"></i>',
    })
    .use(markdownItLinkAttr, {
      // Make external links open in a new tab.
      pattern: /^https?:\/\//,
      attrs: {
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    })
)
```

## Email Updates Using RSS

If you look at the bottom of this page, you'll notice a subscription form. This feature is implemented by using a combination of [eleventy-plugin-rss](https://www.11ty.dev/docs/plugins/rss/) to automatically generate an RSS [feed.xml](/feed.xml) file and [Mailchimp](https://mailchimp.com/help/share-your-blog-posts-with-mailchimp/).

Using the plugin, you can easily add RSS to your site by adding a `feed.njk` file to the root of your blog. Here is mine:

```html
---json
{
  "permalink": "feed.xml",
  "eleventyExcludeFromCollections": true,
  "metadata": {
    "title": "fragosti",
    "description": "Posts, projects and more by fragosti",
    "url": "https://fragosti.com/",
    "feedUrl": "https://fragosti.com/feed.xml",
    "author": {
      "name": "Francesco Agosti",
      "email": "francesco@fragosti.com"
    }
  }
}
---
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>{{ metadata.title }}</title>
  <subtitle>{{ metadata.description }}</subtitle>
  <link href="{{ metadata.feedUrl }}" rel="self"/>
  <link href="{{ metadata.url }}"/>
  <updated>{{ collections.post | rssLastUpdatedDate }}</updated>
  <id>{{ metadata.url }}</id>
  <author>
    <name>{{ metadata.author.name }}</name>
    <email>{{ metadata.author.email }}</email>
  </author>
  {%- for post in collections.post %}
  {% set absolutePostUrl %}{{ post.url | url | absoluteUrl(metadata.url) }}{% endset %}
  <entry>
    <title>{{ post.data.title }}</title>
    <link href="{{ absolutePostUrl }}"/>
    <updated>{{ post.date | rssDate }}</updated>
    <id>{{ absolutePostUrl }}</id>
    <description>{{ post.data.description }}</description>
    <content type="html">{{ post.templateContent | htmlToAbsoluteUrls(absolutePostUrl) }}</content>
  </entry>
  {%- endfor %}
</feed>
```

Once you have that, Mailchimp and other marketing platforms offer services that will convert updates to your RSS feed to email updates for your subscribers. This is nice because you don't have to cross-post, or write a complex integration every time you want to release a post. The only thing you need to implement is the email itself, and for that Mailchimp provides [RSS Merge Tags](https://mailchimp.com/help/rss-merge-tags/), meaning you can easily include your blog title and content in your emails. As soon as you write a new blog post and deploy it, Mailchimp will pick it up and send out the email.

## Conclusion

As you can see Eleventy provides a simple and elegant solution for those wanting to build a static blog. It's easy to get started, and in my experience, it provided solutions to all problems I wanted to solve while developing, either in the form of documentation or a plugin.

I'm sure things will continue to evolve, but I hope this post is helpful to people implementing features that aren't exactly covered by the main Eleventy docs.
