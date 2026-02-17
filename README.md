# 재킴 리서치 | Quant Research & Family Office CEO 브랜딩 사이트

개인 퀀트 리서치 & 패밀리오피스 CEO 브랜딩을 위한 Next.js 기반 웹사이트입니다.

## 목표

- 전문성과 신뢰 기반 구독 전환, 협업/자문 리드 확보
- 재현성(방법론 공개), 검증(OOS/워크포워드), 리스크 중심(MDD/턴오버) 원칙

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Pretendard / Inter 폰트

## 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | Home - Hero, Featured Research, 검증 원칙, Latest Posts, Newsletter |
| `/research` | Research Library - 필터/검색/카드 |
| `/research/[slug]` | 리서치 상세 (Summary / Deep Dive) |
| `/categories` | Categories/Tags - 태그별 탐색 |
| `/evidence` | Evidence & Validation - 백테스트 원칙, 검증 체계 |
| `/about` | About - 소개, Ethics/Disclaimer |
| `/contact` | Contact - 문의 폼 |

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버는 http://localhost:3000 에서 실행됩니다.

## 데이터

- `lib/research/data/posts.mock.ts` - 리서치 포스트 더미 데이터
- `lib/research/data/cases.mock.ts` - 케이스 스터디 더미 데이터
- `lib/research/data/tools.mock.ts` - 템플릿/체크리스트 더미 데이터

CMS 연동 시 `lib/research/queries.ts` 및 API 라우트로 확장 가능합니다.

## 디자인 가이드

- **색상**: 딥 네이비 (#0B1220), 액센트 블루 (#3B82F6)
- **폰트**: Pretendard (한글), Inter (영문)
- **다크/라이트 모드** 지원
