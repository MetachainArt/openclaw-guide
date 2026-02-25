---
title: "⚠️ 보안 경고"
description: OpenClaw 보안 위험 및 필수 주의사항
---

:::danger[🚨 필수 읽기]
OpenClaw를 설치하거나 스킬을 사용하기 전에 반드시 이 페이지를 읽으세요.

OpenClaw는 강력한 자율 권한을 가진 도구이며, 2026년 2월 ClawHub에서 341개 이상의 악성 스킬이 발견되었습니다.
:::

---

## 최근 보안 사고 (2026년 2월)

### ClawHub 공급망 공격

| 사건 | 내용 | 출처 |
|------|------|------|
| 악성 스킬 발견 | 341개 이상의 악성 스킬 확인 (2,857개 중) | Koi Security (2026-02-02) |
| 데이터 탈취 | SSH 키, 암호화폐 지갑, 브라우저 비밀번호 훔쳐감 | OffSeq Threat Radar |
| 프롬프트 인젝션 | 안전 가이드라인 우회 및 데이터 유출 | The Register |
| RememberAll 트로이 | "personal reminder"로 위장, API 키 탈취 | Alice.io Research |

### 공격 방식

1. 정상적인 스킬로 위장: 유용한 기능으로 보이는 스킬 등록
2. 다단계 페이로드: 설치 후 추가 악성 코드 다운로드
3. 데이터 유출: 환경 변수, `.env` 파일, API 키 수집
4. C2 연결: 공격자 서버와 통신 채널 수립

---

## OpenClaw의 위험성

### 자율 권한

OpenClaw는 다음 작업을 자동으로 수행할 수 있습니다:

- ✅ 코드 실행: 임의의 코드 다운로드 및 실행
- ✅ 파일 접근: 사용자 파일 읽기/쓰기
- ✅ 네트워크: 외부 서버와 통신
- ✅ 메시지 전송: 메신저로 메시지 발신
- ✅ 브라우저 제어: 웹사이트 방문, 데이터 입력

### 이런 권한이 왜 필요한가?

- 이메일 자동화를 위해 메시지 발신 필요
- 파일 처리를 위해 디스크 접근 필요
- 웹 자동화를 위해 브라우저 제어 필요

하지만 악성 스킬이 이런 권한을 악용할 수 있습니다.

---

## 필수 보안 원칙

### 1. 격리 원칙 (가장 중요)

| 환경 | 위험도 | 권장사항 |
|------|--------|----------|
| 메인 컴퓨터 | 🔴 높음 | 민감 데이터 있으면 사용 금지 |
| WSL2 | 🟡 중간 | 권장되는 최소 격리 |
| Docker | 🟡 중간 | 컨테이너 격리 |
| 별도 PC/서버 | 🟢 낮음 | 가장 안전 |
| VM/클라우드 | 🟢 낮음 | 프로덕션 환경 권장 |

### 2. 최소권한 원칙

- 전용 사용자 계정으로 실행
- sudo/root 권한 불필요
- 필요한 채널만 연결
- `.env` 파일 분리 저장

### 3. 스킬 설치 전 체크리스트

스킬 설치 전 반드시 확인:

- [ ] 소스코드 검토 (GitHub 등)
- [ ] 개발자 신뢰성 확인
- [ ] 권한 요구사항 검토
- [ ] 샌드박스 테스트
- [ ] 백업 완료

### 4. 정기적인 감사

- 설치된 스킬 목록 주기적 확인
- API 키 정기 회전
- 로그 모니터링
- 비정상 네트워크 트래픽 감시

---

## DM(비공개 메시지) 보안

### 기본 설정: 페어링 모드

```json
{
  "channels": {
    "telegram": {
      "dmPolicy": "pairing"
    },
    "discord": {
      "dmPolicy": "pairing"
    }
  }
}
```

- pairing: 미승인 사용자는 페어링 코드만 받음
- open: 모든 DM 허용 (위험)

### 페어링 승인

```bash
# 특정 사용자 승인
openclaw pairing approve telegram ABC123

# 승인 목록 확인
openclaw pairing list
```

---

## 보안 설정 검사

```bash
# 보안 설정 진단
openclaw doctor --security

# 출력 예:
# ⚠️  DM policy is "open" for Telegram (high risk)
# ✅  Gateway auth is enabled
# ⚠️  3 skills from unverified sources installed
```

---

## 사고 발생 시 대응

### 1. 즉시 중지

```bash
openclaw gateway stop
```

### 2. 네트워크 차단

```bash
# WSL2에서
sudo ufw deny out

# 또는
sudo iptables -A OUTPUT -j DROP
```

### 3. API 키 폐기

- OpenAI/Anthropic 등 모든 API 키 즉시 폐기
- 새 키 발급

### 4. 로그 확인

```bash
# 최근 활동 확인
openclaw logs --tail 1000

# 스킬 실행 기록
cat ~/.openclaw/logs/skills.log
```

### 5. 완전 재설치 (심각한 경우)

```bash
# 설정 및 데이터 백업 후
rm -rf ~/.openclaw
npm uninstall -g openclaw
# 새로 설치
```

---

## 안전한 스킬 개발

직접 스킬을 개발하는 경우:

1. 코드 서명: 신뢰할 수 있는 출처 표시
2. 최소 권한: 필요한 권한만 요청
3. 투명성: 모든 동작 로깅
4. 오픈소스: 코드 공개

---

## 추가 자료

- [OpenClaw Security Docs](https://docs.openclaw.ai/gateway/security)
- [Koi Security Report](https://radar.offseq.com) (2026-02-02)
- [Alice.io Trojan Analysis](https://alice.io/blog/we-audited-the-openclaw-marketplace-we-found-a-trojan)

---

## 요약

| 항목 | 조치 |
|------|------|
| 설치 | WSL2/Docker/별도 서버 사용 |
| 스킬 | 출처 확인 + 샌드박스 테스트 |
| DM | pairing 모드 사용 |
| 키 | 정기 회전 |
| 모니터링 | 로그 및 네트워크 감시 |

기억하세요: OpenClaw는 강력한 도구입니다. 강력한 도구는 강력한 책임을 동반합니다.
