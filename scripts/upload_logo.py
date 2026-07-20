import os, sys
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
        page.screenshot(path="output/1-login.png")

        if "login.kakao.com" in page.url:
            page.wait_for_timeout(3000)
            page.screenshot(path="output/2-kakao-login.png")
            page.fill("#loginId--1", EMAIL)
            page.click("button[type=submit]")
            page.wait_for_timeout(3000)
            page.screenshot(path="output/3-after-email.png")
            page.fill("#password--1", PASSWORD)
            page.click("button[type=submit]")
            page.wait_for_timeout(8000)
            page.screenshot(path="output/4-after-login.png")

        page.wait_for_timeout(5000)
        page.screenshot(path="output/5-manage.png")

        if "manage" in page.url:
            print("[OK] Logged in!")
        else:
            print(f"[FAIL] URL: {page.url}")
            browser.close()
            sys.exit(1)

        page.goto(f"https://{BLOG}.tistory.com/manage/blog", timeout=30000)
        page.wait_for_timeout(3000)
        page.screenshot(path="output/6-blog-settings.png")

        logo_path = os.path.abspath("assets/logo.svg")
        if os.path.exists(logo_path):
            file_input = page.locator("input[type=file]").first
            if file_input:
                file_input.set_input_files(logo_path)
                page.wait_for_timeout(3000)
                page.screenshot(path="output/7-logo-uploaded.png")
                save_btn = page.locator("button:has-text('저장')").first
                if save_btn:
                    save_btn.click()
                    page.wait_for_timeout(3000)
                    print("[OK] Logo uploaded")

        page.goto(f"https://{BLOG}.tistory.com/manage/blog", timeout=30000)
        page.wait_for_timeout(2000)
        favicon_path = os.path.abspath("assets/favicon.svg")
        if os.path.exists(favicon_path):
            file_inputs = page.locator("input[type=file]")
            if file_inputs.count() > 1:
                file_inputs.nth(1).set_input_files(favicon_path)
                page.wait_for_timeout(3000)
                page.screenshot(path="output/8-favicon-uploaded.png")
                save_btn = page.locator("button:has-text('저장')").first
                if save_btn:
                    save_btn.click()
                    page.wait_for_timeout(3000)
                    print("[OK] Favicon uploaded")

        browser.close()
        print("[DONE] Logo and favicon uploaded")

if __name__ == "__main__":
    os.makedirs("output", exist_ok=True)
    run()
