# Dev & AI Digest

매일 자동으로 작성/발행되는 기술 블로그입니다.

## 구조

- HackerNews 인기 글을 요약/분석 (2일에 1회)
- Git 실전 팁 소개 (3일에 1회)
- SVG 히어로 이미지 자동 생성
- GitHub Pages로 자동 배포

## 셋업 (3분)

1. 이 저장소를 GitHub에 생성 (public)
2. Google AI Studio에서 Gemini API 키 발급 (무료): https://aistudio.google.com/apikey
3. GitHub 저장소 → Settings → Secrets and variables → Actions → `GEMINI_API_KEY` 추가
4. GitHub 저장소 → Settings → Pages → Source: **GitHub Actions**
5. Actions 탭 → Daily Blog Post → **Run workflow** (첫 수동 실행)
6. 이후 매일 09:00 KST에 자동 실행됨

## 커스터마이징

- `scripts/topics.txt` 대신 `scripts/generate_post.py` 안의 `GIT_TOPICS` 수정
- `_config.yml`에서 블로그 이름/설명 변경
- `style.css`에서 디자인 변경
