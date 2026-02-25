---
title: Linux 설치
description: Linux에서 OpenClaw를 설치하는 방법
---

> ⏱️ **예상 소요시간**: 20-30분  
> 🎯 **목표**: Linux에 OpenClaw 설치 및 실행

## 지원 배포판

- Ubuntu 20.04 LTS 이상 ⭐ 권장
- Debian 11+
- Fedora 38+
- Arch Linux
- CentOS/RHEL 8+

---

## Ubuntu/Debian 설치

### 1단계: 시스템 업데이트

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

### 2단계: 필수 패키지 설치

```bash
sudo apt-get install -y \
  curl \
  git \
  build-essential \
  python3 \
  python3-pip \
  pkg-config
```

### 3단계: Node.js 설치

```bash
# NodeSource 저장소
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 확인
node --version  # v22.x.x
```

### 4단계: OpenClaw 설치

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

또는:
```bash
npm install -g openclaw@latest
```

---

## Fedora 설치

```bash
# 시스템 업데이트
sudo dnf update -y

# 필수 패키지
sudo dnf install -y curl git gcc-c++ make python3

# Node.js
sudo dnf install -y nodejs22

# OpenClaw
npm install -g openclaw@latest
```

---

## Arch Linux 설치

```bash
# 시스템 업데이트
sudo pacman -Syu

# 필수 패키지
sudo pacman -S curl git base-devel python3 nodejs npm

# OpenClaw
npm install -g openclaw@latest
```

---

## 시스템 서비스 설정

### systemd 서비스 생성

```bash
# 사용자 서비스 디렉토리 생성
mkdir -p ~/.config/systemd/user

# 서비스 파일 생성
cat > ~/.config/systemd/user/openclaw.service << 'EOF'
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
ExecStart=%h/.npm-global/bin/openclaw gateway
Restart=always
RestartSec=10
Environment="NODE_ENV=production"

[Install]
WantedBy=default.target
EOF

# 서비스 활성화
systemctl --user daemon-reload
systemctl --user enable openclaw
systemctl --user start openclaw

# 자동 시작 확인
systemctl --user status openclaw
```

### 로그 확인

```bash
journalctl --user -u openclaw -f
```

---

## 방화벽 설정

### UFW (Ubuntu)

```bash
# 게이트웨이 포트 열기
sudo ufw allow 18789/tcp

# (선택) 외부 접근 제한
sudo ufw allow from 192.168.1.0/24 to any port 18789
```

### firewalld (Fedora/RHEL)

```bash
sudo firewall-cmd --permanent --add-port=18789/tcp
sudo firewall-cmd --reload
```

---

## 서버/헤드리스 설치

GUI 없는 서버에 설치하는 경우:

```bash
# 비대화형 설치
export OPENCLAW_NONINTERACTIVE=1
curl -fsSL https://openclaw.ai/install.sh | bash

# 수동 설정
openclaw onboard --no-browser
```

### 설정 파일 직접 작성

`~/.openclaw/openclaw.json`:
```json
{
  "gateway": {
    "port": 18789,
    "auth": {
      "mode": "token",
      "token": "your-secure-token-here"
    }
  },
  "models": {
    "default": {
      "provider": "anthropic",
      "apiKey": "sk-ant-..."
    }
  }
}
```

---

## Docker 대안

Linux 서버에서는 Docker 설치를 권장합니다:

```bash
# Docker 설치
sudo apt-get install -y docker.io docker-compose

# OpenClaw 컨테이너 실행
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v ~/.openclaw:/data \
  openclaw/openclaw:latest
```

자세한 내용은 [Docker 설치 가이드](/install/docker) 참고

---

## 흔한 문제

### 문제: Permission denied

**해결책**:
```bash
# npm 전역 디렉토리 변경
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 문제: 포트 충돌

**해결책**:
```bash
# 사용 중인 프로세스 확인
sudo lsof -i :18789
sudo ss -tlnp | grep 18789

# 다른 포트 사용
openclaw gateway --port 18790
```

### 문제: 메모리 부족

**해결책**:
- 스왑 공간 추가
- 가벼운 모델 사용 (Groq 등)
- 로컬 모델 대신 API 사용

---

## 다음 단계

- [Docker 설치](/install/docker)
- [서버 운영 가이드](/operations/workspace)
- [보안 가이드](/security/warnings)
