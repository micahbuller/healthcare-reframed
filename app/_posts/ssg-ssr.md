---
title: "We recommend using"
date: "2020-01-02"
slug: "we-recommend"
description: "A comparison of Static Generation and Server-side Rendering."
imageUrl: "https://res.cloudinary.com/mindflip/image/upload/v1741321112/healthcare%20reframed/woaw1cq7eqygpsob7ckc.jpg"
externalLink: "https://external-resource.com"
youtubeLink: "https://youtube.com/example"
spotifyLink: "https://spotify.com/example"
appleMusicLink: "https://apple.com/example"
---
 
We recommend using **Static Generation** (with and without data) whenever possible because your page can be built once and served by CDN, which makes it much faster than having a server render the page on every request.
 
You can use Static Generation for many types of pages, including:
 
- Marketing pages
- Blog posts
- E-commerce product listings
- Help and documentation
 
You should ask yourself: "Can I pre-render this page **ahead** of a user's request?" If the answer is yes, then you should choose Static Generation.
 
On the other hand, Static Generation is **not** a good idea if you cannot pre-render a page ahead of a user's request. Maybe your page shows frequently updated data, and the page content changes on every request.
 
In that case, you can use **Server-Side Rendering**. It will be slower, but the pre-rendered page will always be up-to-date. Or you can skip pre-rendering and use client-side JavaScript to populate data.