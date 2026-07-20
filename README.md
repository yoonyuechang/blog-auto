# smartmoneyteam 블로그 자동화

매일 AI가 IT/재테크 글을 생성해서 티스토리에 자동 발행합니다.

## 셋업 방법 (10분)

### 1. GitHub 업로드
- 이 폴더의 모든 파일을 `https://github.com/yoonyuechang/blog-auto` 에 업로드 (기존 파일 다 지우고)

### 2. GitHub Secrets 등록 (Settings → Secrets and variables → Actions → New repository secret)

| Secret | 값 |
|--------|-----|
| `GEMINI_API_KEY` | 위에서 받은 키 |
| `TISTORY_BLOG` | `smartmoneyteam` |
| `TISTORY_COOKIE` | 아래 참고 |

### 3. TISTORY_COOKIE 얻는 법
1. 크롬/엣지로 `smartmoneyteam.tistory.com/manage` 에 로그인
2. F12 (개발자도구) → Network 탭
3. 페이지 새로고침
4. 요청 목록 중 아무거나 클릭 → Request Headers 에서 `Cookie:` 값 복사 (전부)
5. 그 값을 TISTORY_COOKIE secret에 저장

### 4. 첫 실행
- GitHub → Actions → Daily Blog Post → Run workflow

이후 매일 09:00 KST에 자동 실행됩니다.
