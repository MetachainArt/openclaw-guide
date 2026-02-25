---
title: 설치 전 준비
description: OpenClaw 설치 전에 확인해야 할 사항들
---

> ⏱️ **예상 소요시간**: 15-30분  
> 🎯 **목표**: 설치 환경 준비 및 계획 수립

## 시스템 요구사항

### 필수 요구사항

| 항목 | 최소 | 권장 |
|------|------|------|
| **Node.js** | 22.0.0 | 22.x LTS |
| **RAM** | 4GB | 8GB+ |
| **디스크** | 2GB 여유 | 5GB+ 여유 |
| **OS** | macOS 12+, Ubuntu 20.04+, Windows 10+ | 최신 버전 |

### 네트워크 요구사항

- 인터넷 연결 (설치 및 모델 API 호출용)
- 포트 18789 (기본 게이트웨이 포트) 사용 가능
- (선택) 외부 접근을 위한 포트 포워딩

---

## OS별 권장사항

### 🍎 macOS

**지원 버전**: macOS 12 (Monterey) 이상

**추가 요구사항**:
- Xcode Command Line Tools
- Homebrew (권장)

```bash
# Xcode CLT 설치
xcode-select --install
```

**macOS 특징**:
- 네이티브 Voice Wake/Talk Mode 지원
- 메뉴 바 앱 사용 가능
- iOS/Android 노드 연동 지원

### 🐧 Linux

**지원 배포판**:
- Ubuntu 20.04 LTS 이상
- Debian 11+
- Fedora 38+
- Arch Linux

**추가 요구사항**:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y build-essential curl git

# Fedora
sudo dnf install -y gcc-c++ make curl git
```

### 🪟 Windows

:::danger[중요: WSL2 사용 권장]
Windows에서는 **WSL2 (Windows Subsystem for Linux)** 사용을 **강력히 권장**합니다.

네이티브 Windows 설치는 가능하지만, 다음과 같은 제약이 있습니다:
- 일부 스킬/기능 미지원
- 파일 경로 문제 발생 가능
- 성능 저하
:::

**WSL2 설치**: [Windows 설치 가이드](/install/windows) 참고

---

## 사전 준비물

### 1. API 키 준비

OpenClaw는 LLM API가 필요합니다. 다음 중 하나 이상 준비하세요:

| 프로바이더 | 모델 예시 | 특징 |
|-----------|----------|------|
| **Anthropic** | Claude 3.5 Sonnet/Opus | 🏆 권장 (긴 컨텍스트, 프롬프트 인젝션 저항) |
| **OpenAI** | GPT-4o, GPT-4o-mini | 빠른 응답, 널리 사용됨 |
| **Groq** | Llama 3, Mixtral | 저렴한 가격, 빠른 속도 |
| **Gemini** | Gemini 1.5 Pro/Flash | Google 에코시스템 |
| **로컬** | Ollama, vLLM | 프라이버시, 비용 없음 |

### 2. 클라우드 계정 (선택)

- **GitHub**: 스킬/코드 동기화용
- **Tailscale**: 원격 접근용 (권장)
- **Ngrok**: 임시 터널링용

### 3. 메신저 계정 (선택)

연동할 메신저 계정 미리 준비:
- Telegram (BotFather에서 봇 생성)
- Slack (앱 생성 권한 필요)
- Discord (Bot 토큰 필요)

---

## 설치 방식 선택

| 방식 | 난이도 | 권장 대상 | 특징 |
|------|--------|----------|------|
| **인스톨러 스크립트** | ⭐ 쉬움 | 대부분의 사용자 | 권장 방식. 자동 설정 |
| **npm/pnpm** | ⭐⭐ 중간 | Node.js 개발자 | 직접 버전 관리 |
| **Docker** | ⭐⭐ 중간 | 서버/홈랩 운영자 | 격리, 이식성 |
| **소스 빌드** | ⭐⭐⭐ 어려움 | 개발자/기여자 | 최신 기능, 커스터마이징 |

---

## 보안 계획 수립

:::warning[필수 확인]
OpenClaw는 강력한 권한을 가집니다. 설치 전 보안 계획을 세우세요.
:::

### 권장 보안 설정

1. **격리 환경 사용**:
   - WSL2 (Windows)
   - Docker 컨테이너
   - 별도의 VM/서버

2. **권한 분리**:
   - 전용 사용자 계정으로 실행
   - sudo/root 권한 불필요

3. **네트워크 격리**:
   - Tailscale 사용 (권장)
   - VPN 내부에서만 접근
   - 공개 인터넷 노출 금지

---

## 설치 계획 체크리스트

- [ ] OS 버전 확인
- [ ] Node.js 22+ 설치
- [ ] API 키 준비 (1개 이상)
- [ ] 설치 방식 결정
- [ ] 보안/격리 계획 수립
- [ ] (선택) 메신저 봇 준비

모든 준비가 끝났다면 설치를 시작하세요:

[🚀 macOS 설치](/install/macos)  
[🐧 Linux 설치](/install/linux)  
[🪟 Windows 설치](/install/windows)  
[🐳 Docker 설치](/install/docker)
