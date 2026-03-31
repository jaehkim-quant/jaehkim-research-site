# GitHub Actions Self-Hosted Runner Setup

이 문서는 staging 배포를 `EC2 내부 self-hosted runner`로 전환하는 절차를 정리합니다.

현재 배포 워크플로는 GitHub-hosted runner가 SSH로 EC2에 접근하는 대신, EC2 안에서 직접 실행됩니다.

## 1. 왜 이 방식을 쓰는가

- GitHub-hosted runner에서 EC2의 `22` 포트를 열 필요가 없습니다.
- `rsync + ssh`용 GitHub secrets를 유지하지 않아도 됩니다.
- staging 서버 안에서 checkout -> sync -> docker deploy가 바로 실행됩니다.

## 2. GitHub에서 runner 만들기

GitHub 저장소에서:

1. `Settings`
2. `Actions`
3. `Runners`
4. `New self-hosted runner`
5. OS: `Linux`
6. Architecture: `x64`

이후 GitHub가 보여주는 `Download`, `Configure`, `Run` 명령을 사용합니다.

공식 문서:

- [Adding self-hosted runners](https://docs.github.com/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners)
- [About self-hosted runners](https://docs.github.com/actions/hosting-your-own-runners/about-self-hosted-runners)

## 3. EC2에서 설치

EC2에 접속한 뒤, GitHub UI가 보여주는 명령을 그대로 실행합니다.

예시 흐름:

```bash
mkdir -p ~/actions-runner && cd ~/actions-runner
# GitHub UI가 제공하는 tar.gz 다운로드/압축해제 명령 실행
# GitHub UI가 제공하는 config.sh 명령 실행
```

`config.sh` 실행 시 권장값:

- runner name: `staging-ec2`
- labels: `staging`
- work folder: `_work`

## 4. 서비스로 등록

GitHub UI가 보여주는 마지막 단계에서 서비스 설치를 진행합니다.

권장:

```bash
sudo ./svc.sh install ubuntu
sudo ./svc.sh start
```

설치 후 확인:

```bash
sudo ./svc.sh status
```

## 5. 서버 요구사항

배포 워크플로가 정상 동작하려면 EC2에 아래가 이미 있어야 합니다.

- Docker
- Docker Compose plugin
- rsync
- `/home/ubuntu/apps/jaehkim-research-site`
- `/home/ubuntu/apps/jaehkim-research-site/.env.staging`

## 6. 현재 워크플로 동작 방식

`Deploy Staging` 워크플로는 다음 순서로 실행됩니다.

1. self-hosted runner에서 저장소 checkout
2. `/home/ubuntu/apps/jaehkim-research-site` 로 로컬 rsync
3. `scripts/deploy-staging.sh` 실행
4. Docker image rebuild + container recreate

## 7. 더 이상 필요하지 않은 것

이 구조에서는 아래 GitHub Actions secrets가 필수는 아닙니다.

- `STAGING_HOST`
- `STAGING_PORT`
- `STAGING_USER`
- `STAGING_SSH_KEY`
- `STAGING_PATH`

남겨둬도 문제는 없지만, self-hosted runner 전환 후에는 배포에 직접 사용되지 않습니다.
