const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://rogerthatvivek:EDLEnqtAS77bzjhx@vivek-portfolio.vuwcuzl.mongodb.net/portfolio";

const newContent = `## It Started With a Group Chat

In March 2026, tensions between Iran and Israel hit a peak. My phone was blowing up. WhatsApp groups flooded with unverified flight cancellation rumors, fake threat alerts, and panic. Friends asking if flights were still operating, if it was safe to be in Abu Dhabi, whether the airspace was closed.

Nobody had a single place to check what was actually happening.

I'm a developer. So I built one.

## What I Actually Built

AegisUAE is a real-time crisis informatics command center. Not a news aggregator. Not a Twitter feed. A proper situational awareness tool that pulls verified data from official sources and presents it so anyone can understand it at a glance.

<!-- component:dashboard-features -->

## The Map Was the Hard Part

Rendering hundreds of aircraft positions updating every 5 seconds needs GPU-accelerated WebGL. I ended up layering three mapping libraries: Leaflet for base tiles, MapLibre GL for vector overlays, and deck.gl for the high-performance flight position rendering.

The result is an interactive airspace view showing live flights, active NOTAMs, weather zones, and airport connectivity scores. If someone tells you "all flights are cancelled," you just open the map and see for yourself.

<!-- component:map-preview -->

## The Stack (And Why I Chose It)

I needed this thing live in days, not months. Every choice was about speed to production.

<!-- component:tech-stack -->

## The Engine Room

The frontend never hits external APIs directly. A separate Express.js worker process on Railway runs scheduled collectors on cron jobs, fetching, transforming, and caching data in Turso.

<!-- component:data-collectors -->

Each collector handles its own retry logic and data normalization. The frontend reads from Turso's edge-distributed cache, which means reads are fast from anywhere in the Gulf.

## What I Learned

<!-- component:lessons -->

## Why I'm Writing This

This isn't just a portfolio piece. I built AegisUAE because people around me needed it. My colleagues, friends, people in group chats who were genuinely scared and had no reliable source of truth.

But there's a bigger point here, especially for developers trying to land a job in the UAE.

**Stop building todo apps. Start solving real problems.**

The UAE is full of unsolved problems waiting for someone technical enough to tackle them. Traffic optimization. Water conservation monitoring. Construction safety tracking. Heat stress prediction for outdoor workers. These aren't hypothetical startup ideas. They affect millions of people in this region every day.

When I interview candidates, I don't care about your calculator app or your Netflix clone. I want to see that you identified a real problem, understood the domain, and shipped something that works. That's what separates a junior developer from someone ready to build production systems.

AegisUAE started as a side project born out of frustration. It turned into one of the most technically challenging and personally rewarding things I've ever built.

## Try It Yourself

The dashboard is live and free to use. If you're in the UAE or the broader GCC, bookmark it. Share it with people who need verified information instead of WhatsApp forwards.

[Check out AegisUAE](https://aegisuae.vercel.app)

And if you're building something similar, or want to talk about crisis informatics, real-time systems, or getting a dev job in the UAE, reach out. I'm always happy to chat with builders.`;

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("portfolio");

  const result = await db.collection("blogposts").updateOne(
    { slug: "building-aegis-uae-crisis-dashboard" },
    { $set: { content: newContent } }
  );

  console.log("Updated:", result.modifiedCount, "document(s)");
  await client.close();
}

main().catch(console.error);
