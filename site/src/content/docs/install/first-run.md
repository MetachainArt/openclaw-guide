---
title: 최초 실행 및 설정
description: OpenClaw를 처음 실행하고 기본 설정을 완료하는 방법
---

> ⏱️ **예상 소요시간**: 15-20분  
> 🎯 **목표**: 온볼딩 완료 → 첫 대화

---

## 온볼딩 마법사

OpenClaw는 대화형 CLI 마법사로 초기 설정을 안내합니다.

```bash
openclaw onboard --install-daemon
```

### `--install-daemon` 옵션

- **macOS**: `launchd` 서비스로 등록
- **Linux**: `systemd` 사용자 서비스로 등록
- **Windows**: Windows 서비스로 등록 (WSL2에서 systemd 사용 시)

---

## 온볼딩 단계별 안내

### 1단계: 환영 메시지

```
🦞 OpenClaw Onboarding

Welcome! This wizard will help you set up your personal AI assistant.

Press Enter to continue...
```

### 2단계: 게이트웨이 설정

```
? Gateway port (18789): 
```

- 기본값 `18789` 권장
- 이미 사용 중이면 다른 포트 입력

### 3단계: 인증 설정

```
? Authentication mode:
  ▸ token (recommended for personal use)
    oauth
    password
```

| 모드 | 사용 사례 | 보안 |
|------|----------|------|
| **token** | 개인용 | ⭐⭐⭐ API 키 형태 |
| **oauth** | 팀/조직 | ⭐⭐⭐⭐ OAuth 프로바이더 |
| **password** | 공개 서버 | ⭐⭐⭐⭐⭐ 사용자명/비밀번호 |

**권장**: 개인용으로 `token` 선택

### 4단계: 모델 프로바이더 설정

```
? Select your AI model provider:
  ▸ Anthropic (Claude)
    OpenAI (GPT)
    Groq
    Google (Gemini)
    Local (Ollama)
    Other
```

#### Anthropic Claude 선택 시

```
? Anthropic API key: sk-ant-...
? Default model:
  ▸ claude-3-5-sonnet-20241022 (balanced)
    claude-3-opus-20240229 (powerful, slower)
    claude-3-haiku-20240307 (fast, cheaper)
```

**권장 설정**:
- **일반**: `claude-3-5-sonnet-20241022`
- **복잡한 작업**: `claude-3-opus-20240229`

#### OpenAI 선택 시

```
? OpenAI API key: sk-...
? Default model:
  ▸ gpt-4o
    gpt-4o-mini (cheaper)
    gpt-4-turbo
```

### 5단계: 추가 모델 (선택)

```
? Configure additional model providers? (y/N)
```

여러 프로바이더를 설정하면 폴오버(장애 시 자동 전환)가 가능합니다.

### 6단계: 채널 설정 (선택)

```
? Enable channels? (y/N)
```

나중에 설정할 수도 있습니다. 바로 설정하려면:

```
? Select channels to configure:
  [ ] Telegram
  [ ] Slack
  [ ] Discord
  [ ] WhatsApp
```

### 7단계: 데몬 설치 확인

```
? Install Gateway as a service? (Y/n)
```

**권장**: `Y` (시스템 시작 시 자동 실행)

### 8단계: 완료

```
✅ Onboarding complete!

Your OpenClaw Gateway is now running at:
  http://127.0.0.1:18789

Next steps:
  1. Run `openclaw dashboard` to open the web UI
  2. Configure channels: `openclaw channel add`
  3. Read the docs: https://docs.openclaw.ai
```

---

## 설치 확인

### 기본 상태 확인

```bash
# 버전 확인
openclaw --version

# 상태 확인
openclaw status
```

출력 예:
```
Gateway: running
Version: 2026.1.29
Port: 18789
Uptime: 5m 30s
Channels: 0 connected
```

### 의사(Doctor) 진단

```bash
openclaw doctor
```

문제가 있으면 수정 방법을 안내합니다.

### 대시보드 접속

```bash
# 브라우저에서 열기
openclaw dashboard

# 또는 직접 접속
open http://127.0.0.1:18789
```

---

## 기본 명령어

### 게이트웨어 제어

```bash
# 시작
openclaw gateway --port 18789

# 백그라운드 데몬 시작
openclaw gateway start

# 중지
openclaw gateway stop

# 재시작
openclaw gateway restart

# 로그 확인
openclaw gateway logs
```

### 에이전트와 대화

```bash
# 대화 모드
openclaw agent

# 한 번의 메시지
openclaw agent --message "Hello, what can you do?"

# 고급 추론 모드
openclaw agent --message "Complex task" --thinking high
```

### 설정 파일 편집

```bash
# 기본 설정 열기
openclaw config edit

# 또는 직접 편집
nano ~/.openclaw/openclaw.json
```

---

## 환경 변수

### 주요 변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `OPENCLAW_HOME` | 낸부 경로 베이스 | `~/.openclaw` |
| `OPENCLAW_STATE_DIR` | 상태 저장 위치 | `~/.openclaw/state` |
| `OPENCLAW_CONFIG_PATH` | 설정 파일 경로 | `~/.openclaw/openclaw.json` |
| `OPENCLAW_PROFILE` | 프로필 이름 | `work`, `personal` |

### 사용 예

```bash
# 다른 프로필로 실행
OPENCLAW_PROFILE=work openclaw dashboard

# 외부 설정 사용
OPENCLAW_CONFIG_PATH=/mnt/config/openclaw.json openclaw gateway
```

---

## 다음 단계

### 채널 연결

- [Telegram 설정](/channels/telegram)
- [Slack 설정](/channels/slack)
- [Discord 설정](/channels/discord)

### 스킬 설치

⚠️ [보안 체크리스트](/security/skill-checklist) 확인 후:

```bash
openclaw skill list          # 사용 가능한 스킬 목록
openclaw skill install web   # 웹 스킬 설치
```

### 학습

- [활용 사례 모음](/usecases/all-cases)
- [보안 가이드](/security/warnings)

---

## 문제 해결

### 게이트웨이가 시작되지 않음

```bash
# 포트 충돌 확인
lsof -i :18789

# 다른 포트로 시작
openclaw gateway --port 18790
```

### 설정 파일 오류

```bash
# 설정 검증
openclaw config validate

# 기본값으로 재설정
openclaw config reset

# 백업에서 복원
cp ~/.openclaw/openclaw.json.backup ~/.openclaw/openclaw.json
```

### API 키 오류

```bash
# 설정에서 키 업데이트
openclaw config edit

# 또는 환경 변수로 임시 설정
export ANTHROPIC_API_KEY=sk-ant-...
```

---

## 설정 파일 예시

`~/.openclaw/openclaw.json`:

```json
{
  "gateway": {
    "port": 18789,
    "auth": {
      "mode": "token",
      "token": "your-token-here"
    }
  },
  "models": {
    "default": {
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022",
      "apiKey": "sk-ant-..."
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "...",
      "dmPolicy": "pairing"
    }
  }
}
```
