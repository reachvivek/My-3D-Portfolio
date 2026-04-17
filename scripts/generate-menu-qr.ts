import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const URL = "https://reachvivek.vercel.app/menu";
const OUT_DIR = path.join(process.cwd(), "public", "qr");

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  // Large high-res PNG for printing / sharing
  await QRCode.toFile(path.join(OUT_DIR, "menu.png"), URL, {
    errorCorrectionLevel: "H",
    width: 1024,
    margin: 2,
    color: {
      dark: "#d4a853",   // gold
      light: "#0a0a0a",  // dark background
    },
  });

  // Smaller version for web
  await QRCode.toFile(path.join(OUT_DIR, "menu-small.png"), URL, {
    errorCorrectionLevel: "H",
    width: 400,
    margin: 2,
    color: {
      dark: "#d4a853",
      light: "#0a0a0a",
    },
  });

  // SVG version for infinite scale
  const svg = await QRCode.toString(URL, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    color: {
      dark: "#d4a853",
      light: "#0a0a0a",
    },
  });
  fs.writeFileSync(path.join(OUT_DIR, "menu.svg"), svg);

  console.log("QR codes generated:");
  console.log("  public/qr/menu.png      (1024px, for print)");
  console.log("  public/qr/menu-small.png (400px, for web)");
  console.log("  public/qr/menu.svg      (vector)");
  console.log("\nURL encoded:", URL);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
