# AWS EC2 + RDS + S3 배포 가이드

이 문서는 현재 프로젝트를 `EC2 + RDS + S3` 조합으로 운영할 때 필요한 최소 배포 절차를 정리한 가이드입니다. 이번 단계의 목표는 구조를 최대한 덜 바꾸고 Vercel/Supabase 의존을 줄이는 것입니다.

## 목표 아키텍처

- 애플리케이션: EC2에서 Next.js standalone 서버 실행
- 데이터베이스: RDS PostgreSQL
- 업로드 저장소: S3
- 메일: 1차는 Resend 유지, 2차에 SES 검토

## 리포지토리에서 반영된 준비 상태

- `next.config.js` 에 `output: "standalone"` 추가
- `Dockerfile` 추가
- `lib/storage/provider.ts` 에 S3 업로드 구현 추가
- `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL` 기반 사이트 URL 해석을 공통화
- 홈/리서치/시리즈/사이트맵을 runtime 렌더링으로 전환해 `next build` 시점 DB 의존 제거
- `.env.example` 을 EC2/RDS/S3 기준으로 정리

## 권장 배포 순서

1. RDS PostgreSQL 생성
2. S3 버킷 및 CloudFront 준비
3. EC2에 Docker 설치
4. `.env` 를 AWS 값으로 구성
5. 앱 이미지 빌드 및 실행
6. 도메인, TLS, reverse proxy 연결
7. 스모크 테스트와 데이터 검증

## 필수 환경변수

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_EMAIL`
- `STORAGE_PROVIDER=s3`
- `AWS_REGION`
- `S3_BUCKET_NAME`
- `CLOUDFRONT_URL` 또는 `S3_PUBLIC_BASE_URL`
- `RESEND_API_KEY`
- `EMAIL_PROVIDER=auto`

## S3 운영 규칙

- 업로드 키는 `uploads/yyyy/mm/<random>.<ext>` 형식으로 저장
- 반환 URL은 `CLOUDFRONT_URL` 이 있으면 이를 우선 사용
- `CLOUDFRONT_URL` 이 없으면 `S3_PUBLIC_BASE_URL`
- 둘 다 없으면 `https://<bucket>.s3.<region>.amazonaws.com/<key>` 형식으로 반환

## EC2 실행 예시

```bash
docker build -t jaehkim-research:latest .
docker run --name jaehkim-research \
  --env-file .env \
  -p 3000:3000 \
  --restart unless-stopped \
  jaehkim-research:latest
```

## Cutover 체크리스트

- `/`, `/research`, `/research/[slug]` 정상 렌더링
- `/knowledge-base`, `/book-notes`, `/contact` 정상 동작
- `/admin/login` 과 OTP 로그인 정상 동작
- 글/시리즈 생성과 수정 후 revalidate 반영 확인
- 이미지 업로드 후 S3/CloudFront URL 접근 확인
- 문의 메일과 OTP 메일 발송 확인

## 이번 단계에서 하지 않는 것

- GitHub 파일 기반 콘텐츠 저장 전환
- SES 메일 전환
- 댓글/좋아요/문의/OTP의 DB 제거

GitHub 기반 콘텐츠는 현재 Prisma 중심 관리자 CMS와 결합도가 높아서, AWS 안정화 이후 별도 리팩터링 과제로 분리하는 것이 안전합니다.
