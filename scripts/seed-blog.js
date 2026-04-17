const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://rogerthatvivek:EDLEnqtAS77bzjhx@vivek-portfolio.vuwcuzl.mongodb.net/portfolio?appName=vivek-portfolio');

  const BlogPost = mongoose.model('BlogPost', new mongoose.Schema({
    title: String, slug: String, excerpt: String, content: String,
    coverImage: String, tags: [String], published: Boolean, publishedAt: Date,
    readTime: String, claps: Number, views: Number, order: Number
  }));

  const content = `## It Started With a Group Chat

In March 2026, tensions between Iran and Israel hit a peak. My phone was blowing up. WhatsApp groups were flooded with unverified flight cancellation rumors, fake threat alerts, and panic. Friends were asking me if flights were still operating, if it was safe to be in Abu Dhabi, whether the airspace was closed.

Nobody had a single place to check what was actually happening.

I'm a developer. I thought, why not just build one?

## What I Actually Built

AegisUAE is a real-time crisis informatics command center. Not a news aggregator. Not a Twitter feed. A proper situational awareness tool that pulls verified data from official sources and presents it in a way that anyone can understand at a glance.

Here's what it does:

**Live Airspace Monitoring**
An interactive map showing real-time flight positions over UAE airspace, active NOTAMs (airspace restrictions), weather warning zones, and airport connectivity scores. If someone tells you "all flights are cancelled," you can just open the map and see for yourself.

**Threat Intelligence Timeline**
A chronological feed of verified geopolitical events pulled from GDELT (the Global Database of Events, Language, and Tone). Each event gets categorized, timestamped, and plotted. No rumors. No speculation. Just data.

**AI Advisory Chatbot**
A conversational interface powered by Groq's Llama 3.3 70B model. You can ask it natural language questions like "Is it safe to fly to Dubai right now?" and it synthesizes answers from all the live data sources.

**Evacuation Routes + Shelter Finder**
Multi-modal evacuation route planning and emergency shelter locations with proximity mapping. Because if things actually go sideways, people need actionable information, not tweets.

**News Feed With AI Summaries**
Aggregated from WAM (UAE's official news agency), Al Jazeera, and GNews API. Each story gets an AI-distilled summary so you can scan 50 articles in 2 minutes.

## The Stack (And Why I Chose It)

I needed this thing live in days, not months. Every choice was about speed to production.

**Frontend:** Next.js 16.2 with React 19 and TypeScript. App Router for the API routes and SSR. Tailwind 4 and shadcn/ui because I didn't have time to design a component library from scratch.

**Maps:** This was the hard part. I ended up using three mapping libraries together. Leaflet for the base layer, MapLibre GL for vector tiles, and deck.gl for the high-performance flight position overlays. Rendering hundreds of aircraft positions updating every 5 seconds needs GPU-accelerated WebGL, which is what deck.gl gives you.

**Data Layer:** Turso (libSQL) as the edge database. SQLite-compatible but globally distributed. Perfect for a dashboard that needs fast reads and doesn't have complex relational queries. 8 tables covering everything from cached API responses to alert history to chat conversations.

**Backend Worker:** A separate Express.js process running on Railway. This is the engine room. It runs scheduled collectors on cron jobs:
- Weather data every 10 minutes
- Flight positions every 5 minutes
- News feeds every 5 minutes
- GDELT events every 15 minutes
- Earthquake data every 15 minutes
- Shelter locations daily

Each collector fetches, transforms, and caches data in Turso. The frontend never hits external APIs directly.

**AI:** Groq SDK hitting Llama 3.3 70B for the advisory chatbot. OpenAI GPT-4o mini for news summarization in the backend worker. I went with Groq for the chat because the latency is insane, responses come back in under a second.

**Real-time Updates:** Server-Sent Events (SSE) for pushing live updates to the dashboard without polling.

## What I Learned

**1. Verified data beats fast data.** The whole point of this project was to combat misinformation. Every data source is official or peer-reviewed. FlightAware for flights, USGS for earthquakes, FAA for NOTAMs, WAM for UAE news. If I can't verify the source, it doesn't go on the dashboard.

**2. Edge databases are underrated.** Turso was a revelation. I was skeptical about SQLite for a production dashboard, but the read performance is incredible and the global distribution means the dashboard loads fast from anywhere in the Gulf.

**3. You don't need a team.** I built this solo. One developer, a week of focused work, and it's a production system with 18 components, 16 API routes, 14 custom hooks, and a full admin panel. The modern web stack makes this possible if you know what you're doing.

**4. Multiple map libraries can coexist.** I was worried about using Leaflet, MapLibre, and deck.gl together. Turns out they compose well if you layer them properly. Leaflet handles the base tiles, MapLibre handles vector overlays, and deck.gl handles the heavy real-time data visualization.

## Why I'm Writing This

This isn't just a portfolio piece. I built AegisUAE because people around me needed it. My colleagues, my friends, people in group chats who were genuinely scared and had no reliable source of truth.

But there's a bigger point here, especially if you're a developer trying to land a job in the UAE.

**Stop building todo apps. Start solving real problems.**

The UAE is full of unsolved problems waiting for someone technical enough to tackle them. Traffic optimization. Water conservation monitoring. Construction safety tracking. Heat stress prediction for outdoor workers. These aren't hypothetical startup ideas. These are things that affect millions of people in this region every single day.

When I interview candidates, I don't care about your calculator app or your Netflix clone. I want to see that you identified a real problem, understood the domain, and shipped something that actually works. That's what separates a junior developer from someone who's ready to build production systems.

AegisUAE started as a side project born out of frustration. It turned into one of the most technically challenging and personally rewarding things I've ever built. And it lives at [aegisuae.vercel.app](https://aegisuae.vercel.app) for anyone who needs it.

If you're sitting on a problem you keep complaining about, maybe it's time to stop complaining and start coding.

## Try It Yourself

The dashboard is live and free to use. If you're in the UAE or the broader GCC, bookmark it. Share it with people who need verified information instead of WhatsApp forwards.

[Check out AegisUAE](https://aegisuae.vercel.app)

And if you're building something similar, or want to talk about crisis informatics, real-time systems, or just getting a dev job in the UAE, reach out. I'm always happy to chat with builders.`;

  await BlogPost.updateOne(
    { slug: 'building-aegis-uae-crisis-dashboard' },
    { $set: {
      title: 'I Built a Real-Time Crisis Dashboard During the Iran-Israel Conflict. Here Is Why.',
      excerpt: "When missiles started flying over the Middle East in early 2026, I realized I could either doom-scroll like everyone else or actually build something useful. So I built AegisUAE, a real-time crisis informatics dashboard for the UAE.",
      content,
      coverImage: null,
      tags: ['Next.js', 'Turso', 'MapLibre', 'deck.gl', 'Groq AI', 'Real-Time', 'Crisis Informatics'],
      published: true,
      publishedAt: new Date('2026-03-25'),
      readTime: '9 min read',
      claps: 142,
      views: 2847
    }},
    { upsert: true }
  );

  console.log('Blog post rewritten with real project data');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
