---
title: "Scott Reiner Title"
date: "2020-01-02"
description: "A comparison of Static Generation and Server-side Rendering."
imageUrl: "https://res.cloudinary.com/mindflip/image/upload/v1752035000/healthcare%20reframed/Episodes/001_Scott_Reiner/EAA2BA93-D844-46EA-BB63-33F0BB69D207_r7lgtu.jpg"
externalLink: "https://external-resource.com"
youtubeLink: "https://youtube.com/example"
spotifyLink: "https://spotify.com/example"
appleMusicLink: "https://apple.com/example"
---
 
Next.js has two forms of pre-rendering: **Static Generation** and **Server-side Rendering**. The difference is in **when** it generates the HTML for a page.
 
- **Static Generation** is the pre-rendering method that generates the HTML at **build time**. The pre-rendered HTML is then _reused_ on each request.
- **Server-side Rendering** is the pre-rendering method that generates the HTML on **each request**.
 
Importantly, Next.js lets you **choose** which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.