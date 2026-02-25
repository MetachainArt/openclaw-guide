---
title: 모델 연결 설정
description: OpenAI, Anthropic, Google 등 AI 모델 API 연결 및 설정 방법
---

> ⏱️ **예상 소요시간**: 10-15분  
> 🎯 **목표**: AI 모델 API 연결

## 지원 모델 및 API 발급 사이트

| 프로바이더 | 최신 모델 | 특징 | API 발급 사이트 |
|-----------|----------|------|----------------|
| **Anthropic** | Claude Sonnet 4.6, Opus 4.6 | 1M 토큰 컨텍스트, 최고의 코딩 성능 | [console.anthropic.com](https://console.anthropic.com) |
| **OpenAI** | GPT-5.3, GPT-5.2, GPT-5 | 통합 시스템, 사고 능력 내장 | [platform.openai.com](https://platform.openai.com) |
| **Google** | Gemini 3.1 Pro, 3.0 Flash | 멀티모달, 1M 컨텍스트 | [aistudio.google.com](https://aistudio.google.com) |
| **Groq** | Llama 3.3, Mixtral 8x22B | 초고속 응답, 저렴한 가격 | [console.groq.com](https://console.groq.com) |
| **xAI** | Grok 2, Grok 3 | 실시간 정보, 유머러스한 응답 | [x.ai](https://x.ai) |
| **Local** | Ollama, vLLM, LM Studio | 프라이버시, 영구 물비용 | - |

### 최신 모델 버전 정보 (2026년 2월 기준)

```yaml
# Anthropic Claude
claude-opus-4-6-20250205    # 최고 성능, 복잡한 추론 (2026.02 출시)
claude-sonnet-4-6-20260217  # 최신 Sonnet, 1M 컨텍스트
claude-sonnet-4-5-20250929  # 안정적인 버전
claude-haiku-3-5-20241022   # 빠른 응답, 비용 효율 (Haiku는 3.5가 최신)

# OpenAI GPT
gpt-5.3-codex               # 최신 코딩 에이전트 모델 (2026.02 출시)
gpt-5.2-instant             # 빠른 응답
gpt-5.2-thinking            # 깊은 추론
gpt-5                       # 통합 기본 모델

# Google Gemini
gemini-3.1-pro              # 복잡한 코딩 및 추론 (2026.02 출시)
gemini-3.0-flash            # 속도와 성능 균형
gemini-3.0-flash-lite       # 최고의 비용 효율
gemini-2.0-flash-thinking   # 추론 능력 내장
```

## Anthropic Claude 설정 (권장)

### 1. API 키 발급

1. [console.anthropic.com](https://console.anthropic.com) 접속
2. 계정 생성 및 로그인
3. **Billing** 메뉴에서 결제 정보 등록 (묻지 않는 한도 $5)
4. **API Keys** 메뉴로 이동
5. **Create Key** 클릭하여 새 키 생성
6. 키를 안전한 곳에 복사 (⚠️ 다시 볼 수 없음)

![Claude API Keys 페이지](/images/screenshots/anthropic-api-keys.png)

### 2. OpenClaw에 설정

```bash
openclaw config edit
```

또는 직접 설정 파일 편집:

```json
{
  "models": {
    "default": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-6-20260217",
      "apiKey": "sk-ant-api03-..."
    }
  }
}
```

### 3. 테스트

```bash
openclaw agent --message "Hello"
```

---

## OpenAI GPT 설정

### 1. API 키 발급

1. [platform.openai.com](https://platform.openai.com) 접속
2. 계정 생성 및 로그인
3. **Billing** 메뉴에서 결제 정보 등록
4. **API Keys** → **Create new secret key**
5. 키 이름 입력 후 생성
6. 키를 안전한 곳에 복사 (⚠️ 다시 볼 수 없음)

![OpenAI API Keys 페이지](/images/screenshots/openai-api-keys.png)

### 2. OpenClaw 설정

```json
{
  "models": {
    "default": {
      "provider": "openai",
      "model": "gpt-5.3-codex",
      "apiKey": "sk-proj-..."
    }
  }
}
```

---

## Google Gemini 설정

### 1. API 키 발급

1. [aistudio.google.com](https://aistudio.google.com) 접속
2. Google 계정으로 로그인
3. **Get API Key** 클릭
4. **Create API Key** 선택
5. 키를 복사하여 저장

![Google AI Studio API Keys](/images/screenshots/google-aistudio-api.png)

### 2. OpenClaw 설정

```json
{
  "models": {
    "default": {
      "provider": "gemini",
      "model": "gemini-3.1-pro",
      "apiKey": "AIzaSy..."
    }
  }
}
```

---

## Groq 설정 (고속/저렴)

### 1. API 키 발급

1. [console.groq.com](https://console.groq.com) 접속
2. 계정 생성 및 로그인
3. **API Keys** 메뉴
4. **Create API Key** 클릭
5. 키 복사 및 저장

![Groq Console API Keys](/images/screenshots/groq-api-keys.png)

### 2. OpenClaw 설정

```json
{
  "models": {
    "default": {
      "provider": "groq",
      "model": "llama-3.3-70b-versatile",
      "apiKey": "gsk_..."
    }
  }
}
```

---

## 폴오버(장애 대응) 설정

기본 모델에 문제가 생기면 자동으로 백업 모델 사용:

```json
{
  "models": {
    "default": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-6-20260217",
      "apiKey": "sk-ant-..."
    },
    "fallback": {
      "provider": "openai",
      "model": "gpt-5.2-instant",
      "apiKey": "sk-..."
    }
  }
}
```

---

## 모델 비용 비교 (1M 토큰 기준)

| 모델 | 입력 | 출력 | 특징 |
|------|------|------|------|
| Claude Opus 4.6 | $5.00 | $25.00 | 최고 성능 (2026.02) |
| Claude Sonnet 4.6 | $3.00 | $15.00 | 균형 잡힌 성능 |
| Claude Haiku 3.5 | $0.25 | $1.25 | 빠른 응답 |
| GPT-5.3 Codex | $3.00 | $15.00 | 코딩 특화 (2026.02) |
| GPT-5.2 Instant | $0.50 | $1.50 | 빠른 응답 |
| Gemini 3.1 Pro | $2.00 | $12.00 | 멀티모달 (2026.02) |
| Gemini 3.0 Flash | $0.15 | $0.60 | 비용 효율 |
| Groq Llama 3.3 | $0.09 | $0.09 | 초저가 |

---

## 다음 단계

- [첫 실행 및 설정](/install/first-run)
- [문제 해결](/install/troubleshooting)
