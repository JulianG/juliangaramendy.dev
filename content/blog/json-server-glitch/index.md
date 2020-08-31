---
title: Persistent REST API with json-server and Glitch
description: This is the easiest way I know to get a public persistent REST API up and running in under 1 minute, without writing any code.
tags: rest, json, javascript, glitch
type: 'blog-post'
date: '2020-08-30'
ogimage: https://dev-to-uploads.s3.amazonaws.com/i/j16sy1p2gujx1ckleb6k.jpg
---

This is the easiest way I know to get a public persistent REST API up and running in under 1 minute, without writing any code.

We'll be using [json-server](https://github.com/typicode/json-server) by [tipicode](https://github.com/typicode) hosted on [Glitch](https://glitch.com/).

### Step 1: Clone/Remix the demo project
Head over to [Glitch.com](https://glitch.com) and "remix" my [json-server-demo](https://glitch.com/edit/#!/json-server-demo?path=README.md%3A1%3A0).

### Step 2: Use your own data

You can change **db.json** with your own json "database".

The one in the demo looks like this:

```json
{
  "games": [
    {
      "id": 1,
      "title": "Frogger",
      "year": 1981
	  ...
    },
	...
  ]
}
```

### Step 3: That's it!

While on the Glitch project, click on "Show in a new window", and you'll see the URL/endpoint of **your** REST API.

In the demo's db.json file, ``"games"`` becomes an entity that you can access like this:

```
GET    https://json-server-demo.glitch.me/games
POST   https://json-server-demo.glitch.me/games
PATCH  https://json-server-demo.glitch.me/games/1
DELETE https://json-server-demo.glitch.me/games/1
```

### How it works

Glitch projects can run Node.js, but in our case we don't need to write a single line of code. We simply declare our dependency to json-server and our "start" script in  the **package.json** file:

```json
{
  ...
  "scripts": {
    "start": "json-server --watch ./db.json"
  },
  "dependencies": {
    "json-server": "^0.16.1"
  },
  ...
}
```

By default json-server reads and writes to the db.json file, so all changes made by POST, PATCH, PUT, DELETE http methods are persisted in "disk" in the Glitch project. See [Do you have built-in persistence or a database?](https://glitch.happyfox.com/kb/article/22-do-you-have-built-in-persistence-or-a-database/) in the FAQ.

**The answer is YES!**

> This means you can: Use files as a flat file database

### Warning: Glitch Restrictions
Glitch "projects" seem to take some time to warm up or wake up, and the go back to sleep after a period of inactivity. For this reason I think this quick setup is good for demos or workshops, but not for production.

Please refer to the links below for more information:

- [Glitch Technical Restrictions](https://glitch.happyfox.com/kb/article/17-what-are-the-technical-restrictions-for-glitch-projects/)
- [Glitch Project Hours](https://glitch.happyfox.com/kb/article/83-what%E2%80%99s-the-deal-with-project-hours/)

----

Photo by [coniferconifer](https://www.flickr.com/people/7656600@N06) on [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Koinobori#/media/File:Koinobori_celebrates_coming_Kid's_day_(14030748811).jpg)
