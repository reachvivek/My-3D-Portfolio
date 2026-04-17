const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://rogerthatvivek:EDLEnqtAS77bzjhx@vivek-portfolio.vuwcuzl.mongodb.net/portfolio";

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("portfolio");

  // Fix hero subline if it has em dashes
  const hero = await db.collection("siteconfigs").findOne({ key: "hero" });
  if (hero && hero.value && typeof hero.value === "object") {
    let changed = false;
    const val = { ...hero.value };
    for (const k of Object.keys(val)) {
      if (typeof val[k] === "string" && val[k].includes("—")) {
        val[k] = val[k].replace(/—/g, ",");
        changed = true;
      }
    }
    if (changed) {
      await db.collection("siteconfigs").updateOne({ key: "hero" }, { $set: { value: val } });
      console.log("Fixed hero config em dashes");
    } else {
      console.log("Hero config: no em dashes found");
    }
  }

  // Fix blog posts
  const posts = await db.collection("blogposts").find({}).toArray();
  for (const post of posts) {
    const updates = {};
    for (const field of ["title", "excerpt", "content"]) {
      if (post[field] && typeof post[field] === "string" && post[field].includes("—")) {
        updates[field] = post[field].replace(/—/g, ",");
      }
    }
    if (Object.keys(updates).length > 0) {
      await db.collection("blogposts").updateOne({ _id: post._id }, { $set: updates });
      console.log(`Fixed em dashes in blog post: ${post.slug}`);
    }
  }

  console.log("Done");
  await client.close();
}

main().catch(console.error);
