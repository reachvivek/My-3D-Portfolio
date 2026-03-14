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

  await Company.findOneAndUpdate({ name: "Porsche" }, { logo: "/images/logos/porsche.png" });
  console.log("Updated Porsche → porsche.png");

  const all = await Company.find({}).sort({ order: 1 });
  for (const c of all) {
    console.log(`  ${c.name}: ${c.logo} (highlight: ${c.highlight})`);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
