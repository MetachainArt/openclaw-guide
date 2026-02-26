---
title: 문제 해결
description: OpenClaw 설치 및 실행 시 흔한 문제와 해결책
---

>  흔한 문제들과 해결 방법

## 설치 문제

### 'openclaw' 명령어를 찾을 수 없음

원인: npm 전역 경로가 PATH에 없음

해결책:
```bash
# PATH 확인
echo $PATH

# npm 전역 경로 확인
npm prefix -g

# PATH에 추가 (임시)
export PATH="$(npm prefix -g)/bin:$PATH"

# 영구 적용 (bash)
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Node.js 버전 오류

원인: Node.js 22+ 필요

해결책:
```bash
# 버전 확인
node --version

# 22 미만이면 업데이트
# nvm 사용 시
nvm install 22
nvm use 22
```

## 실행 문제

### 포트 충돌

에러: `EADDRINUSE: address already in use :::18789`

해결책:
```bash
# 사용 중인 프로세스 확인
lsof -i :18789

# 다른 포트 사용
openclaw gateway --port 18790
```

### 설정 파일 오류

해결책:
```bash
# 설정 검증
openclaw config validate

# 백업 후 재설정
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup
openclaw config reset
```

## 연결 문제

### 게이트웨이 접속 불가

확인사항:
1. 방화벽 설정 확인
2. 포트 개방 확인
3. `openclaw status`로 상태 확인

해결책:
```bash
# 방화벽 포트 개방 (Ubuntu)
sudo ufw allow 18789/tcp

# SELinux 비활성화 (일시적)
sudo setenforce 0
```

## 채널 문제

### Telegram 봇 응답 없음

확인사항:
1. 봇 토큰 정확성
2. Webhook 설정
3. 방화벽

디버그:
```bash
openclaw gateway --verbose
```

---

## 지원 받기

- [GitHub Issues](https://github.com/openclaw/openclaw/issues)
- [Discord](https://discord.gg/clawd)
