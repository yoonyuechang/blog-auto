interface WelcomeEmailOptions {
  email: string;
  siteUrl?: string;
}

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  source: string;
  url: string;
}

interface DigestEmailOptions {
  email: string;
  articles: Article[];
  weekLabel: string;
  siteUrl?: string;
}

const baseStyles = `
  body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .container { max-width: 600px; margin: 0 auto; background-color: #111111; }
  .header { background-color: #0d1f17; padding: 32px 24px; text-align: center; }
  .logo { color: #10b981; font-size: 24px; font-weight: 800; margin: 0; }
  .subtitle { color: #9ca3af; font-size: 14px; margin: 8px 0 0; }
  .content { padding: 32px 24px; color: #e5e7eb; }
  .footer { padding: 24px; text-align: center; border-top: 1px solid #1f2937; }
  .footer a { color: #6b7280; font-size: 12px; text-decoration: none; }
  .btn { display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
  .article-card { background-color: #1a1a1a; border: 1px solid #1f2937; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
  .article-category { display: inline-block; background-color: #10b98120; color: #10b981; padding: 2px 10px; border-radius: 12px; font-size: 12px; margin-bottom: 8px; }
  .article-title { color: #f3f4f6; font-size: 16px; font-weight: 600; margin: 0 0 8px; }
  .article-summary { color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 0 0 12px; }
  .article-meta { color: #6b7280; font-size: 12px; }
`;

export function renderWelcomeEmail({ email, siteUrl = "https://devpulse.dev" }: WelcomeEmailOptions): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>DevPulse에 오신 것을 환영합니다</title><style>${baseStyles}</style></head>
<body>
<div class="container">
  <div class="header">
    <p class="logo">DevPulse</p>
    <p class="subtitle">개발 트렌드를 한눈에</p>
  </div>
  <div class="content">
    <h1 style="color:#f3f4f6;font-size:22px;margin:0 0 16px;">DevPulse에 오신 것을 환영합니다!</h1>
    <p style="color:#d1d5db;line-height:1.7;margin:0 0 16px;">
      안녕하세요! DevPulse 뉴스레터에 구독해 주셔서 감사합니다.
    </p>
    <p style="color:#d1d5db;line-height:1.7;margin:0 0 24px;">
      매주 AI/ML, 프론트엔드, 백엔드, DevOps 등 최신 개발 트렌드를 엄선하여 전달해 드립니다.
      귀찮게 구독 취소는 언제든 가능합니다.
    </p>
    <p style="text-align:center;margin:0 0 24px;">
      <a href="${siteUrl}" class="btn">지금 바로 둘러보기</a>
    </p>
    <div style="background-color:#1a1a1a;border:1px solid #1f2937;border-radius:8px;padding:20px;margin-top:8px;">
      <p style="color:#9ca3af;font-size:13px;margin:0;line-height:1.6;">
        <strong style="color:#10b981;">구독자 전용 혜택:</strong><br>
        · 주간 요약 뉴스레터 (매주 월요일)<br>
        · 엄선된 아티클 큐레이션<br>
        · AI 기반 핵심 요약
      </p>
    </div>
  </div>
  <div class="footer">
    <a href="${siteUrl}">DevPulse</a><br>
    <a href="${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}">구독 취소</a>
  </div>
</div>
</body>
</html>`;
}

export function renderDigestEmail({ articles, weekLabel, siteUrl = "https://devpulse.dev" }: DigestEmailOptions): string {
  const articleCards = articles
    .map(
      (a) => `
    <div class="article-card">
      <span class="article-category">${a.category}</span>
      <h3 class="article-title">${a.title}</h3>
      <p class="article-summary">${a.summary}</p>
      <div class="article-meta">${a.source}</div>
    </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>DevPulse 주간 다이제스트</title><style>${baseStyles}</style></head>
<body>
<div class="container">
  <div class="header">
    <p class="logo">DevPulse</p>
    <p class="subtitle">이번 주 개발 트렌드 요약</p>
  </div>
  <div class="content">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <h2 style="color:#f3f4f6;font-size:18px;margin:0;">${weekLabel}</h2>
      <span style="color:#6b7280;font-size:13px;">${articles.length}개 아티클</span>
    </div>
    ${articleCards || '<p style="color:#6b7280;text-align:center;padding:40px 0;">이번 주 엄선된 아티클이 없습니다.</p>'}
    <p style="text-align:center;margin:24px 0 0;">
      <a href="${siteUrl}" class="btn">전체 아티클 보기</a>
    </p>
  </div>
  <div class="footer">
    <a href="${siteUrl}">DevPulse</a>
  </div>
</div>
</body>
</html>`;
}
