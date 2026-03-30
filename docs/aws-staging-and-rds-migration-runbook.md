# AWS Staging + Supabase -> RDS Migration Runbook

이 문서는 이번 단계에서 바로 실행할 두 가지를 한 문서로 묶은 런북입니다.

- EC2 스테이징 환경 띄우기
- Supabase PostgreSQL 데이터를 RDS로 이전하고 검증하기

## 1. 스테이징 환경 준비

### 1-1. AWS 리소스

- EC2 인스턴스 1대
- RDS PostgreSQL 1개
- S3 버킷 1개
- CloudFront 배포 1개

권장:

- 리전: `ap-northeast-2`
- RDS는 public access 비활성화
- EC2만 80/443 공개, DB는 EC2 보안그룹에서만 접근 허용

### 1-2. 스테이징 환경변수

1. [/.env.staging.example](/Users/jaehkim/Documents/GitHub/jaehkim-research-site/.env.staging.example)을 복사해 `.env.staging` 생성
2. 실제 스테이징 도메인, RDS, S3, Resend 값으로 치환
3. 관리자 비밀번호 해시는 아래로 생성

```bash
npx ts-node scripts/hash-password.ts YOUR_STAGING_PASSWORD
```

### 1-3. 스테이징 앱 실행

EC2에서 리포지토리를 받은 뒤:

```bash
docker compose -f docker-compose.staging.yml build
docker compose -f docker-compose.staging.yml up -d
docker compose -f docker-compose.staging.yml logs -f web
```

### 1-4. 스테이징 스모크 체크

- `/`
- `/research`
- `/research/[slug]`
- `/knowledge-base`
- `/book-notes`
- `/contact`
- `/admin/login`
- 이미지 업로드
- OTP 메일

## 2. Supabase -> RDS 이전 절차

### 2-1. 사전 준비

- Supabase source DB 접속 문자열 확보
- RDS target DB 생성 완료
- `pg_dump`, `pg_restore` 클라이언트 설치 확인
- 가능하면 이전 직전 쓰기 기능 일시 중단

### 2-2. 소스 DB 요약 확인

소스 또는 타겟 DB 상태를 빠르게 보려면:

```bash
MIGRATION_DATABASE_URL="postgresql://..." npm run db:summary
```

### 2-3. Supabase 덤프 생성

```bash
export SOURCE_DATABASE_URL="postgresql://..."
pg_dump \
  --format=custom \
  --no-owner \
  --no-acl \
  --file=supabase.dump \
  "$SOURCE_DATABASE_URL"
```

### 2-4. RDS에 복원

타겟 DB가 비어 있다고 가정하고 복원:

```bash
export TARGET_DATABASE_URL="postgresql://..."
pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  --dbname="$TARGET_DATABASE_URL" \
  supabase.dump
```

주의:

- 운영 cutover 전에는 staging RDS에서 먼저 리허설
- 이미 데이터가 있는 DB에 복원할 때는 `--clean` 사용 범위를 신중히 확인

### 2-5. 데이터 비교 검증

복원 후 아래 비교 스크립트를 실행:

```bash
SOURCE_DATABASE_URL="postgresql://..." \
TARGET_DATABASE_URL="postgresql://..." \
npm run db:compare
```

이 스크립트는 다음을 비교합니다.

- `Post`, `Series`, `Comment`, `PostLike`, `OtpCode`, `ContactInquiry` row count
- published/draft post count
- top-level/reply comment count
- post slug 목록
- series slug 목록
- series 별 post 개수

## 3. Cutover 전 최종 체크

- 스테이징 앱이 RDS를 읽고 정상 렌더링하는지
- `STORAGE_PROVIDER=s3` 에서 업로드 URL이 열리는지
- 관리자 CRUD 후 revalidate가 정상 동작하는지
- OTP 메일/문의 메일이 정상 발송되는지
- `npm run db:compare` 가 성공하는지

## 4. 이번 단계의 종료 기준

- EC2 스테이징 환경이 정상 기동됨
- staging RDS에 restore 리허설을 1회 완료함
- source/target 데이터 비교 스크립트가 통과함

이 단계가 끝나면 그다음은 production cutover 순서와 DNS 전환입니다.
