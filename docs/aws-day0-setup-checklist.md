# AWS Day-0 Setup Checklist (개인/소규모 서비스 기준)

이 체크리스트는 AWS를 처음 시작할 때 반드시 먼저 해두는 항목들입니다.

## 0) 계정 보안 (루트 계정)

- [ ] 루트 계정 로그인 후 MFA 활성화 (필수)
- [ ] 루트 계정 비밀번호를 강력하게 설정/보관
- [ ] 루트 계정은 결제/계정 설정 외에는 사용하지 않기로 원칙 정함

## 1) IAM 초기 사용자/권한

- [ ] 일상 작업용 IAM 사용자 생성 (또는 IAM Identity Center 사용)
- [ ] 관리자 권한은 초기에만 최소 인원에게 부여
- [ ] 액세스 키는 필요한 경우에만 생성 (로컬/CI 용도)
- [ ] 액세스 키 저장 위치/회전 규칙 정리

권장 메모:

- 로컬 개발에서는 필요 시 단기적으로 액세스 키를 쓰되, 장기적으로는 역할(Role) 기반 접근으로 이동

## 2) 비용 가시성/알람 (가장 먼저)

- [ ] `Cost Explorer` 활성화
- [ ] `AWS Budgets` 월 예산 생성 (예: 10 USD, 20 USD, 50 USD)
- [ ] 예산 초과 알림 이메일 수신 확인
- [ ] Billing 알림 수신 이메일 주소 정리

권장 시작값(예시):

- Budget #1: 10 USD (실험 초과 감지)
- Budget #2: 25 USD (주의)
- Budget #3: 50 USD (강한 경고)

## 3) 리전 기본값 결정

- [ ] 주 사용자 기반 리전 후보 정리 (`ap-northeast-2` / `us-east-1` / `us-west-2`)
- [ ] 초기 실험 리전 1개를 먼저 고정 (멀티리전 금지)
- [ ] 선택 이유 기록 (지연시간/비용/서비스 가용성)

프로젝트 기준 권장:

- 한국 사용자 중심이면 `ap-northeast-2 (Seoul)` 우선 검토

## 4) 태깅 정책 (초기부터)

- [ ] 공통 태그 키 결정 (`Project`, `Env`, `Owner`, `CostCenter`)
- [ ] 리소스 생성 시 태그 붙이기 습관화

예시:

- `Project=jaehkim-research`
- `Env=dev|staging|prod`
- `Owner=jaehkim`

## 5) 보안 기본 원칙 (실수 방지)

- [ ] S3 버킷 public 설정 남발 금지
- [ ] RDS public access 기본 금지
- [ ] IAM 정책에 `*:*` 광범위 허용 금지 (테스트 후 줄이기)
- [ ] Secrets는 코드/.env 커밋 금지

## 6) 첫 번째 도입 범위 확정 (이 프로젝트 기준)

- [x] 1차 대상은 `S3 (업로드 저장소)`로 정함
- [ ] S3 버킷 이름 결정
- [ ] CloudFront 도입 여부 결정 (권장: 도입)
- [ ] 스테이징 테스트 환경에서만 먼저 적용

## 7) 다음 구현 준비 (리포지토리 반영 상태)

이미 준비된 코드:

- `STORAGE_PROVIDER` / `EMAIL_PROVIDER` provider 추상화 도입 완료
- `s3` 업로드 구현 완료
- `next.config.js` standalone 출력 설정 완료
- `Dockerfile` 추가 완료

다음 구현 작업:

- [ ] S3/CloudFront 환경변수 설정
- [ ] EC2에 Docker 설치 및 앱 기동
- [ ] RDS 연결 정보 설정
- [ ] 스테이징에서 `STORAGE_PROVIDER=s3` 테스트
