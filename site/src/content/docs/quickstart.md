---
title: 빠른 시작 (30분 컷)
description: 30분 만에 OpenClaw를 설치하고 첫 대화를 나누는 방법
---

> ⏱️ 예상 소요시간: 30분  
> 🎯 목표: OpenClaw 설치 → 첫 실행 → 메신저 연결

## ✅ 사전 체크리스트

- [ ] Node.js 22+ 설치 확인 (`node --version`)
- [ ] 터미널/명령 프롬프트 접근 권한
- [ ] API 키 (OpenAI/Anthropic/기타) 준비
- [ ] 30분 여유 시간

:::tip[Windows 사용자 주의]
Windows에서는 WSL2 사용을 강력히 권장합니다.  
[WSL2 설치 가이드](/install/windows)를 먼저 확인하세요.
:::

---

## 1단계: 설치 (5분)

### macOS / Linux / WSL2

```bash
# 인스톨러 스크립트 실행
curl -fsSL https://openclaw.ai/install.sh | bash
```

### Windows (PowerShell - WSL2 권장)

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### 설치 확인

```bash
openclaw --version
# 출력 예: openclaw/2026.1.29
```

설치가 안 되었다면 [문제 해결](/install/troubleshooting)을 참고하세요.

---

## 2단계: 온볼딩 마법사 (10분)

```bash
openclaw onboard --install-daemon
```

### 마법사에서 설정할 내용

1. 게이트웨이 포트: 기본값 `18789` 권장
2. 인증 방식: 
   - 개인용: `token` (기본)
   - 팀용: `oauth` 또는 `password`
3. 모델 프로바이더 선택:
   - OpenAI (GPT-4o 등)
   - Anthropic (Claude 3.5 Sonnet/Opus 권장)
   - Groq, Gemini, 로컬 모델 등
4. API 키 입력: 선택한 프로바이더의 키 입력
5. 데몬 설치: `Yes` (권장)

### 온볼딩 완료 확인

```bash
openclaw doctor
```

✅ 녹색 체크마크가 모두 표시되면 성공!

---

## 3단계: 첫 실행 (5분)

### 게이트웨이 상태 확인

```bash
openclaw status
```

출력 예:
```
Gateway: running
Version: 2026.1.29
Port: 18789
Channels: 0 connected
```

### 대시보드 열기

```bash
openclaw dashboard
```

브라우저에서 `http://127.0.0.1:18789/`가 열립니다.

![OpenClaw 대시보드](/screenshots/dashboard-first-run.png)

---

## 4단계: 채널 연결 (10분)

텔레그램, 슬랙, Discord 등 메신저를 연결해 보세요.

### Telegram 연결 예시

```bash
openclaw channel add telegram
```

프롬프트에 따라:
1. BotFather에서 생성한 봇 토큰 입력
2. 허용할 사용자 ID 설정 (보안상 특정 사용자만 권장)
3. DM 정책 설정: `pairing` (기본, 권장)

### 연결 테스트

텔레그램에서 봇에게 메시지를 별낸다음:

```
/ping
```

또는:

```
Hello OpenClaw!
```

응답이 오면 성공! 🎉

---

## 5단계: 첫 자동화 시도 (볼수)

간단한 명령으로 기능을 테스트해 보세요:

```
현재 시간 알려줘
```

```
오늘 날씨 어때?
```

```
http://example.com 웹사이트 요약해줘
```

---

## 다음 단계

| 목표 | 가이드 |
|------|--------|
| 더 많은 채널 연결 | [채널 설정 가이드](/install/channels) |
| 스킬 설치 | ⚠️ [보안 체크리스트](/security/skill-checklist) 먼저! |
| 일정 자동화 | [활용 사례: 캘린더](/usecases/calendar-automation) |

---

## 🆘 문제가 발생했나요?

### 일반적인 문제

Q: `openclaw: command not found`  
A: PATH에 npm 전역 바이너리 경로가 없습니다.
```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

Q: 온볼딩 중 API 키 오류  
A: 키가 유효한지, 해당 프로바이더의 크레딧이 있는지 확인하세요.

Q: 게이트웨이가 시작되지 않음  
A: 포트 18789가 이미 사용 중일 수 있습니다.
```bash
openclaw gateway --port 18790  # 다른 포트 사용
```

더 많은 해결법은 [문제 해결](/install/troubleshooting)에서 확인하세요.
