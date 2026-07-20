import os, sys, base64
from playwright.sync_api import sync_playwright

BLOG = "smartmoneyteam"
EMAIL = os.environ["KAKAO_EMAIL"]
PASSWORD = os.environ["KAKAO_PASSWORD"]

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        ctx = browser.new_context(locale="ko-KR")
        page = ctx.new_page()

        page.goto(f"https://{BLOG}.tistory.com/manage", timeout=60000)
        page.wait_for_timeout(5000)

        if "login.kakao.com" in page.url:
            page.wait_for_timeout(3000)
            page.fill("#loginId--1", EMAIL)
            page.click("button[type=submit]")
            page.wait_for_timeout(3000)
            page.fill("#password--1", PASSWORD)
            page.click("button[type=submit]")
            page.wait_for_timeout(8000)

        page.wait_for_timeout(5000)
        if "manage" not in page.url:
            print(f"[FAIL] Login failed. URL: {page.url}")
            page.screenshot(path="output/login-fail.png")
            browser.close()
            sys.exit(1)

        print("[OK] Logged in!")

        # Navigate to skin editor (HTML tab)
        page.goto(f"https://{BLOG}.tistory.com/manage/skin/{BLOG}", timeout=30000)
        page.wait_for_timeout(5000)
        page.screenshot(path="output/skin-page.png")

        # Click HTML tab
        html_tab = page.locator("a:has-text('HTML')")
        if html_tab.is_visible():
            html_tab.click()
            page.wait_for_timeout(2000)

        # Get current skin HTML
        textarea = page.locator("textarea").first
        current_html = textarea.input_value()
        print(f"[INFO] Current HTML length: {len(current_html)}")

        # Inject logo SVG into skin HTML
        logo_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" style="vertical-align:middle;height:50px"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a73e8"/><stop offset="100%" style="stop-color:#0d47a1"/></linearGradient></defs><text x="200" y="58" font-family="-apple-system,sans-serif" font-size="34" font-weight="800" fill="url(#g)" text-anchor="middle" letter-spacing="-2">Smart Money Team</text><text x="200" y="80" font-family="-apple-system,sans-serif" font-size="11" fill="#868e96" text-anchor="middle" letter-spacing="4">IT 꿀팁 &amp; 재테크 노하우</text></svg>'
        favicon_html = '<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2216%22 fill=%22%231a73e8%22/><text x=%2250%22 y=%2268%22 font-family=%22Helvetica%22 font-size=%2252%22 font-weight=%22700%22 fill=%22white%22 text-anchor=%22middle%22>SM</text></svg>">'

        # Add favicon if not present
        if 'rel="icon"' not in current_html:
            current_html = current_html.replace("<head>", f"<head>\n{favicon_html}")

        # Replace blog title with logo if present
        if "<h1" in current_html:
            import re
            current_html = re.sub(r'<h1[^>]*>.*?</h1>', f'<h1 class="logo">{logo_svg}</h1>', current_html, flags=re.DOTALL)

        textarea.fill("")
        textarea.fill(current_html)
        page.wait_for_timeout(1000)

        # Save
        save_btn = page.locator("button:has-text('저장')").first
        if save_btn.is_visible():
            save_btn.click()
            page.wait_for_timeout(5000)
            print("[OK] Skin updated with logo!")
        else:
            print("[FAIL] Save button not found")
            page.screenshot(path="output/no-save-btn.png")

        page.screenshot(path="output/done.png")
        browser.close()
        print("[DONE] Logo injected into skin")

if __name__ == "__main__":
    os.makedirs("output", exist_ok=True)
    run()
