import os
import json
import requests

def publish():
    blog_name = os.environ["TISTORY_BLOG"]
    cookie = os.environ["TISTORY_COOKIE"]

    with open("output/post.json", "r", encoding="utf-8") as f:
        post = json.load(f)

    url = f"https://{blog_name}.tistory.com/manage/post.json"
    headers = {
        "Cookie": cookie,
        "Referer": f"https://{blog_name}.tistory.com/manage/entry/post/",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    data = {
        "id": "0",
        "title": post["title"],
        "content": post["content"],
        "contentType": "html",
        "category": "0",
        "published": "1",
        "visibility": "20",
        "password": "",
        "attachments": [],
        "recaptchaValue": "",
        "uselessMarginForEntry": 1,
        "draftSequence": None,
        "tag": "IT꿀팁,재테크,앱테크"
    }

    resp = requests.post(url, headers=headers, json=data, timeout=30)
    result = resp.json()

    if result.get("status") == "true" or resp.status_code == 200:
        post_id = result.get("postId", "?")
        print(f"[OK] Published: {post['title']} (id: {post_id})")
    else:
        print(f"[FAIL] {resp.status_code} {resp.text[:500]}")

if __name__ == "__main__":
    publish()
