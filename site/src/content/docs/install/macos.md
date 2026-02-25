---
title: macOS 설치
description: macOS에서 OpenClaw를 설치하는 방법
---

> ⏱️ **예상 소요시간**: 20-30분  
> 🎯 **목표**: macOS에 OpenClaw 설치 및 실행

## 시스템 요구사항

- macOS 12.0 (Monterey) 이상
- 4GB RAM (8GB 권장)
- Apple Silicon (M1/M2/M3) 또는 Intel Mac

---

## 1단계: 필수 도구 설치 (5분)

### Xcode Command Line Tools

```bash
xcode-select --install
```

팝업에서 "설치" 클릭

### Homebrew 설치 (권장)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치 후 터미널 재시작 또는:
```bash
eval "$(/opt/homebrew/bin/brew shellenv)"  # Apple Silicon
eval "$(/usr/local/bin/brew shellenv)"     # Intel Mac
```

---

## 2단계: Node.js 설치 (5분)

### Homebrew 사용 (권장)

```bash
brew install node@22
brew link node@22
```

### 또는 공식 인스톨러

[nodejs.org](https://nodejs.org)에서 LTS 버전 다운로드

### 설치 확인

```bash
node --version  # v22.x.x
npm --version
```

---

## 3단계: OpenClaw 설치 (5분)

### 권장: 인스톨러 스크립트

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 또는 npm 사용

```bash
npm install -g openclaw@latest
```

### pnpm 사용 (고급)

```bash
brew install pnpm
pnpm add -g openclaw@latest
pnpm approve-builds -g
```

---

## 4단계: 온볼딩 (10분)

```bash
openclaw onboard --install-daemon
```

### macOS 특화 옵션

온볼딩 마법사에서:
- **데몬 설치**: `launchd` 서비스로 자동 시작
- **메뉴 바 앱**: (선택) macOS 메뉴 바에서 제어
- **Voice Wake**: (Apple Silicon 권장) 음성 명령 활성화

---

## 5단계: 설치 확인

```bash
# 상태 확인
openclaw doctor

# 게이트웨이 실행
openclaw gateway --port 18789

# 대시보드 열기
openclaw dashboard
```

---

## macOS 전용 기능

### 메뉴 바 앱

```bash
# 설치
openclaw install menu-bar

# 또는 수동 다운로드
# https://openclaw.ai/download/macos
```

### Voice Wake (음성 깨우기)

```bash
# 활성화
openclaw settings set voice.wake.enabled true

# 단어 설정 (기본: "Hey OpenClaw")
openclaw settings set voice.wake.phrase "컴퓨터"
```

### iOS/Android 노드 연동

1. iPhone/Android에 OpenClaw Node 앱 설치
2. 같은 Wi-Fi 네트워크에서 자동 검색
3. 페어링 코드 확인 후 연결

---

## 흔한 문제

### 문제: "sharp" 빌드 오류

**원인**: libvips 충돌

**해결책**:
```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

### 문제: 개발자를 확인할 수 없음

**해결책**:
1. 시스템 설정 → 개인정보 보호 및 보안
2. "OpenClaw가 차단되었습니다" → "그래도 열기"

또는:
```bash
xattr -dr com.apple.quarantine /path/to/openclaw
```

### 문제: 포트 18789 충돌

**해결책**:
```bash
# 사용 중인 프로세스 확인
lsof -i :18789

# 다른 포트 사용
openclaw gateway --port 18790
```

---

## Apple Silicon (M1/M2/M3) 특별 설정

### Rosetta 설치 (Intel 앱 호환성)

```bash
softwareupdate --install-rosetta
```

### 네이티브 성능 최적화

Apple Silicon Mac에서는 다음이 자동으로 최적화됩니다:
- 로컬 LLM 실행 (Ollama 등)
- 음성 처리
- 이미지/비디오 처리

---

## 다음 단계

- [최초 실행 및 설정](/install/first-run)
- [모델 연결 설정](/install/models)
- [Voice Wake 설정](https://docs.openclaw.ai/nodes/voicewake)
