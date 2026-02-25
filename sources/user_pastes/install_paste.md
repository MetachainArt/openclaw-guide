# OpenClaw 설치 가이드 참고 자료 (원문)

> 출처: 공식 문서 및 블로그
> 수집일: 2026-02-25

## 공식 문서

### 설치 문서
- https://docs.openclaw.ai/install
- https://docs.openclaw.ai/start/getting-started
- https://github.com/openclaw/openclaw/blob/main/docs/start/getting-started.md

### 웹 가이드
- https://dev.to/primaryobjects/a-beginner-friendly-guide-to-running-openclaw-for-free-6he
- https://dev.to/yankoaleksandrov/openclaw-setup-guide-from-zero-to-ai-assistant-in-10-minutes-1md
- https://blog.promptlayer.com/how-to-install-openclaw-step-by-step-guide-formerly-clawdbot-moltbot/
- https://blog.laozhang.ai/en/posts/openclaw-installation-deployment-guide

### 유튜브 튜토리얼
- https://www.youtube.com/watch?v=P6XWQ_CcAt0
- https://www.youtube.com/watch?v=n1sfrc-RjyM
- https://www.youtube.com/watch?v=_kZCoW-Qxnc

## 시스템 요구사항 (공식)

- Node.js 22+
- macOS, Linux, 또는 Windows
- Windows에서는 WSL2 사용 권장
- pnpm (소스에서 빌드하는 경우)

## 설치 방법

### 권장: 인스톨러 스크립트

**macOS / Linux / WSL2:**
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### npm/pnpm 설치

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

또는 pnpm 사용:
```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

### 소스에서 빌드

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
pnpm link --global
openclaw onboard --install-daemon
```

## 온보딩 및 설정

```bash
openclaw onboard --install-daemon  # 초기 설정 마법사
openclaw doctor                    # 설정 확인
openclaw status                    # 게이트웨이 상태 확인
openclaw dashboard                 # 브라우저 UI 열기
```

## 환경 변수

- `OPENCLAW_HOME`: 내부 경로 해상을 위한 홈 디렉토리
- `OPENCLAW_STATE_DIR`: 상태 디렉토리 재정의
- `OPENCLAW_CONFIG_PATH`: 설정 파일 경로 재정의

## 설치 후 확인

```bash
openclaw doctor         # 설정 문제 확인
openclaw status         # 게이트웨이 상태
openclaw dashboard      # 대시보드 열기
```

## 기타 설치 방법

- Docker / Podman
- Nix
- Ansible
- Bun

## Windows 특별 권장사항

공식 문서: "On Windows, we strongly recommend running OpenClaw under WSL2"
