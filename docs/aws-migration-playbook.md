# AWS Migration Playbook (Vercel + Supabase -> AWS Hybrid)

이 문서는 현재 프로젝트(`Next.js + Prisma + PostgreSQL`)를 기준으로 AWS 전환을 단계적으로 진행할 때의 운영 체크리스트입니다.

## 현재 코드에 반영된 준비 작업

- 업로드 Provider 추상화 추가: `/Users/jaehkim/Documents/GitHub/jaehkim-research-site/lib/storage/provider.ts`
- 이메일 Provider 추상화 추가: `/Users/jaehkim/Documents/GitHub/jaehkim-research-site/lib/email/provider.ts`
- 업로드 라우트가 Provider 사용: `/Users/jaehkim/Documents/GitHub/jaehkim-research-site/app/api/upload/route.ts`
- 문의/OTP 메일 라우트가 Provider 사용: `/Users/jaehkim/Documents/GitHub/jaehkim-research-site/app/api/contact/route.ts`, `/Users/jaehkim/Documents/GitHub/jaehkim-research-site/app/api/auth/request-otp/route.ts`

주의:
- `STORAGE_PROVIDER=s3`, `EMAIL_PROVIDER=ses`는 선택 가능하지만 현재는 명시적으로 에러를 내도록 되어 있습니다.
- 즉, 라우트 구조는 AWS 전환 준비가 되었고, 실제 S3/SES 구현은 다음 단계입니다.

## Phase 0 - 기준선 측정 (필수)

기록 항목:

- Vercel 월 비용 (호스팅, bandwidth, function usage)
- Supabase 월 비용 (DB tier, storage, egress)
- Resend 월 비용 (발송량)
- Vercel Blob 사용량 (저장 용량, egress)
- DB 크기 (총 용량, 테이블별 크기)
- 월 업로드 건수 / 평균 파일 크기 / 월 총 업로드 용량
- 월 페이지뷰 / API 요청 수

산출물(권장):

- `월 비용 비교표 (현재 vs AWS 예상)`
- `전환 우선순위 (Storage -> DB -> Email -> Hosting)`

## Phase 1 - 스토리지 전환 (Vercel Blob -> S3)

목표:

- 업로드 API 경로는 유지하고, 저장소만 교체 가능한 구조로 전환

현재 상태:

- 코드 구조는 준비됨 (`uploadPublicFile`)
- 실제 S3 업로드 구현은 미완료

구현해야 할 작업 (다음 단계):

1. `lib/storage/provider.ts`에 S3 업로드 구현 추가
2. 필요한 환경변수 연결
3. CloudFront 배포 경로 확정 (`S3_PUBLIC_BASE_URL` 또는 `CLOUDFRONT_URL`)
4. 운영 환경에서 `STORAGE_PROVIDER=s3`로 전환

S3 설계 권장값:

- 버킷 공개보다는 `CloudFront`를 공개 엔드포인트로 사용
- 업로드 키 규칙: `uploads/yyyy/mm/<random>.<ext>`
- MIME 타입 저장
- 버킷 수명주기 정책은 나중에 추가 (초기에는 단순 유지)

검증 체크리스트:

- JPEG/PNG/GIF/WebP 업로드 성공
- 4MB 초과 파일 차단 유지
- 반환 URL 접근 가능
- 실패 시 로그 확인 가능
- 캐시 반영 정책(파일명 랜덤 기반이면 캐시 무효화 부담 낮음)

## Phase 2 - DB 전환 (Supabase Postgres -> RDS PostgreSQL)

목표:

- Prisma 연결 문자열만 변경해도 앱이 정상 동작하도록 DB 호환성 유지

사전 준비:

- RDS PostgreSQL 인스턴스 생성 (초기엔 싱글 AZ도 가능)
- 보안그룹 설정 (DB는 private 권장)
- 백업/스냅샷 정책 설정
- 연결 전략 검토 (Vercel 서버리스 + RDS 연결 수 관리)

이전 절차 (소규모 서비스 기준 권장):

1. 공지 후 쓰기 기능 임시 중단 (댓글/문의/관리자 작성)
2. Supabase DB 덤프 생성
3. RDS로 복원
4. row count / 핵심 제약조건 검증
5. `DATABASE_URL`, `DIRECT_URL` 교체
6. 애플리케이션 스모크 테스트
7. 문제 시 기존 Supabase 연결로 롤백

핵심 주의사항:

- 현재 `.env.example`의 `DATABASE_URL`은 `pgbouncer=true` 예시가 포함되어 있음
- RDS로 전환 시 `pgbouncer` 전제는 제거하고 연결 풀 전략 재설계 필요
- 고동시성 시 `RDS Proxy` 검토

검증 포인트:

- `Post`, `Series`, `Comment`, `OtpCode`, `ContactInquiry` row count 일치
- Prisma 읽기/쓰기 정상
- 고유키/외래키 정상
- OTP/문의/댓글/좋아요 회귀 확인

## Phase 3 - 메일 전환 (Resend -> SES, 선택)

현재 상태:

- 메일 라우트는 `sendEmail()` Provider 추상화 사용
- `EMAIL_PROVIDER=ses` 설정 시 현재는 에러 처리(미구현)

전환 조건:

- 발송량 증가로 비용 절감 필요
- AWS 통합 운영 필요

사전 준비:

- SES 도메인 인증(SPF/DKIM)
- 샌드박스 해제 요청
- 발신자 주소 정책 정리 (`EMAIL_FROM`)

권장 전환 순서:

1. OTP가 아닌 문의 알림부터 SES로 검증
2. 딜리버러빌리티 확인
3. OTP 메일 전환

## Phase 4 - 앱 호스팅 전환 (필요 시)

권장 순서:

1. Vercel 유지 (현행)
2. 비용/운영 필요 발생 시 App Runner 또는 ECS Fargate 검토
3. 장기적으로 ECS Fargate + ALB + CloudFront 표준화

## 운영 필수 설정 (AWS 시작 시 바로)

- AWS Budgets 비용 알람
- Cost Explorer 태그 기준 정리
- CloudWatch 로그 보관 기간 설정
- IAM 최소 권한
- 루트 계정 MFA

## 환경변수 가이드 (현재 코드 기준)

기존 유지:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ADMIN_*`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `BLOB_READ_WRITE_TOKEN`

추가(도입됨):

- `STORAGE_PROVIDER`
- `EMAIL_PROVIDER`
- `EMAIL_FROM`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (초기/로컬용)
- `S3_BUCKET_NAME`
- `S3_PUBLIC_BASE_URL`
- `CLOUDFRONT_URL`

## 다음 구현 후보 (기술 부채/확장 포인트)

- S3 실제 업로드 구현 (AWS SDK 또는 SigV4 직접 구현)
- SES 실제 발송 구현
- Email failure를 비동기화(SQS)하여 문의 API 성공/실패 분리
- DB cutover 검증 스크립트 추가 (row count 자동 비교)
