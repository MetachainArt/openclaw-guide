---
title: 초급 - 이메일 → 옵시디언 저장
description: 이메일을 자동으로 Obsidian에 저장하는 방법
---

> 🟢 초급 레벨  
> ⏱️ 예상 소요시간: 30분  
> 🎯 목표: 중요 이메일을 자동으로 Obsidian에 아카이브

## 개요

이메일 인박스를 정리하고 중요한 메일을 Obsidian에 자동으로 저장하는 워크플로우입니다.

## 전제 조건

- Gmail 계정
- Obsidian 설치
- OpenClaw 실행 중

## 설정 방법

### 1단계: Gmail 스킬 설치

```bash
openclaw skill install gmail
```

### 2단계: Obsidian 연동

```bash
openclaw skill install obsidian
```

### 3단계: 설정

```json
{
  "skills": {
    "gmail": {
      "watch": true,
      "labels": ["Important", "Starred"]
    },
    "obsidian": {
      "vault": "~/Documents/Obsidian"
    }
  }
}
```

## 사용 예시

### 메시지 명령

```
이 메일을 Obsidian에 저장해줘
```

```
오늘 중요한 이메일을 노트로 만들어줘
```

### 자동화 설정

```bash
# 매일 밤 자동 실행
openclaw cron add "0 22 * * *" "email-to-obsidian"
```

## 결과

Obsidian에 다음 형식으로 저장됨:

```markdown
---
date: 2026-02-25
from: sender@example.com
subject: "Important Subject"
---

# Important Subject

이메일 내용 요약...
```

---

## 다음 단계

- [일정 자동 등록](/usecases/calendar-automation)
