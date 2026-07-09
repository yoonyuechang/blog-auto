#!/usr/bin/env python3
import os, sys, json, random, textwrap, re, base64, time
from datetime import datetime, timezone, timedelta
from pathlib import Path
from xml.sax.saxutils import escape
import requests

GEMINI_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_KEY:
    print("GEMINI_API_KEY not set")
    sys.exit(1)

KST = timezone(timedelta(hours=9))
NOW = datetime.now(KST)
POSTS_DIR = Path(__file__).parent.parent / "_posts"
IMAGES_DIR = Path(__file__).parent.parent / "images"
PROGRESS_FILE = Path(__file__).parent / ".progress"

UA = "DevAndAIDigest/1.0 (GitHub Actions; +https://github.com/yoonyuechang/blog-auto)"

GIT_TOPICS = [
    ("git bisect", "이분탐색으로 버그를 찾는 과학적인 방법"),
    ("git reflog", "실수로 날린 커밋도 되살리는 법"),
    ("git worktree", "동시에 여러 브랜치를 작업해야 할 때"),
    ("git cherry-pick", "원하는 커밋만 골라 합치는 기술"),
    ("git stash 응용", "임시 저장을 넘어선 git stash 활용법"),
    ("git rebase -i", "커밋 히스토리를 대화형으로 정리하기"),
    ("git hooks", "커밋 전에 자동으로 검사 실행하기"),
    ("git blame", "코드의 역사를 추적하는 법"),
    (".gitattributes", "파일 타입별로 Git 동작을 다르게 설정하는 법"),
    ("Git LFS", "대용량 파일을 Git으로 관리해야 할 때"),
    ("서명된 커밋", "내 커밋이 진짜 내 것임을 증명하는 방법"),
    ("git sparse checkout", "거대 저장소에서 필요한 파일만 내려받기"),
    ("git merge vs rebase", "상황별 전략과 차이점"),
    ("git log 옵션 10가지", "git log를 능숙하게 다루는 법"),
    ("git revert vs reset", "안전하게 과거로 돌아가는 법"),
    ("git grep", "저장소 전체를 터미널에서 검색하기"),
    ("git shortlog", "릴리스 노트를 자동 생성하는 방법"),
    ("git bisect run", "버그 찾기를 완전 자동화하는 방법"),
    ("git worktree add", "임시 작업 공간이 필요할 때"),
    ("git submodule vs subtree", "의존성 포함 전략의 장단점"),
    ("git range-diff", "두 브랜치의 차이를 비교하는 고급 기술"),
    ("git replace", "로컬에서 커밋을 교체하는 숨은 기능"),
    ("git notes", "커밋에 메모를 붙이는 방법"),
    ("git fsck", "저장소 상태를 검사하고 복구하는 법"),
]

SITE_BASE = os.environ.get("SITE_BASE", "/blog-auto")

def gemini(prompt, system=None):
    parts = [{"text": prompt}]
    body = {"contents": [{"parts": parts}]}
    if system:
        body["systemInstruction"] = {"parts": [{"text": system}]}
    waits = [10, 30, 60]
    for attempt in range(4):
        try:
            resp = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}",
                json=body, timeout=120,
            )
            resp.raise_for_status()
            return resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        except requests.HTTPError as e:
            if resp.status_code == 429 and attempt < 3:
                print(f"Gemini 429, retrying in {waits[attempt]}s...")
                time.sleep(waits[attempt])
                continue
            raise
    raise Exception("Gemini API failed after 4 retries")

def slugify(text):
    text = text.lower().replace(" ", "-")
    text = re.sub(r"[^a-z0-9가-힣\-\_]", "", text)
    return text[:60].strip("-")

def make_svg(title, date_str, post_type):
    svg = f'''<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
<rect width="800" height="400" fill="#09090b"/>
<rect x="0" y="376" width="800" height="24" fill="#18181b"/>
<text x="48" y="180" fill="#fafafa" font-size="32" font-weight="700" font-family="system-ui, sans-serif">{escape(title)}</text>
<text x="48" y="230" fill="#a1a1aa" font-size="15" font-family="system-ui, sans-serif">{escape(date_str)} · Dev & AI Digest</text>
<text x="48" y="260" fill="#52525b" font-family="'SF Mono', 'JetBrains Mono', monospace" font-size="13" text-transform="uppercase" letter-spacing="2">{escape(post_type)}</text>
</svg>'''
    return svg

def pick_progress():
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {"day": 0, "git_idx": 0}

def save_progress(p):
    PROGRESS_FILE.parent.mkdir(exist_ok=True)
    with open(PROGRESS_FILE, "w") as f:
        json.dump(p, f)

def fetch_hn(limit=30):
    try:
        resp = requests.get("https://hacker-news.firebaseio.com/v0/topstories.json", timeout=15, headers={"User-Agent": UA})
        resp.raise_for_status()
        ids = resp.json()[:limit]
        items = []
        for i in ids:
            r = requests.get(f"https://hacker-news.firebaseio.com/v0/item/{i}.json", timeout=10, headers={"User-Agent": UA})
            r.raise_for_status()
            d = r.json()
            items.append({"title": d.get("title",""), "url": d.get("url",""), "score": d.get("score",0), "descendants": d.get("descendants",0), "source": "HackerNews", "id": i})
        return items
    except Exception as e:
        print(f"HN fetch failed: {e}")
        return []

def fetch_reddit(subreddits=None):
    if subreddits is None:
        subreddits = ["programming", "MachineLearning", "artificial", "tech"]
    items = []
    for sub in subreddits:
        for domain in ["old.reddit.com", "www.reddit.com"]:
            try:
                resp = requests.get(
                    f"https://{domain}/r/{sub}/hot.json?limit=10",
                    timeout=15,
                    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},
                )
                resp.raise_for_status()
                for post in resp.json()["data"]["children"]:
                    d = post["data"]
                    if d.get("stickied") or d.get("over_18"):
                        continue
                    items.append({"title": d["title"], "url": d.get("url",""), "score": d.get("score",0), "descendants": d.get("num_comments",0), "source": f"r/{sub}", "id": d.get("id","")})
                break
            except Exception:
                continue
        time.sleep(1)
    return items

def fetch_lobsters():
    try:
        resp = requests.get("https://lobste.rs/hottest.json", timeout=15, headers={"User-Agent": UA})
        resp.raise_for_status()
        items = []
        for d in resp.json()[:20]:
            items.append({"title": d.get("title",""), "url": d.get("url",""), "score": d.get("score",0), "descendants": d.get("comment_count",0), "source": "Lobsters", "id": d.get("short_id","")})
        return items
    except Exception as e:
        print(f"Lobsters fetch failed: {e}")
        return []

def fetch_devto(limit=10):
    try:
        resp = requests.get(f"https://dev.to/api/articles?top=1&per_page={limit}", timeout=15, headers={"User-Agent": UA})
        resp.raise_for_status()
        items = []
        for d in resp.json():
            items.append({"title": d.get("title",""), "url": d.get("url",""), "score": d.get("positive_reactions_count",0), "descendants": d.get("comments_count",0), "source": "dev.to", "id": d.get("id","")})
        return items
    except Exception as e:
        print(f"dev.to fetch failed: {e}")
        return []

def collect_news():
    items = []
    items.extend(fetch_hn(50))
    items.extend(fetch_reddit())
    items.extend(fetch_lobsters())
    items.extend(fetch_devto(10))

    for it in items:
        it["engagement"] = it["score"] + it["descendants"] * 2
    items.sort(key=lambda x: x["engagement"], reverse=True)
    return items[:20]

NEWS_PROMPT = textwrap.dedent("""\
당신은 실리콘밸리에서 일하는 한국인 개발자 출신 테크 라이터입니다.
전문가, 주니어, 비개발자 모두가 읽는 뉴스레터를 씁니다.

## 글의 구조 (반드시 아래 순서를 지킬 것)

1. **리드 (2-3문장)**: 이번 소식을 한 줄로 요약. "이런 일이 있었다"를 간결하게.
2. **이게 왜 중요할까?** (초보자+중급자 대상): 이 기술/소식이 왜 나왔는지, 무슨 문제를 푸는지.
3. **핵심 내용** (중급자+전문가 대상): 기술적 디테일, 아키텍처, 기존과의 차이점.
4. **쉽게 풀어보기** (초보자 대상): 비유를 들어 개념을 설명. 전공자 스킵 가능.
5. **인사이트** (전문가 대상): 이게 시장/업계에 던지는 의미, 앞으로 주목할 점.

## 지켜야 할 것
- 한국어, '-니다'체, 간결한 문장
- "혁신적인", "획기적인", "강력한" 같은 광고성 형용사 금지
- "~할 수 있습니다", "~것으로 보입니다" 같은 추측 금지
- **전문 용어는 첫 등장 시 반드시 괄호로 한글 설명 병기** (예: "monorepo(단일 저장소에서 여러 프로젝트를 관리하는 방식)")
- "오늘은 ~에 대해 알아보겠습니다", "함께 살펴보겠습니다" 금지
- 문단을 의도적으로 짧게 (3-4문장 이하)
- 총 분량: 1000-1500자 내외""")

def generate_news_post(progress):
    all_items = collect_news()
    if not all_items:
        print("No news items from any source, falling back to git post")
        return generate_git_post(progress)

    top = all_items[:10]
    candidates = "\n\n".join([
        f"[{i+1}] {it['title']}\n   출처: {it['source']}   점수: {it['score']}   댓글: {it['descendants']}   URL: {it['url']}"
        for i, it in enumerate(top)
    ])

    prompt = textwrap.dedent(f"""\
    오늘의 기술 뉴스 후보 10개입니다. 이 중 가장 블로그 포스트로 가치 있는 것을 골라 포스트를 작성해주세요.

    선정 기준:
    - 한국 개발자에게 실질적으로 유용한 정보인가
    - 기술적 깊이가 있는가
    - 단순한 제품 발표보다 업계 흐름을 보여주는가
    - 지나치게 영어권/서양 중심에 갇히지 않았는가

    --- 후보 목록 ---

    {candidates}

    ---

    출력 형식:
    1. 먼저 '---선정---' 줄에 선택한 후보 번호를 씁니다
    2. 이어서 블로그 포스트를 작성합니다""")

    result = gemini(prompt, system=NEWS_PROMPT)

    selected = 0
    post_text = result
    for i in range(1, 11):
        if f"---선정---\n{i}" in result or f"---선정---\n\n{i}" in result:
            selected = i - 1
            parts = result.split("---선정---")
            if len(parts) > 1:
                post_text = parts[-1].strip()
            break

    item = top[selected] if selected < len(top) else top[0]
    post_title = item["title"][:80]
    source_url = item["url"] or f"https://news.ycombinator.com/item?id={item['id']}"
    post_slug = slugify(post_title)
    date_str = NOW.strftime("%Y-%m-%d")

    return build_post(post_title, post_slug, post_text, date_str, ["해외뉴스", "AI/개발"], f"{item['source']}: {post_title[:60]}", source_url, source_name=item['source'])

GIT_PROMPT = textwrap.dedent("""\
당신은 Git을 잘 이해하고 있는 한국인 시니어 개발자입니다.
초보자부터 시니어까지 다 읽는 기술 블로그에 Git 팁을 연재합니다.

## 글의 구조 (반드시 아래 순서를 지킬 것)

1. **리드**: "git에서 이런 기능이 있다. 아는 사람은 적지만, 알면 인생이 편해진다"는 톤으로 시작.
2. **이 상황에서 써먹는다** (초보자+중급자): 어떤 문제 상황에서 이 기술이 필요한지 구체적인 시나리오.
3. **실전 명령어** (모든 레벨): 실제 터미널 명령어와 출력 예시를 코드 블록으로.
4. **원리 설명** (중급자+전문가): 이게 내부적으로 어떻게 동작하는지, 그래서 무엇을 주의해야 하는지.
5. **초보자 노트** (초보자): "git을 막 시작한 사람은 이 정도만 알아도 됨"이라는 섹션. 전공자 스킵 가능.

## 지켜야 할 것
- 한국어, '-니다'체, 명령어만 영어
- "~입니다", "~합니다"로 통일 (해요체 금지)
- "유용한", "강력한", "편리한" 같은 수식어 금지
- **전문 용어는 첫 등장 시 반드시 괄호로 한글 설명 병기**
- 코드 블록은 반드시 실제 실행 예시 포함
- 이 기술을 남용하면 안 되는 상황(함정)도 반드시 언급
- 초보자 섹션은 선택적 읽기임을 명시
- 총 분량: 1000-1500자 내외""")

def generate_git_post(progress):
    idx = progress.get("git_idx", 0)
    topic, desc = GIT_TOPICS[idx % len(GIT_TOPICS)]
    progress["git_idx"] = idx + 1

    prompt = textwrap.dedent(f"""\
    다음 Git 주제에 대한 블로그 포스트를 써주세요.

    주제: {topic}
    한 줄 설명: {desc}

    포인트:
    - 초보자는 "git에 이런 기능이 있었어?" 하고 놀라고
    - 중급자는 실무에 바로 써먹을 수 있고
    - 고수는 "아 맞아, 그런데 이건 조심해야 하지" 하는 함정까지 포함""")

    post_text = gemini(prompt, system=GIT_PROMPT)
    post_title = f"{topic}: {desc}"
    post_slug = slugify(topic)
    date_str = NOW.strftime("%Y-%m-%d")

    return build_post(post_title, post_slug, post_text, date_str, ["Git", "개발팁"], f"{topic} 사용법과 활용 팁", source_name="Git")

def build_post(title, slug, body, date_str, tags, excerpt, source_name=None):
    image_dir = IMAGES_DIR
    image_dir.mkdir(exist_ok=True)
    image_path = image_dir / f"{date_str}-{slug}.svg"
    image_url = f"{SITE_BASE}/images/{date_str}-{slug}.svg"

    svg = make_svg(title, date_str, " | ".join(tags))
    with open(image_path, "w", encoding="utf-8") as f:
        f.write(svg)

    body = body.strip()
    if body.startswith('"') and body.endswith('"'):
        body = body[1:-1]

    content_words = len(body.split())
    reading_time = max(1, round(content_words / 350))

    front = f"""---
layout: post
reading_time: {reading_time}
title: "{title}"
date: {NOW.strftime("%Y-%m-%d %H:%M:%S")} +0900
tags: [{', '.join(tags)}]
image: "{image_url}"
excerpt: "{excerpt[:160]}"
source: "{source_name or 'Dev & AI Digest'}"
---
"""
    post_path = POSTS_DIR / f"{date_str}-{slug}.md"
    with open(post_path, "w", encoding="utf-8") as f:
        f.write(front + "\n" + body)

    print(f"Wrote: {post_path}")
    return post_path

def main():
    progress = pick_progress()
    day = progress.get("day", 0)

    is_git_day = day % 3 == 2

    try:
        if is_git_day:
            generate_git_post(progress)
        else:
            generate_news_post(progress)
    except Exception as e:
        print(f"News generation failed ({e}), falling back to git post")
        generate_git_post(progress)

    progress["day"] = day + 1
    save_progress(progress)
    print("Done")

if __name__ == "__main__":
    main()
