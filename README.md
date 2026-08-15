# SoloStack

1인기업가를 위한 올인원 작업 허브

## 주요 기능

- **콘텐츠 워터폴**: 원본 대본 하나 → 블로그 SEO 글 / 카드뉴스 / 숏폼 대본 동시 생성
- 전사 대시보드
- 마케팅팀 (메타광고, 구글애드, 이미지 소재, UTM)
- CRM팀 (전화상담 코파일럿, 상담고객 DB)
- 기타 팀별 작업 공간

## 기술 스택

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Lucide Icons

## 로컬 실행

```bash
pnpm install
pnpm dev
```

브라우저에서 http://localhost:3000 접속

## 배포

Vercel 추천

```bash
npx vercel
```

## 현재 상태 (MVP)

- [x] 다크모드 레이아웃 (사이드바 + 상단바)
- [x] 메뉴 구조
- [x] 콘텐츠 워터폴 (상세 로직 + 시뮬레이션)
- [ ] 실제 AI 연동 (OpenAI / Claude)
- [ ] 마케팅 / CRM 기능
- [ ] 사용자 인증
