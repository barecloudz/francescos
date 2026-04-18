import os
import time
import urllib.request
from playwright.sync_api import sync_playwright

GBP_URL = "https://share.google/z2pczVgPxbIHSJ2he"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "gbp-photos")
DOWNLOAD_COUNT = 20

os.makedirs(OUTPUT_DIR, exist_ok=True)

def download_image(url, filepath):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response:
        with open(filepath, "wb") as f:
            f.write(response.read())

def bump_resolution(url):
    import re
    url = re.sub(r"=w\d+-h\d+.*$", "=w1200-h900", url)
    url = re.sub(r"=s\d+.*$", "=w1200-h900", url)
    return url

def collect_photo_urls(page):
    urls = page.evaluate("""() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
            .map(img => {
                if (img.srcset) {
                    const parts = img.srcset.split(',').map(s => s.trim().split(' '));
                    return parts[parts.length - 1][0];
                }
                return img.src;
            })
            .filter(src => src && !src.startsWith('data:') && /lh[3-6]\\.googleusercontent\\.com/.test(src));
    }""")
    return list(dict.fromkeys(urls))  # deduplicate, preserve order

with sync_playwright() as p:
    print("Launching Chrome...")
    browser = p.chromium.launch(channel="chrome", headless=False, slow_mo=150)
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    page = context.new_page()

    print("Opening GBP page...")
    page.goto(GBP_URL, wait_until="networkidle", timeout=30000)
    time.sleep(3)

    print("Current URL:", page.url)

    # Handle CAPTCHA / bot detection
    if "sorry" in page.url or "captcha" in page.url.lower():
        print("\n*** Google CAPTCHA detected — solve it in the browser window ***")
        print("Waiting up to 2 minutes for you to complete it...")
        for _ in range(120):
            time.sleep(1)
            if "sorry" not in page.url and "captcha" not in page.url.lower():
                break
        time.sleep(3)
        print("Current URL after CAPTCHA:", page.url)

    # Try to click the Photos tab
    photo_selectors = [
        'button[aria-label*="Photo"]',
        'button[aria-label*="photo"]',
        'button:has-text("Photos")',
        'a:has-text("Photos")',
    ]
    for sel in photo_selectors:
        try:
            el = page.locator(sel).first
            if el.is_visible(timeout=2000):
                el.click()
                time.sleep(2)
                print(f"Clicked Photos tab: {sel}")
                break
        except:
            pass

    # Scroll to load images
    image_urls = []
    for attempt in range(6):
        page.evaluate("window.scrollBy(0, 800)")
        time.sleep(1.5)
        found = collect_photo_urls(page)
        image_urls = found
        print(f"  Scroll {attempt + 1}: {len(image_urls)} candidate images found")
        if len(image_urls) >= DOWNLOAD_COUNT:
            break

    if not image_urls:
        print("No Google photo URLs found. The page may need manual interaction.")
        browser.close()
        exit(1)

    to_download = [bump_resolution(u) for u in image_urls[:DOWNLOAD_COUNT]]
    print(f"\nDownloading {len(to_download)} images to: {os.path.abspath(OUTPUT_DIR)}\n")

    for i, url in enumerate(to_download):
        filename = os.path.join(OUTPUT_DIR, f"photo-{str(i + 1).zfill(2)}.jpg")
        try:
            download_image(url, filename)
            print(f"  [{i + 1}/{len(to_download)}] Saved photo-{str(i + 1).zfill(2)}.jpg")
        except Exception as e:
            print(f"  [{i + 1}] Failed: {e}")

    print("\nDone! Check the gbp-photos folder.")
    browser.close()
