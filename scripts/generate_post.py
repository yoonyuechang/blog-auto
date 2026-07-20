import os, json, time, requests, random

TOPICS = [
    "챗GPT로 월급 외 부수입 만드는 법 5가지",
    "토스로 시작하는 초간단 재테크 꿀팁",
    "2025년 앱테크 추천: 하루 5분으로 돈 버는 앱",
    "카카오뱅크 세이프박스 vs 입출금통장 금리 비교",
    "네이버페이 포인트 현금으로 바꾸는 꿀팁",
    "스마트폰 하나로 시작하는 주린이 재테크",
    "구글 설문지로 무료 마케팅 하는 법",
    "핸드폰 요금제 50% 할인받는 꿀팁",
    "AI 챗봇으로 고객응대 자동화하는 방법",
    "무료로 나만의 홈페이지 만드는 법 (초보자용)",
    "토스뱅크 vs 카카오뱅크 금리 비교 (2025)",
    "네이버 스마트스토어 창업 준비 가이드",
    "유튜브 쇼츠로 부수입 만드는 법",
    "구글 스프레드시트로 가계부 만드는 법",
    "무료 AI 툴 5개로 생산성 2배 올리기",
]

NV_API_KEY = os.environ["NV_API_KEY"]
NV_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

PROMPT = """당신은 한국의 IT/재테크 블로거입니다. 아래 주제로 블로그 글을 써주세요.

주제: {topic}

규칙:
- 1000자 내외
- 정보성 + 실용성
- 한국 20~40대 대상
- 존댓말, 구어체로 자연스럽게
- 소제목(h2) 포함
- 실제 도움되는 구체적인 팁 포함
- 광고성 느낌 금지, 진짜 유용한 정보 위주
- HTML 형식으로 출력
- <body>나 <html> 태그는 포함하지 말고 내용만 출력"""

def generate_post(topic: str) -> dict:
    headers = {"Authorization": f"Bearer {NV_API_KEY}", "Content-Type": "application/json"}
    data = {
        "model": "nvidia/llama-3.1-70b-instruct",
        "messages": [{"role": "user", "content": PROMPT.format(topic=topic)}],
        "max_tokens": 3072,
        "temperature": 0.7,
    }
    for attempt in range(3):
        try:
            resp = requests.post(NV_URL, headers=headers, json=data, timeout=120)
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"].strip()
            for p in ["```html", "```"]:
                if content.startswith(p): content = content[len(p):]
            if content.endswith("```"): content = content[:-3]
            content = content.strip()
            if len(content) < 100:
                raise Exception(f"Too short ({len(content)})")
            return {"title": topic, "content": content}
        except Exception as e:
            print(f"[WARN] Attempt {attempt+1}: {e}")
            time.sleep(10)
    raise Exception("All attempts failed")

if __name__ == "__main__":
    topic = random.choice(TOPICS)
    post = generate_post(topic)
    os.makedirs("output", exist_ok=True)
    with open("output/post.json", "w", encoding="utf-8") as f:
        json.dump(post, f, ensure_ascii=False, indent=2)
    print(f"[OK] Generated: {post['title']}")
