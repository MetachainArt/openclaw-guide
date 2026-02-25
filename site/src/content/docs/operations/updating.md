---
title: 업데이트
description: OpenClaw를 최신 버전으로 업데이트하는 방법
---

> ⏱️ **예상 소요시간**: 10분  
> 🎯 **목표**: 안전한 업데이트

## 업데이트 확인

```bash
# 현재 버전
openclaw --version

# 최신 버전 확인
npm view openclaw version
```

## 업데이트 방법

### npm 사용

```bash
# 전역 패키지 업데이트
npm update -g openclaw

# 또는 재설치
npm uninstall -g openclaw
npm install -g openclaw@latest
```

### 업데이트 전 백업

```bash
# 설정 백업
cp -r ~/.openclaw ~/.openclaw.backup-$(date +%Y%m%d)

# 업데이트
npm update -g openclaw

# 버전 확인
openclaw --version

# 문제 발생 시 복원
# cp -r ~/.openclaw.backup-YYYYMMDD ~/.openclaw
```

## 업데이트 후 확인

```bash
# 의사 진단
openclaw doctor

# 게이트웨이 상태
openclaw status

# 테스트 대화
openclaw agent --message "ping"
```

## 롤백

문제 발생 시 이전 버전으로:

```bash
# 특정 버전 설치
npm install -g openclaw@2026.1.15
```

---

## 보안 업데이트

⚠️ **보안 패치는 즉시 적용하세요**

- [OpenClaw Security Advisories](https://github.com/openclaw/openclaw/security)
- [Changelog](https://github.com/openclaw/openclaw/blob/main/CHANGELOG.md)
