import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join, resolve } from "path";
import https from "https";
import http from "http";

const GBP_URL = "https://share.google/z2pczVgPxbIHSJ2he";
const OUTPUT_DIR = resolve("gbp-photos");
const DOWNLOAD_COUNT = 20;

mkdirSync(OUTPUT_DIR, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = require("fs").createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;
    protocol
      .get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          file.close();
          return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        require("fs").unlink(dest, () => {});
        reject(err);
      });
  });
}

async function downloadImage(url, filepath) {
  const { default: fs } = await import("fs");
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith("https") ? https : http;
    const request = protocol.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    });
    request.on("error", (err) => { fs.unlink(filepath, () => {}); reject(err); });
  });
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  console.log("Opening GBP page...");
  await page.goto(GBP_URL, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log("Current URL:", page.url());

  // Try to find and click the Photos button
  const photosSelectors = [
    'button[aria-label*="Photo"]',
    'button[aria-label*="photo"]',
    '[data-tab-index] button',
    'button:has-text("Photos")',
    'a:has-text("Photos")',
  ];

  let clickedPhotos = false;
  for (const sel of photosSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) {
        await el.click();
        await page.waitForTimeout(2000);
        clickedPhotos = true;
        console.log("Clicked Photos tab with selector:", sel);
        break;
      }
    } catch {}
  }

  if (!clickedPhotos) {
    console.log("Could not find Photos tab — trying to find photo thumbnails directly on page...");
  }

  await page.waitForTimeout(2000);

  // Collect image URLs from thumbnails
  let imageUrls = [];
  let attempts = 0;

  while (imageUrls.length < DOWNLOAD_COUNT && attempts < 5) {
    // Scroll to load more images
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1500);

    imageUrls = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs
        .map((img) => {
          // Prefer srcset high-res, fallback to src
          if (img.srcset) {
            const parts = img.srcset.split(",").map((s) => s.trim().split(" "));
            const last = parts[parts.length - 1];
            return last[0];
          }
          return img.src;
        })
        .filter((src) => {
          if (!src || src.startsWith("data:")) return false;
          // Only grab Google content images (lh3, lh4, lh5, lh6 are GBP photos)
          return /lh[3-6]\.googleusercontent\.com/.test(src);
        })
        // Bump to higher resolution by modifying the size param
        .map((src) => src.replace(/=w\d+-h\d+.*$/, "=w1200-h900").replace(/=s\d+.*$/, "=w1200-h900"));
    });

    // Deduplicate
    imageUrls = [...new Set(imageUrls)];
    console.log(`Found ${imageUrls.length} candidate images so far...`);
    attempts++;
  }

  if (imageUrls.length === 0) {
    console.error("No Google photo URLs found. The page may require interaction.");
    await browser.close();
    process.exit(1);
  }

  const toDownload = imageUrls.slice(0, DOWNLOAD_COUNT);
  console.log(`\nDownloading ${toDownload.length} images to: ${OUTPUT_DIR}\n`);

  for (let i = 0; i < toDownload.length; i++) {
    const url = toDownload[i];
    const filename = join(OUTPUT_DIR, `photo-${String(i + 1).padStart(2, "0")}.jpg`);
    try {
      await downloadImage(url, filename);
      console.log(`  [${i + 1}/${toDownload.length}] Saved: photo-${String(i + 1).padStart(2, "0")}.jpg`);
    } catch (err) {
      console.error(`  [${i + 1}] Failed: ${err.message}`);
    }
  }

  console.log("\nDone! Check the gbp-photos folder.");
  await browser.close();
})();
