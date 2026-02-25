---
title: 초급 - 일정 자동 등록
description: 메신저에서 일정을 추가하면 자동으로 캘린더에 등록
---

> 🟢 초급 레벨  
> ⏱️ 예상 소요시간: 20분  
> 🎯 목표: 메신저로 일정 추가하기

## 개요

"다음 주 화요일 3시에 미팅"이라고 메신저로 별낸 다음, 자동으로 Google Calendar에 등록됩니다.

## 전제 조건

- Google Calendar 계정
- Google Calendar API 키

## 설정

### 1. 스킬 설치

```bash
openclaw skill install calendar
```

### 2. 인증

```bash
openclaw skill auth calendar
```

## 사용 예시

### 메신저 대화

```
User: 내일 오후 2시에 팀 미팅 있어

OpenClaw: 📅 일정을 등록했습니다:
- 제목: 팀 미팅
- 날짜: 2026-02-26
- 시간: 14:00
```

### 명령어

```
캘린더에 "프로젝트 발표" 3월 1일 오전 10시로 등록해줘
```

## 고급 설정

### 알림 설정

```json
{
  "calendar": {
    "defaultReminder": 30,
    "notifications": {
      "telegram": true,
      "email": false
    }
  }
}
```

---

## 다음 단계

- [문서 작성 + 스크린샷](/usecases/document-with-screenshots)
