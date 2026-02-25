---
title: 자주 묻는 질문 (FAQ)
description: OpenClaw 설치 및 사용 중 자주 묻는 질문과 답변
---

> 💬 OpenClaw를 시작하며 궁금했던 점들

---

## 🚀 시작하기

### Q1: OpenClaw는 물론인가요?

A: OpenClaw 소프트웨어 자체는 완전 물론입니다 (MIT 라이선스). 하지만 AI 모델 사용료는 별도입니다.

| 항목 | 비용 |
|------|------|
| OpenClaw 소프트웨어 | 물론 |
| OpenAI/Anthropic 등 API | 유료 (사용량 기준) |
| Groq/로컬 모델 | 저렴 또는 물론 |

추천 물론 조합:
- Groq (Llama 3.3) - $0.09/1M 토큰
- Ollama (로컬) - 물론 (자체 GPU 필요)

---

### Q2: Windows에서 WSL2 없이 사용할 수 있나요?

A: 강력히 권장하지 않습니다.

- 네이티브 Windows 설치는 지원되지 않거나 심각한 제약이 있습니다
- 일부 스킬이 제대로 작동하지 않을 수 있습니다
- WSL2는 Windows 10/11에 내장되어 있어 별도 비용 없이 사용 가능합니다

대안:
1. WSL2 설치 (권장)
2. Docker 사용
3. 별도 Linux 서버/VM 사용

---

### Q3: Claude와 OpenClaw의 차이점은 무엇인가요?

A: 

| 기능 | Claude (ChatGPT) | OpenClaw |
|------|------------------|----------|
| 실행 위치 | 클라우드 | 내 컴퓨터 |
| 파일 접근 | 제한적 | 전체 파일 시스템 |
| 메신저 연동 | 불가 | Telegram/Slack/Discord 등 |
| 자동화 | 제한적 | 크론/이벤트 기반 자동화 |
| 확장성 | 플러그인 | 3,500+ 스킬 |

요약: Claude는 "똑똑한 대화 상대", OpenClaw는 "일하는 AI 직원"

---

### Q4: 어느 정도의 기술 수준이 필요한가요?

A: 초급 개발자 수준이면 충분합니다.

필요한 기술:
- 터미널/명령 프롬프트 기본 사용법
- Node.js/npm 개념 이해
- API 키 발급 경험
- (선택) Docker 기초

프로그래밍 없이 시작 가능:
- 기본 설치는 명령어 복사-붙여넣기만으로 가능
- 스킬 설치도 명령어 한 줄
- 복잡한 설정은 선택사항

---

## 💻 설치 및 설정

### Q5: 설치가 안 될 때 어떻게 하나요?

A: 다음 순서대로 확인하세요:

1. Node.js 버전 확인
   ```bash
   node --version  # 22+ 필요
   ```

2. npm 전역 경로 확인
   ```bash
   npm prefix -g
   # PATH에 추가 필요할 수 있음
   ```

3. WSL2 설치 확인 (Windows)
   ```bash
   wsl --version
   ```

4. 권한 문제 (Linux/macOS)
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

여전히 안 되면: [문제 해결 가이드](/install/troubleshooting) 참조

---

### Q6: API 키는 어디서 발급받나요?

A: 각 프로바이더별 발급처:

| 프로바이더 | 발급 사이트 | 물롌 크레딧 |
|-----------|------------|------------|
| Anthropic (Claude) | [console.anthropic.com](https://console.anthropic.com) | $5 |
| OpenAI (GPT) | [platform.openai.com](https://platform.openai.com) | $5 |
| Google (Gemini) | [aistudio.google.com](https://aistudio.google.com) | $300 |
| Groq | [console.groq.com](https://console.groq.com) | $20 |

초기 비용 절약 팁:
- Google AI Studio ($300 크레딧)으로 시작
- Groq (초저가) 테스트
- 로컬 모델 (Ollama)로 연습

---

### Q7: 여러 컴퓨터에서 동시에 사용할 수 있나요?

A: 네트워크 설정에 따라 가능합니다.

같은 네트워크:
```json
// 설정 파일에서
"gateway": {
  "host": "0.0.0.0",  // 외부 접속 허용
  "port": 18789
}
```

다른 네트워크/외부 접속:
- VPN 사용 권장
- 또는 클라우드 서버에 설치
- 보안 주의: 인증 설정 필수

---

## 🔒 보안

### Q8: OpenClaw는 안전한가요?

A: 강력한 도구이므로 주의가 필요합니다.

위험 요소:
- 파일 시스템 전체 접근 권한
- 임의 코드 실행 가능
- 메신저를 통한 외부 통신
- 2026년 2월 기준 341개 이상 악성 스킬 발견

안전하게 사용하는 방법:
1. WSL2/Docker/별도 서버에서 실행
2. 스킬 설치 전 출처 확인
3. 민감한 데이터는 별도 환경에서 분리
4. 정기적인 API 키 회전

필수 읽기: [보안 경고](/security/warnings)

---

### Q9: 스킬 설치가 안전한지 어떻게 확인하나요?

A: 설치 전 체크리스트:

- [ ] GitHub 리포지토리 확인
  - 별(star) 수, 최근 업데이트
  - 코드 리뷰 (의심스러운 부분은 ChatGPT/Claude에게 분석 요청)
  
- [ ] 권한 요구사항 검토
  - 과도한 권한 요청 시 주의
  
- [ ] 커뮤니티 평판 확인
  - Reddit, Discord, GitHub Issues
  
- [ ] 샌드박스 테스트
  - 민감하지 않은 환경에서 먼저 테스트

의심스러운 경우: 설치하지 마세요!

---

### Q10: API 키가 유출되면 어떻게 하나요?

A: 즉시 조치:

1. API 키 폐기 (해당 프로바이더 콘솔에서)
2. 새 키 발급
3. OpenClaw 설정 업데이트
   ```bash
   openclaw config edit
   ```
4. 이전 키 사용 로그 확인 (프로바이더 콘솔)
5. 필요시 OpenClaw 재설치

예방책:
- `.env` 파일 git 업로드 금지
- `.gitignore`에 `.env` 추가
- 정기적인 키 회전

---

## ⚡ 사용 및 기능

### Q11: Telegram 외에 다른 메신저도 연결할 수 있나요?

A: 네, 50+ 채널 지원:

| 메신저 | 상태 | 특징 |
|--------|------|------|
| Telegram | ✅ 완벽 | 가장 인기, 안정적 |
| Slack | ✅ 완벽 | 업무용 추천 |
| Discord | ✅ 완벽 | 커뮤니티용 |
| WhatsApp | ✅ 가능 | QR 코드 인증 필요 |
| iMessage | ⚠️ 제한 | macOS 전용 |
| Signal | ✅ 가능 | signal-cli 필요 |
| Email | ✅ 가능 | IMAP/SMTP |

설치 예시:
```bash
openclaw channel add telegram
openclaw channel add slack
openclaw channel add discord
```

---

### Q12: 한국어로 완벽하게 사용할 수 있나요?

A: 네, AI 모델에 따라 다릅니다.

한국어 우수 모델:
- Claude 3.5/4.x: 한국어 매우 우수
- GPT-4o: 한국어 우수
- Gemini 1.5/3.x: 한국어 양호
- 로컬 모델: 한국어 성능 모델별 상이

OpenClaw 자체:
- CLI는 영어
- 메시지/응답은 한국어 가능
- 설정 파일은 영어

---

### Q13: 스마트폰에서도 사용할 수 있나요?

A: 간접적으로 가능합니다.

방법 1: 메신저 연동 (추천)
- Telegram/Slack 앱에서 OpenClaw와 대화
- 스마트폰에서도 모든 기능 사용 가능

방법 2: 웹 대시보드
- 브라우저에서 `http://컴퓨터IP:18789` 접속
- 같은 네트워크 필요 (또는 VPN)

방법 3: 클라우드 서버
- AWS/GCP 등에 OpenClaw 설치
- 어디서나 접속 가능

네이티브 앱: 현재 없음 (메신저 연동 사용)

---

### Q14: 자동화는 어떻게 설정하나요?

A: 3가지 방법:

1. 크론 (Cron) - 시간 기반
```bash
# 매일 아침 8시 브리핑
openclaw cron add "0 8 * * *" "daily-briefing"

# 매주 월요일 리포트
openclaw cron add "0 9 * * 1" "weekly-report"
```

2. 이벤트 기반 - 특정 상황 발생 시
```json
{
  "triggers": {
    "email.received": "email-to-obsidian",
    "calendar.event": "meeting-prep"
  }
}
```

3. 하트비트 (Heartbeat) - 에이전트 주기적 실행
```json
{
  "heartbeat": {
    "interval": "5m",
    "task": "check-emails"
  }
}
```

상세 가이드: [활용 사례 카테고리](/usecases)

---

## 💰 비용

### Q15: 한 달에 얼마나 비용이 드나요?

A: 사용량에 따라 다릅니다.

가벼운 사용 (월 $1-5):
- 개인용 일정/이메일 자동화
- Groq 또는 Gemini 3.0 Flash 사용

보통 사용 (월 $10-30):
- 업무용 다양한 자동화
- Claude Sonnet/GPT-4o 사용
- 하루 50-100회 API 호출

무거운 사용 (월 $50+):
- 개발 워크플로우 자동화
- Claude Opus/GPT-5.3 Codex 사용
- 대용량 문서 처리

비용 절약 팁:
- Groq 사용 (Anthropic 대비 1/30 가격)
- 캐싱 활용 (동일 프롬프트 재사용)
- 토큰 수 모니터링

---

### Q16: 무료로 사용하려면 어떤 모델을 선택해야 하나요?

A: 완전 무료 또는 초저가 옵션:

| 옵션 | 조건 | 성능 |
|------|------|------|
| Ollama (로컬) | 자체 GPU 필요 | 중간 |
| Groq Llama 3.3 | $0.09/1M 토큰 | 우수 |
| Gemini 3.0 Flash | $0.15/1M 토큰 | 우수 |
| Google AI Studio | $300 무료 크레딧 | 최고 |

초기 추천:
1. Google AI Studio ($300 크레딧)으로 시작
2. Groq으로 전환하여 유지

---

## 🐛 문제 해결

### Q17: OpenClaw가 응답하지 않을 때

A: 단계별 확인:

1. 게이트웨이 상태 확인
   ```bash
   openclaw status
   ```

2. 프로세스 확인
   ```bash
   ps aux | grep openclaw
   ```

3. 재시작
   ```bash
   openclaw gateway stop
   openclaw gateway start
   ```

4. 로그 확인
   ```bash
   openclaw logs --tail 100
   ```

5. 포트 변경 (충돌 시)
   ```bash
   openclaw gateway --port 18790
   ```

---

### Q18: 메신저에서 응답이 안 올 때

A: 확인 사항:

1. 게이트웨이 실행 중
   ```bash
   openclaw status  # running 확인
   ```

2. 채널 설정 확인
   ```bash
   openclaw channel list
   ```

3. 웹훅 URL 확인 (Telegram BotFather)
   - 포트 포워딩 필요할 수 있음

4. DM 정책 확인
   ```json
   "dmPolicy": "open"  // 또는 "pairing"이면 승인 필요
   ```

5. 방화벽/보안 그룹 (클라우드 사용 시)
   - 포트 18789 개방

---

### Q19: 스킬이 제대로 작동하지 않을 때

A: 디버깅 단계:

1. 스킬 로그 확인
   ```bash
   openclaw logs --skill <skill-name>
   ```

2. 의존성 확인
   ```bash
   openclaw skill check <skill-name>
   ```

3. 재설치
   ```bash
   openclaw skill remove <skill-name>
   openclaw skill install <skill-name>
   ```

4. 설정 파일 확인
   ```bash
   cat ~/.openclaw/skills/<skill-name>/config.json
   ```

5. GitHub Issues 확인
   - 해당 스킬 리포지토리 확인

---

## 🆕 업데이트 및 미래

### Q20: OpenClaw는 계속 업데이트되나요?

A: 네, 활발히 개발 중입니다.

최근 업데이트 (2026년 2월 기준):
- 멀티 에이전트 기능 강화
- 보안 패치 (악성 스킬 대응)
- 새로운 채널 지원
- 성능 개선

업데이트 방법:
```bash
# npm으로 설치한 경우
npm update -g openclaw

# 또는 재설치
npm uninstall -g openclaw
npm install -g openclaw
```
업데이트 방법:
```bash
# npm으로 설치한 경우
npm update -g openclaw

# 또는 재설치
npm uninstall -g openclaw
npm install -g openclaw
```

---

## 📚 더 알아보기

- [빠른 시작 (30분)](/quickstart)
- [설치 가이드](/install/prerequisites)
- [보안 가이드](/security/warnings)
- [활용 사례](/usecases)

