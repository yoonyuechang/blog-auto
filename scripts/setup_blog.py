import os
import re
from playwright.sync_api import sync_playwright

BLOG = "smartmoneyteam"
EMAIL = os.environ["KAKAO_EMAIL"]
PASSWORD = os.environ["KAKAO_PASSWORD"]

SKIN_HTML = """<div class="wrap">
    <header id="header">
        <div class="inner">
            <h1><a href="/">Smart Money Team</a></h1>
            <p class="desc">IT 꿀팁과 재테크 노하우</p>
        </div>
    </header>
    <main id="content">
        <div class="inner">
            <article class="post">
                <h2 class="post-title">[##_title_##]</h2>
                <div class="post-content">[##_body_##]</div>
            </article>
        </div>
    </main>
    <footer id="footer">
        <div class="inner">
            <p>© Smart Money Team</p>
        </div>
    </footer>
</div>"""

CUSTOM_CSS = """/* Smart Money Team Custom Skin */
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: -apple-system, 'Noto Sans KR', 'Malgun Gothic', sans-serif;
    line-height: 1.8;
    color: #2d2d2d;
    background: #f8f9fa;
}
.inner { max-width: 780px; margin: 0 auto; padding: 0 20px; }
#header {
    background: white;
    border-bottom: 1px solid #e9ecef;
    padding: 32px 0 24px;
    text-align: center;
}
#header h1 { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
#header h1 a { color: #1a73e8; text-decoration: none; }
#header .desc { color: #868e96; font-size: 14px; margin-top: 4px; }
#content { padding: 40px 0; }
.post {
    background: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.post-title {
    font-size: 28px;
    font-weight: 700;
    line-height: 1.4;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #1a73e8;
}
.post-content p { margin-bottom: 16px; font-size: 15px; line-height: 1.9; }
.post-content h2 { font-size: 20px; font-weight: 700; margin: 40px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #1a73e8; }
.post-content h3 { font-size: 17px; font-weight: 600; margin: 28px 0 12px; }
.post-content ul, .post-content ol { margin-bottom: 16px; padding-left: 20px; }
.post-content li { margin-bottom: 6px; font-size: 15px; }
.post-content strong { color: #1a73e8; }
.post-content blockquote { border-left: 4px solid #1a73e8; padding: 12px 20px; margin: 20px 0; background: #f8f9fa; border-radius: 4px; color: #555; }
.post-content img { border-radius: 8px; max-width: 100%; height: auto; }
.post-content a { color: #1a73e8; text-decoration: underline; }
.post-content a:hover { color: #0d47a1; }
#footer { text-align: center; padding: 32px 0; color: #adb5bd; font-size: 13px; }
@media (max-width: 768px) {
    .inner { padding: 0 16px; }
    .post { padding: 24px 16px; border-radius: 0; }
    .post-title { font-size: 22px; }
    .post-content p { font-size: 14px; }
}
@media (max-width: 480px) {
    #header { padding: 24px 0 16px; }
    #header h1 { font-size: 22px; }
    .post-title { font-size: 18px; }
}
"""

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        ctx = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            locale="ko-KR",
        )
        page = ctx.new_page()

        # 1. Tistory manage 접속
        page.goto(f"https://{BLOG}.tistory.com/manage", wait_until="networkidle")

        # 2. Kakao 로그인 처리
        if "login.kakao.com" in page.url:
            page.fill("input[name=loginId]", EMAIL)
            page.click("button[type=submit]")
            page.wait_for_timeout(2000)
            page.fill("input[name=password]", PASSWORD)
            page.click("button[type=submit]")
            page.wait_for_timeout(5000)

        # 3. manage page 로딩 대기
        page.wait_for_url(f"https://{BLOG}.tistory.com/manage**", timeout=30000)
        page.wait_for_timeout(3000)

        # 4. 스킨 편집 페이지
        page.goto(f"https://{BLOG}.tistory.com/manage/skin", wait_until="networkidle")
        page.wait_for_timeout(3000)

        # 5. HTML 편집
        page.goto(f"https://{BLOG}.tistory.com/manage/skin/{BLOG}", wait_until="networkidle")
        page.wait_for_timeout(3000)

        # 6. HTML 탭 클릭
        page.click("a:has-text('HTML')")
        page.wait_for_timeout(2000)

        # 7. HTML 에디터 내용 지우고 새 스킨 HTML 입력
        textarea = page.locator("textarea#html_textarea")
        textarea.fill("")
        textarea.fill(SKIN_HTML)
        page.wait_for_timeout(1000)

        # 8. CSS 탭
        page.click("a:has-text('CSS')")
        page.wait_for_timeout(2000)

        # 9. CSS 에디터 내용 지우고 새 CSS 입력
        css_textarea = page.locator("textarea#css_textarea")
        css_textarea.fill("")
        css_textarea.fill(CUSTOM_CSS)
        page.wait_for_timeout(1000)

        # 10. 저장
        page.click("button:has-text('저장')")
        page.wait_for_timeout(5000)

        page.screenshot(path="output/blog_setup.png")
        browser.close()
        print("[OK] Blog skin and CSS applied successfully")

if __name__ == "__main__":
    os.makedirs("output", exist_ok=True)
    run()
