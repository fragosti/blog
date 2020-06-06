---
layout: post.njk
title: First Ever Blog Post
date: 2019-05-30
tags: post
---

The root of this technique is just setting the height of the module in a predictable way. Let’s say you set the line-height to 1.2em. If we want to expose three lines of text, we can just make the height of the container 3.6em (1.2em × 3). The hidden overflow will hide the rest.

But it can be a bit awkward to just cut the text off like that. Ideally, we would add ellipsis, but we can’t reliably position them. So instead we’ll fade out the text achieving the same kind of communication (“there is more…”).

To fade out the last line, we make a box (a pseudo element will work great) and overlay a transparent-to-background-color gradient over the top. Making it nearly as wide as the container is best in case the last line is short. Because we know the line-height, we can make the pseudo element box exactly one line tall.

## Subheading

Content.

```js
const a = 3
const doSomething = () => {
  console.log('hey')
}
```
