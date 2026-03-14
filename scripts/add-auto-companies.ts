import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const companySchema = new mongoose.Schema({
  name: String, logo: String, highlight: Boolean, order: Number,
});
const Company = mongoose.model("Company", companySchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected");

  const newCompanies = [
    { name: "Audi", logo: "/images/logos/audi.svg", highlight: true, order: -3 },
    { name: "Porsche", logo: "/images/logos/porsche.svg", highlight: true, order: -2 },
    { name: "Volkswagen", logo: "/images/logos/volkswagen.svg", highlight: true, order: -1 },
  ];

  for (const c of newCompanies) {
    await Company.findOneAndUpdate({ name: c.name }, c, { upsert: true });
    console.log("Upserted:", c.name);
  }

  const all = await Company.find({}).sort({ order: 1 });
  console.log("\nAll companies:", all.map((c) => `${c.name} (order: ${c.order})`).join(", "));

  await mongoose.disconnect();
  console.log("Done!");
}

run().catch(console.error);
