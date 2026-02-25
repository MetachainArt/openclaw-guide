---
title: 60가지 활용 사례 모음
description: OpenClaw로 할 수 있는 60가지 실제 활용 사례 - 초급부터 고급까지 상세 가이드
---

> ?? 출처: 커뮤니티 사례 + 공식 쇼케이스 + 사용자 리서치  
> ??? 난이도: ?? 초급 / ?? 중급 / ?? 고급  
> ?? 총 60개 사례: 단계별 설정 가이드 포함

---

## ?? 초급 레벨 (1-25)

> 시작하기 전에: OpenClaw가 설치되어 있고, 기본 설정이 완료되어 있다고 가정합니다. [빠른 시작 가이드](/quickstart)를 참고하세요.

---

### ?? 이메일 & 메시지 자동화

#### 1. 맞춤형 아침 브리핑 (Morning Briefing) ??

?? 설명
매일 아침 정해진 시간(예: 6시 30분)에 이메일 요약, 오늘 일정, 관심 뉴스, 날씨, 어제 하던 작업의 맥락을 메신저로 자동 전송합니다. 하루를 시작하기 전 중요한 정보를 한눈에 확인할 수 있습니다.

?? 활용 효과
- 매일 15-20분 절약
- 중요한 이메일 놓침 방지
- 하루 계획 수립 시간 단축

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| email | 이메일 요약 | `clawhub install email` |
| calendar | 일정 확인 | `clawhub install calendar` |
| weather | 날씨 정보 | `clawhub install weather` |
| news | 뉴스 수집 | `clawhub install news` |

?? 주의: 스킬 설치 전 [보안 체크리스트](/security/skill-checklist) 확인 필수!

?? 단계별 설정 방법

1단계: 스킬 설치
```bash
clawhub install email calendar weather news
```

2단계: API 키 설정
```bash
openclaw config
```

```json
{
  "skills": {
    "email": {
      "provider": "gmail",
      "maxSummary": 5
    },
    "weather": {
      "location": "Seoul",
      "units": "metric"
    }
  }
}
```

3단계: 크론 작업 설정 (매일 6:30)
```bash
openclaw cron add "30 6 * * *" "briefing"
```

4단계: 브리핑 템플릿 작성
```javascript
// ~/.openclaw/skills/briefing/template.js
module.exports = async (agent) => {
  const email = await agent.email.getUnread({ limit: 5 });
  const calendar = await agent.calendar.getToday();
  const weather = await agent.weather.getCurrent();
  
  return `
?? 아침 브리핑

??? 날씨: ${weather.condition}, ${weather.temp}°C
?? 미확인 이메일: ${email.count}개
?? 오늘 일정: ${calendar.events.length}개
  `;
};
```

?? 사용 예시
```
User: 오늘 브리핑 해줘

OpenClaw: 
?? 아침 브리핑 (2월 25일 화요일)

??? 날씨: 맑음, 8°C
   체감온도 5°C, 강수확률 0%

?? 미확인 이메일: 3개
   - 중요: 1개 (boss@company.com)
   - 뉴스레터: 2개

?? 오늘 일정:
   10:00 팀 미팅
   14:00 클라이언트 통화
   16:00 코드 리뷰

?? 주요 뉴스:
   - OpenClaw 2026.2 업데이트
   - AI 규제 법안 통과

어제 하던 작업:
   - 마케팅 보고서 (80% 완료)
```

---

#### 2. 이메일 인박스 제로 (Inbox Zero) 관리 ??

?? 설명
수많은 이메일을 자동으로 분석하여 중요한 메일만 골라 요약하고, 뉴스레터는 자동으로 아카이브하며, 스팸은 정리합니다. 매일 수십 개씩 쌓이는 이메일에서 핵심만 추출하여 인박스를 깔끔하게 유지합니다.

?? 활용 효과
- 인박스 0개 유지
- 중요 메일 놓침 방지
- 메일 확인 시간 70% 단축

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| gmail | Gmail 연동 | `clawhub install gmail` |
| filter | 메일 필터링 | `clawhub install filter` |
| classifier | 메일 분류 AI | `clawhub install classifier` |

?? 단계별 설정 방법

1단계: Gmail API 인증
```bash
openclaw config
# 브라우저에서 Google 로그인 후 토큰 복사
```

2단계: 분류 규칙 설정
```json
{
  "gmail": {
    "rules": [
      {
        "condition": "from:*@newsletter.com",
        "action": "archive"
      },
      {
        "condition": "subject:URGENT",
        "action": "flag_important"
      },
      {
        "condition": "has:attachment AND size:>5MB",
        "action": "label:attachments"
      }
    ]
  }
}
```

3단계: 자동화 스크립트
```javascript
// inbox-zero.js
module.exports = async (agent) => {
  const emails = await agent.gmail.getUnread();
  
  for (const email of emails) {
    const category = await agent.classifier.categorize(email);
    
    switch(category) {
      case 'important':
        await agent.gmail.flag(email.id);
        await agent.notify(`?? 중요 메일: ${email.subject}`);
        break;
      case 'newsletter':
        await agent.gmail.archive(email.id);
        break;
      case 'spam':
        await agent.gmail.trash(email.id);
        break;
    }
  }
};
```

?? 사용 예시
```
User: 인박스 정리해줘

OpenClaw: 
?? 인박스 정리 완료

처리 결과:
- 중요 메일 플래그: 2개
  → "프로젝트 제안서 검토 요청"
  → "내일 미팅 장소 변경"
  
- 뉴스레터 아카이브: 12개
  → tech-daily@, marketing-weekly@ 등
  
- 스팸 삭제: 5개
  
남은 메일: 3개 (모두 중요)
```

---

#### 3. 자동 이메일 초안 작성 ??

?? 설명
내 평소 말투와 스타일을 학습하여 중요 메일에 대한 답장 초안을 자동으로 작성합니다. 사용자의 과거 이메일 패턴을 분석해 자연스러운 톤으로 초안을 만들어 제시합니다.

?? 활용 효과
- 답장 작성 시간 50% 단축
- 일관된 커뮤니케이션 톤 유지
- 번거로운 정중한 표현 자동 생성

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| gmail | Gmail 연동 | `clawhub install gmail` |
| memory | 사용자 스타일 학습 | `clawhub install memory` |
| composer | 메일 작성 AI | `clawhub install composer` |

?? 단계별 설정 방법

1단계: 스킬 설치
```bash
clawhub install gmail memory composer
```

2단계: 학습 데이터 제공
```bash
# 과거 메일 100개로 학습
openclaw memory index
```

3단계: 초안 생성 규칙
```json
{
  "composer": {
    "tone": "professional_but_friendly",
    "maxLength": 300,
    "signature": "\n\n감사합니다.\n[이름]"
  }
}
```

?? 사용 예시
```
User: 이 메일 답장 초안 써줘
(첨부: "회의 일정 변경" 메일)

OpenClaw:
?? 답장 초안 작성 완료

---
제목: RE: 회의 일정 변경

안녕하세요 김대리님,

메일 확인했습니다. 
수요일 오후 2시로 변경 확인했으며, 그 시간에 맞춰
회의실 B로 참석하겠습니다.

감사합니다.
홍길동
---

? 승인 후 전송 | ?? 수정 | ?? 다시 작성
```

---

### ?? 일정 & 생산성 관리

#### 4. 캘린더 자동 관리 ??

?? 설명
메신저에서 "다음 주 화요일 3시에 팀 미팅"이라고 말하면 자동으로 Google Calendar에 등록됩니다. 일정 충돌을 확인하고, 참석자에게 초대장을 보내며, 미팅 10분 전 알림을 제공합니다.

?? 활용 효과
- 일정 입력 시간 80% 단축
- 일정 충돌 사전 방지
- 자동 알림으로 지각 방지

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| calendar | 캘린더 연동 | `clawhub install calendar` |
| nlp | 자연어 파싱 | `clawhub install nlp` |
| reminder | 알림 설정 | `clawhub install reminder` |

?? 단계별 설정 방법

1단계: Google Calendar API 연동
```bash
openclaw config
```

2단계: 기본 캘린더 설정
```json
{
  "calendar": {
    "defaultCalendar": "primary",
    "reminderMinutes": [10, 60],
    "timezone": "Asia/Seoul"
  }
}
```

3단계: 명령어 예시
```
User: 내일 오후 2시에 팀 미팅 잡아줘

OpenClaw: 
?? 일정 등록 완료

제목: 팀 미팅
날짜: 2026년 2월 26일 (수)
시간: 14:00 - 15:00
장소: 미정

?? 충돌 감지: 13:30에 다른 미팅 있음
   30분 간격이 좁습니다. 15:00로 변경할까요?

User: 응 변경해줘

OpenClaw: 
? 변경 완료: 15:00 - 16:00
?? 알림 설정: 미팅 10분 전
```

---

#### 5. 할 일 목록(To-Do) 통합 관리 ??

?? 설명
Todoist, Notion, Google Tasks 등 여러 할 일 앱과 연동하여 채팅 한 줄로 일정을 추가하고 우선순위를 재구성합니다. 모든 할 일을 한 곳에서 관리하고, 마감일이 다가오면 자동으로 알림을 받습니다.

?? 활용 효과
- 여러 앱 간 할 일 동기화
- 우선순위 자동 조정
- 마감일 알림으로 미루기 방지

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| todoist | Todoist 연동 | `clawhub install todoist` |
| notion | Notion 연동 | `clawhub install notion` |
| tasks | Google Tasks 연동 | `clawhub install tasks` |

?? 단계별 설정 방법

1단계: 여러 서비스 연동
```bash
clawhub install todoist notion tasks
```

2단계: API 키 설정
```bash
openclaw config
openclaw config
```

3단계: 동기화 규칙
```json
{
  "tasks": {
    "sync": {
      "sources": ["todoist", "notion"],
      "master": "todoist",
      "conflict": "newest_wins"
    }
  }
}
```

?? 사용 예시
```
User: 할 일 추가: 마케팅 보고서 작성, 마감일 금요일

OpenClaw:
? 할 일 추가됨

제목: 마케팅 보고서 작성
마감일: 2월 28일 (금) 18:00
우선순위: 높음 (D-3)

?? 동기화 완료:
   - Todoist ?
   - Notion ?
   
?? 알림 설정:
   - 마감 1일 전 (2/27 오전 9시)
   - 마감 당일 (2/28 오후 2시)

?? 관련 노트:
   Notion에서 "마케팅 보고서 템플릿"을 찾았습니다.
   바로 열어볼까요?
```

---

### ?? 메모 & 기록 관리

#### 6. 두 번째 뇌(Second Brain) 구축 ??

?? 설명
번뜩이는 아이디어나 링크, 메모를 채팅으로 별낸 다음, 자동으로 맥락과 함께 분류하여 저장합니다. 나중에 검색할 때 관련성 높은 과거 기록도 함께 찾아주어 개인 지식베이스를 구축합니다.

?? 활용 효과
- 아이디어 유실 방지
- 관련 정보 자동 연결
- 검색 시간 단축

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| memory | 메모 저장 | `clawhub install memory` |
| notes | 노트 관리 | `clawhub install notes` |
| search | 벡터 검색 | `clawhub install search` |
| embedding | 의미 기반 임베딩 | `clawhub install embedding` |

?? 단계별 설정 방법

1단계: 저장소 설정 (Obsidian 권장)
```bash
clawhub install memory notes
# Obsidian 볼트 경로 설정
```

2단계: 자동 분류 설정
```json
{
  "memory": {
    "vault": "~/Documents/Obsidian/SecondBrain",
    "autoTag": true,
    "dailyNotes": true
  }
}
```

3단계: 메모 저장 예시
```
User: 아이디어: AI로 이력서 자동 분석해서 합격률 예측하는 서비스

OpenClaw:
?? 메모 저장 완료

?? 저장 위치: Inbox/아이디어.md
??? 자동 태그: #아이디어 #AI #서비스 #이력서
?? 유사 메모: 
   - "AI 면접 코치 앱 아이디어" (85% 유사)
   - "구직 매칭 플랫폼 구상" (72% 유사)

?? 다음 행동 제안:
   1. 시장조사 템플릿 열기
   2. 관련 기사 검색
   3. 경쟁사 분석
```

---

#### 7. 음성 메모 → 일기 자동 변환 ??

?? 설명
길 가다가 남긴 30초짜리 짧은 음성 메모를 AI가 전사하여 "오늘의 하이라이트" 형태로 멋진 일기로 정리합니다. 음성 톤에서 감정을 분석하고, 관련 사진을 자동으로 찾아 삽입합니다.

?? 활용 효과
- 일기 작성 부담 감소
- 일상 기록 습관 형성
- 음성 기반 빠른 입력

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| audio | 음성 녹음 | `clawhub install audio` |
| whisper | 음성 인식 | `clawhub install whisper` |
| notes | 노트 작성 | `clawhub install notes` |
| photos | 사진 검색 | `clawhub install photos` |

?? 단계별 설정 방법

1단계: 음성 인식 설정
```bash
clawhub install audio whisper notes
```

2단계: 일기 템플릿 설정
```json
{
  "diary": {
    "template": "daily-highlight",
    "includePhotos": true,
    "moodAnalysis": true
  }
}
```

?? 사용 예시
```
User: (음성 메모 30초)
"오늘 회사에서 프레젠테이션 잘 마쳤어. 
팀장님이 칭찬하셨고, 클라이언트도 만족한 것 같아. 
점심은 동료들이랑 새로 생긴 파스타집에서 먹었는데 맛있었어."

OpenClaw:
?? 오늘의 일기 (2월 25일 화요일)

?? 하이라이트:
프레젠테이션 성공적으로 마무리! 
팀장님의 칭찬과 클라이언트의 긍정적 반응을 얻었다.
업무 성취감이 큰 하루.

??? 오늘의 식사:
동료들과 함께한 파스타 - 만족스러운 점심 시간

?? 감정 분석: 긍정적 (85%)
   자신감, 성취감, 만족감

?? 오늘의 사진:
   (프레젠테이션 장면, 점심 사진 자동 연결)

? 한 줄 평:
"성취의 맛을 본 화요일"
```

---

#### 8. 영수증 사진 → 엑셀 자동 입력 ??

?? 설명
영수증 사진을 찍어 별낸 다음, 결제처, 날짜, 금액, 카테고리를 자동으로 인식하여 Google Sheets에 지출 내역을 입력합니다. 세무나 회계 정산 시 모든 영수증이 정리되어 있어 업무 효율이 크게 향상됩니다.

?? 활용 효과
- 영수증 정리 시간 90% 절약
- 실시간 지출 추적
- 세무 신고 시 증빙 자료 완비

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| vision | 이미지 인식 | `clawhub install vision` |
| ocr | 텍스트 추출 | `clawhub install ocr` |
| sheets | Google Sheets | `clawhub install sheets` |
| classifier | 카테고리 분류 | `clawhub install classifier` |

?? 단계별 설정 방법

1단계: 스킬 설치
```bash
clawhub install vision ocr sheets classifier
```

2단계: Google Sheets 설정
```bash
openclaw config
# 스프레드시트 ID와 연동
```

3단계: 자동화 규칙
```json
{
  "expense": {
    "spreadsheetId": "YOUR_SPREADSHEET_ID",
    "sheetName": "2026_Expenses",
    "categories": {
      "식비": ["restaurant", "cafe", "food"],
      "교통": ["taxi", "subway", "bus"],
      "업무": ["office", "stationery", "software"]
    }
  }
}
```

?? 사용 예시
```
User: (영수증 사진 첨부)

OpenClaw:
?? 영수증 분석 완료

?? 추출 정보:
- 상호: 스타벅스 강남점
- 날짜: 2026-02-25
- 금액: \8,500
- 품목: 카페라떼(Tall)

??? 카테고리: 식비/커피 (자동 분류)

? Google Sheets 저장 완료
   행 47에 추가됨

?? 이번 달 식비 현황:
   총 지출: \127,500
   예산 대비: 85% 사용
   ?? 예산 초과 예상 (3일 남음)
```

---

### ?? 정보 수집 & 모니터링

#### 9. 택배 및 배송 상태 추적 ??

?? 설명
여러 쇼핑몰의 배송 현황을 실시간으로 추적하고, 배송이 시작되거나 도착할 때, 문제 발생 시 자동으로 알림을 보내줍니다. 여러 택배사의 배송 정보를 한눈에 확인할 수 있습니다.

?? 활용 효과
- 배송 조회 시간 절약
- 실시간 배송 알림
- 배송 문제 조기 발견

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| tracking | 배송 추적 | `clawhub install tracking` |
| cron | 주기적 확인 | `clawhub install cron` |
| notify | 알림 발송 | `clawhub install notify` |

?? 단계별 설정 방법

1단계: 스킬 설치
```bash
clawhub install tracking cron notify
```

2단계: 추적할 택배 등록
```
User: 배송 추적: CJ대한통운 1234567890
상품명: 노트북 거치대
```

3단계: 알림 설정
```json
{
  "tracking": {
    "checkInterval": "30m",
    "notifications": {
      "pickedUp": true,
      "inTransit": false,
      "outForDelivery": true,
      "delivered": true,
      "exception": true
    }
  }
}
```

?? 사용 예시
```
OpenClaw (자동 알림):
?? 배송 상태 변경

상품: 노트북 거치대
택배사: CJ대한통운
운송장: 1234567890

?? 현재 상태: 배송 출발
?? 위치: 서울 강남 hub
? 예상 도착: 오늘 오후 3-5시

??? 실시간 위치 보기:
[지도 링크]
```

---

#### 10. 부재중 슬랙/팀즈 채널 요약 ??

?? 설명
자리를 비운 사이 대화가 많이 오간 시끄러운 업무 채널의 핵심 내용만 요약해서 알려줍니다. 100개가 넘는 메시지를 읽지 않고도 중요한 결정사항과 액션 아이템을 파악할 수 있습니다.

?? 활용 효과
- 업무 복귀 시간 단축
- 중요 결정사항 놓침 방지
- 팀 상황 빠른 파악

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| slack | Slack 연동 | `clawhub install slack` |
| teams | Teams 연동 | `clawhub install teams` |
| summarizer | 요약 AI | `clawhub install summarizer` |

?? 단계별 설정 방법

1단계: 스킬 설치 및 인증
```bash
clawhub install slack teams summarizer
openclaw config
```

2단계: 모니터링할 채널 설정
```json
{
  "slack": {
    "summarizeChannels": ["#general", "#dev-team"],
    "summaryThreshold": 20,
    "summaryFormat": "bullet_points"
  }
}
```

?? 사용 예시
```
User: 슬랙 #dev-team 채널 요약해줘 (점심시간 동안)

OpenClaw:
?? #dev-team 채널 요약 (12:00-14:00)

?? 총 메시지: 47개
?? 참여자: 8명

?? 중요 결정사항:
1. 배포 일정 변경: 목요일 → 금요일로 연기
   - 이유: 테스트 추가 필요
   - 결정자: @팀장

2. 새로운 라이브러리 도입 승인
   - React Query 도입하기로 합의
   - 마이그레이션 담당: @김개발

?? 액션 아이템:
- [ ] @김개발: React Query POC 작성 (내일까지)
- [ ] @이기획: 배포 체크리스트 업데이트
- [ ] @박디자인: 로딩 스피너 디자인 검토

? 내가 답변해야 할 질문:
- "API 엔드포인트 언제 나옴?" (13:45)
  → 답변 필요!
```

---

### ?? 스마트홈 & 라이프스타일

#### 11. 스마트홈 자연어 제어 ??

?? 설명
"거실 불 꺼" "에어컨 24도로 해줘"와 같은 자연어 명령으로 Home Assistant나 IoT 기기를 제어합니다. 앱을 열 필요 없이 메신저로 집안의 모든 기기를 제어할 수 있습니다.

?? 활용 효과
- 앱 전환 없는 빠른 제어
- 가족 공용 AI 리모컨
- 음성/텍스트 모두 지원

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| homeassistant | HA 연동 | `clawhub install homeassistant` |
| iot | IoT 제어 | `clawhub install iot` |
| nlp | 명령어 파싱 | `clawhub install nlp` |

?? 단계별 설정 방법

1단계: Home Assistant 설정
```bash
clawhub install homeassistant
openclaw config
# HA URL과 Long-lived access token 입력
```

2단계: 기기 등록
```json
{
  "homeassistant": {
    "url": "http://homeassistant.local:8123",
    "token": "YOUR_TOKEN",
    "rooms": {
      "거실": ["light.living_room", "climate.living_ac"],
      "침실": ["light.bedroom", "fan.bedroom"]
    }
  }
}
```

?? 사용 예시
```
User: 거실 불 꺼고 에어컨 24도로 해줘

OpenClaw:
?? 스마트홈 명령 실행

거실:
? 전등 끔 (Philips Hue x3)
? 에어컨 설정: 24°C, 냉방 모드
   - 현재 온도: 27°C
   - 예상 도달 시간: 15분

?? 제안:
   외출 모드로 전환할까요? 
   (모든 불 끄고, 보안 모드 활성화)

User: 응 외출할거야

OpenClaw:
?? 외출 모드 활성화

? 모든 조명 OFF
? 에어컨 OFF
?? 현관 잠금 확인
?? 보안 카메라 녹화 시작
?? 이상 감지 시 알림 설정
```

---

#### 12. 가족 공용 AI 비서 (iMessage) ??

?? 설명
애플의 iMessage와 연동해 가족들이 따로 앱을 설치하거나 가입할 필요 없이 문자로 AI 비서를 편하게 활용합니다. 가족 공용 쇼핑 리스트, 일정 공유, 알림 등을 문자로 관리할 수 있습니다.

?? 활용 효과
- 가족 모두가 익숙한 문자 인터페이스
- 별도 앱 설치 불필요
- 실시간 가족 공유 기능

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| imessage | iMessage 연동 | `clawhub install imessage` |
| bluebubbles | BlueBubbles 연동 | `clawhub install bluebubbles` |
| family | 가족 관리 | `clawhub install family` |

?? 단계별 설정 방법

1단계: BlueBubbles 서버 설정 (Mac 필요)
```bash
# Mac에서 BlueBubbles 서버 설치
# https://bluebubbles.app

clawhub install bluebubbles
openclaw config
```

2단계: 가족 그룹 설정
```json
{
  "family": {
    "members": [
      { "name": "아빠", "phone": "+821012345678" },
      { "name": "엄마", "phone": "+821098765432" },
      { "name": "아들", "phone": "+821011223344" }
    ],
    "sharedLists": ["장보기", "할일", "약속"]
  }
}
```

?? 사용 예시
```
엄마 (iMessage): 우유 사와

OpenClaw:
?? 쇼핑 리스트에 추가했습니다

?? 장보기 목록:
?? 우유
? 계란
? 빵
? 휴지

?? 공유 중: 아빠, 엄마, 아들

[아빠] 님이 장을 보러 가는 중입니다.
목록을 확인하고 필요한 것을 추가하세요!
```

---

### ?? 콘텐츠 & 미디어 변환

#### 13. 스크린샷 → Markdown 자동 변환 ??

?? 설명
특정 영역을 캡처하면 이미지에서 텍스트와 구조를 인식하여 마크다운 형식으로 자동 변환합니다. 문서 작성, 회의록 정리, 자료 정리 시 매우 유용합니다.

?? 활용 효과
- 문서 작성 시간 60% 단축
- 표/코드 블록 정확한 변환
- 클립보드에 바로 복사

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| screenshot | 화면 캡처 | `clawhub install screenshot` |
| vision | 이미지 분석 | `clawhub install vision` |
| markdown | 마크다운 변환 | `clawhub install markdown` |
| clipboard | 클립보드 | `clawhub install clipboard` |

?? 단계별 설정 방법

1단계: 핫키 설정
```bash
clawhub install screenshot vision markdown clipboard

# 설정: Ctrl+Shift+S 로 활성화
openclaw config
```

2단계: 변환 규칙
```json
{
  "screenshot": {
    "hotkey": "ctrl+shift+s",
    "autoConvert": true,
    "output": "clipboard",
    "preserveFormatting": true
  }
}
```

?? 사용 예시
```
User: (웹사이트 표 영역 캡처)

OpenClaw:
?? 스크린샷 변환 완료

?? 마크다운 변환 결과:

| 제품 | 가격 | 재고 |
|------|------|------|
| MacBook Pro | \2,500,000 | 있음 |
| MacBook Air | \1,500,000 | 없음 |
| iMac | \2,000,000 | 있음 |

? 클립보드에 복사 완료
?? 인식 정확도: 98%

?? 팁: 표 형식을 코드 블록으로 변환하려면 "코드로 변환"이라고 말하세요.
```

---

#### 14. 다국어 실시간 번역 ??

?? 설명
해외 클라이언트나 친구와 소통할 때, 메신저 상에서 실시간으로 자연스러운 번역을 제공합니다. 비즈니스 메일, 문서, 채팅 모두 번역 가능하며, 전문 용어 사전도 학습할 수 있습니다.

?? 활용 효과
- 언어 장벽 해소
- 비즈니스 커뮤니케이션 원활
- 전문 문서 번역 시간 단축

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| translate | 번역 엔진 | `clawhub install translate` |
| deepl | DeepL API | `clawhub install deepl` |
| glossary | 용어 사전 | `clawhub install glossary` |

?? 단계별 설정 방법

1단계: 번역 스킬 설정
```bash
clawhub install translate deepl
openclaw config
```

2단계: 언어 쌍 설정
```json
{
  "translate": {
    "defaultSource": "auto",
    "defaultTarget": "ko",
    "pairs": [
      { "from": "en", "to": "ko" },
      { "from": "ko", "to": "en" },
      { "from": "ja", "to": "ko" }
    ],
    "formality": "business"
  }
}
```

?? 사용 예시
```
User: 번역: Please find the attached proposal for your review.

OpenClaw:
?? 번역 완료

영어 → 한국어:
"검토를 위해 첨부된 제안서를 확인해 주시기 바랍니다."

?? 대체 번역:
- 정식: "첨부된 제안서를 검토해 주시면 감사하겠습니다."
- 간결: "첨부 제안서 검토 부탁드립니다."

?? 전문 용어:
- proposal: 제안서, 기획안
- review: 검토, 심사

?? 용어 사전에 추가할까요?
```

---

## ?? 중급 레벨 (26-50)

> 권장: 초급 사례 3개 이상 경험 후 도전하세요. 추가 설정과 API 키가 필요합니다.

---

### ?? 업무 & 비즈니스 자동화

#### 15. 회의 녹음 전사 + 액션 아이템 추출 ??

?? 설명
Zoom 회의나 오프라인 미팅의 녹음 파일을 업로드하면 화자를 구분하여 전사하고, 핵심 내용을 요약하며, 액션 아이템(할 일, 담당자, 마감일)을 자동으로 추출합니다.

?? 활용 효과
- 회의록 작성 시간 80% 절약
- 액션 아이템 누락 방지
- 화자별 발언 내용 추적

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| audio | 오디오 처리 | `clawhub install audio` |
| whisper | 음성 인식 | `clawhub install whisper` |
| speaker-diarization | 화자 구분 | `clawhub install speaker-diarization` |
| summarizer | 요약 | `clawhub install summarizer` |
| tasks | 할 일 관리 | `clawhub install tasks` |

?? 단계별 설정 방법

1단계: 고급 음성 처리 설정
```bash
clawhub install audio whisper speaker-diarization summarizer tasks
```

2단계: 회의 템플릿 설정
```json
{
  "meeting": {
    "template": "business",
    "diarization": true,
    "minDuration": 60,
    "extractActions": true,
    "participants": {
      "recognition": true,
      "voiceProfiles": {
        "김대리": "voice_kim.wav",
        "이과장": "voice_lee.wav"
      }
    }
  }
}
```

3단계: 후처리 규칙
```javascript
// meeting-processor.js
module.exports = async (agent, transcript) => {
  // 액션 아이템 추출
  const actions = await agent.nlp.extractActions(transcript.text);
  
  // 담당자 매핑
  for (const action of actions) {
    if (action.assignee === 'unknown') {
      action.assignee = await agent.memory.findPerson(action.context);
    }
  }
  
  return {
    summary: transcript.summary,
    actions: actions,
    decisions: transcript.decisions
  };
};
```

?? 사용 예시
```
User: (회의 녹음 파일 25분 첨부)

OpenClaw:
??? 회의 전사 완료

?? 분석 결과:
- 총 시간: 25분 30초
- 화자: 4명 (김대리, 이과장, 박차장, 외부 김상무)
- 발언량: 이과장(40%), 박차장(25%), 김대리(20%), 김상무(15%)

?? 요약:
Q2 마케팅 전략 회의. 
신규 캠페인 2개 승인, 예산 \5억 확정.
박차장이 총괄하며 3월 첫째 주 론칭 예정.

? 액션 아이템:

1. ?? 캠페인 기획안 작성
   담당: 김대리
   마감: 3월 1일
   내용: SNS 캠페인 기획안 초안

2. ?? 예산 세부안 산출
   담당: 이과장
   마감: 2월 28일
   내용: 채널별 예산 배분표

3. ?? 외부 에이전시 계약
   담당: 박차장
   마감: 3월 5일
   내용: 3사 견적 비교 후 계약

?? 자동 발송 완료:
   - 참석자 전원에게 회의록 전송
   - 액션 아이템 담당자에게 개별 알림

?? Notion에 회의록 저장 완료
   링크: [회의록 페이지]
```

---

#### 16. GitHub PR 코드 리뷰 자동화 ??

?? 설명
GitHub PR 링크를 주면 변경사항을 분석하여 코드 품질 문제점을 지적하고, 리뷰 코멘트 초안을 작성하며, 승인/거부 판단까지 Telegram이나 Slack으로 전송합니다.

?? 활용 효과
- 코드 리뷰 시간 50% 단축
- 일관된 리뷰 품질
- 보안 취약점 조기 발견

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| github | GitHub API | `clawhub install github` |
| code-review | 코드 분석 | `clawhub install code-review` |
| security | 보안 검사 | `clawhub install security` |
| telegram | Telegram 알림 | `clawhub install telegram` |

?? 단계별 설정 방법

1단계: GitHub 연동
```bash
clawhub install github code-review security telegram
openclaw config
# GitHub Personal Access Token (repo 권한)
```

2단계: 리뷰 규칙 설정
```json
{
  "github": {
    "webhook": {
      "events": ["pull_request"],
      "url": "https://your-openclaw-instance/github-webhook"
    }
  },
  "codeReview": {
    "checks": [
      "syntax",
      "style",
      "security",
      "performance",
      "test-coverage"
    ],
    "severity": "warning",
    "autoComment": false
  }
}
```

3단계: PR 워크플로우
```javascript
// pr-review.js
module.exports = async (agent, pr) => {
  // 코드 분석
  const analysis = await agent.codeReview.analyze(pr.diff);
  
  // 보안 검사
  const security = await agent.security.scan(pr.diff);
  
  // 리뷰 초안 생성
  const review = {
    summary: analysis.summary,
    issues: [...analysis.issues, ...security.vulnerabilities],
    suggestions: analysis.suggestions,
    approve: analysis.score > 80 && !security.critical
  };
  
  // Telegram으로 전송
  await agent.telegram.send(process.env.REVIEW_CHAT_ID, formatReview(review));
  
  return review;
};
```

?? 사용 예시
```
GitHub Webhook (자동):
?? 새 PR 생성됨
Repo: mycompany/web-app
PR: #123 기능: 결제 모듈 추가
작성자: @dev-junior

OpenClaw (자동 리뷰):
?? PR 리뷰 완료: #123

?? 코드 품질 점수: 72/100

?? 발견된 문제:

[보안] CRITICAL
- 하드코딩된 API 키 발견 (src/config.js:15)
  → 환경 변수로 이동 필요

[코드품질] WARNING x3
- 중복 코드: 결제 검증 로직 (utils.js:45, 89)
  → 별도 함수로 추출 권장
- 주석 없는 복잡한 로직 (payment.js:120-150)
- 테스트 누락: 새로운 3개 함수

[성능] INFO
- 데이터베이스 쿼리 N+1 문제 가능성
  → eager loading 고려

? 개선 제안:
1. API 키 즉시 제거 후 환경 변수 사용
2. 중복 로직 리팩토링
3. 테스트 코드 추가 (최소 80% 커버리지)

?? AI 리뷰어 판단: CHANGES_REQUESTED
   수동 리뷰 필요: 보안 이슈 존재

[리뷰하러 가기] [변경사항 보기] [코멘트 작성]
```

---

#### 17. 신규 고객 온보딩 풀 자동화 ??

?? 설명
새 고객 정보가 입력되면 폴더 생성 → 환영 이메일 발송 → 미팅 예약 → 태스크 생성 → CRM 업데이트까지 자동으로 처리합니다. 고객이 전화를 끊는 순간 모든 준비가 완료됩니다.

?? 활용 효과
- 온보딩 시간 80% 단축
- 고객 경험 향상
- 업무 누락 방지

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| crm | CRM 연동 | `clawhub install crm` |
| email | 이메일 발송 | `clawhub install email` |
| calendar | 캘린더 예약 | `clawhub install calendar` |
| drive | 구글 드라이브 | `clawhub install drive` |
| tasks | 할 일 관리 | `clawhub install tasks` |

?? 단계별 설정 방법

1단계: 통합 설정
```bash
clawhub install crm email calendar drive tasks
openclaw config
openclaw config
```

2단계: 온보딩 워크플로우
```json
{
  "onboarding": {
    "trigger": "crm.new_customer",
    "steps": [
      {
        "action": "createFolder",
        "path": "Customers/{customer.name}",
        "template": "customer_template"
      },
      {
        "action": "sendEmail",
        "template": "welcome",
        "delay": 0
      },
      {
        "action": "createTask",
        "assignee": "account_manager",
        "title": "{customer.name} 초기 미팅 준비"
      },
      {
        "action": "scheduleMeeting",
        "type": "kickoff",
        "within": "3_days"
      }
    ]
  }
}
```

?? 사용 예시
```
CRM (자동 트리거):
?? 신규 고객 등록: (주)테크솔루션
담당자: 김대표
이메일: ceo@techsol.com
업종: IT 서비스
규모: 50명

OpenClaw (자동 실행):
?? 온보딩 프로세스 시작

1?? 폴더 생성 ?
   구글 드라이브: /Customers/테크솔루션/
   - 계약서/
   - 미팅노트/
   - 자료/

2?? 환영 이메일 발송 ?
   수신: ceo@techsol.com
   제목: 환영합니다! 함께 성장해 나가요
   템플릿: enterprise_welcome

3?? 태스크 생성 ?
   - [ ] 계정 매니저 배정 (김과장 자동 할당)
   - [ ] 초기 니즈 분석 (3일 내)
   - [ ] 맞춤 솔루션 제안서 작성 (1주일 내)

4?? 미팅 예약 ?
   종류: 킥오프 미팅
   제안: 2월 28일 오전 10시, 3월 1일 오후 2시
   (고객에게 캘린더 초대 발송)

5?? CRM 업데이트 ?
   상태: 온보딩 진행 중
   다음 액션: 킥오프 미팅
   예상 매출: \5,000,000/월

?? 총 소요 시간: 45초
```

---

### ?? 개발 & DevOps 자동화

#### 18. DevOps 반복업무 메신저 자동화 ??

?? 설명
에러 로그 모니터링, 의존성 업데이트 알림, 서버 상태 체크 등 반복적인 DevOps 작업을 터미널 없이 메신저로 처리합니다. 서버 문제 발생 시 즉시 알림을 받고 간단한 명령으로 대응할 수 있습니다.

?? 활용 효과
- 장애 대응 시간 단축
- 반복 작업 자동화
- 24/7 모니터링

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| monitoring | 서버 모니터링 | `clawhub install monitoring` |
| logs | 로그 분석 | `clawhub install logs` |
| terminal | 명령 실행 | `clawhub install terminal` |
| slack | Slack 알림 | `clawhub install slack` |

?? 단계별 설정 방법

1단계: 모니터링 설정
```bash
clawhub install monitoring logs terminal slack
```

2단계: 알림 규칙
```json
{
  "monitoring": {
    "servers": [
      {
        "name": "production-api",
        "host": "api.example.com",
        "checks": ["cpu", "memory", "disk", "http"]
      }
    ],
    "alerts": {
      "cpu": { "threshold": 80, "duration": "5m" },
      "memory": { "threshold": 90, "duration": "3m" },
      "disk": { "threshold": 85, "duration": "1m" }
    }
  }
}
```

?? 사용 예시
```
OpenClaw (자동 알림):
?? 장애 감지: production-api

CPU 사용률: 85% (임계값: 80%)
지속 시간: 6분

?? 자동 분석:
- 상위 프로세스: node (PID 1234) - 60%
- 최근 배포: v2.3.1 (2시간 전)
- 에러 로그 증가: 400% (지난 30분)

?? 추정 원인:
   v2.3.1 배포 후 메모리 누수 가능성

?? 자동 조치 제안:
[1. 서버 재시작] [2. 이전 버전 롤백] [3. 스케일업]

User: 2번 해줘

OpenClaw:
?? 롤백 시작: v2.3.1 → v2.3.0

1. 롤백 확인 ?
2. 배포 중... ?
3. 헬스체크 대기... ?
4. 완료 ?

? 롤백 완료 (3분 20초)
CPU 정상화: 85% → 35%

?? 사후 조치:
- v2.3.1 메모리 누수 조사 필요
- 개발팀에 알림 발송 완료
```

---

#### 19. 서버·홈랩 헬스 체크 & 자가 치유 ??

?? 설명
CPU, 메모리, 디스크 사용량을 지속적으로 모니터링하고, 이상이 감지되면 자동으로 알림을 보내고 재시작이나 롤백 등의 조치를 취합니다. 무인 운영이 가능한 자가 치유 시스템을 구축합니다.

?? 활용 효과
- 24/7 서버 안정성 확보
- 장애 자동 복구
- 관리자 개입 최소화

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| health | 헬스 체크 | `clawhub install health` |
| docker | Docker 관리 | `clawhub install docker` |
| systemd | 서비스 관리 | `clawhub install systemd` |
| healing | 자동 복구 | `clawhub install healing` |

?? 단계별 설정 방법

1단계: 헬스 체크 설정
```bash
clawhub install health docker systemd healing
```

2단계: 자가 치유 정책
```json
{
  "healing": {
    "policies": [
      {
        "condition": "cpu > 90% for 5m",
        "action": "restart",
        "service": "heavy-process",
        "notify": true
      },
      {
        "condition": "disk > 85%",
        "action": "cleanup",
        "script": "/scripts/cleanup-logs.sh"
      },
      {
        "condition": "http != 200",
        "action": "rollback",
        "deployment": "api-server"
      }
    ]
  }
}
```

?? 사용 예시
```
OpenClaw (자동 감지):
?? 헬스 체크 경고: homeserver

디스크 사용량: 87% (임계값: 85%)
마운트: /var/log

?? 자동 조치 실행:
로그 파일 정리 (30일 이전)

실행 중...
- nginx access.log.1 삭제: 2.1GB
- app/debug.log 삭제: 1.3GB
- docker 로그 회전: 800MB

? 정리 완료
디스크 사용량: 87% → 62%
회복량: 4.2GB

?? 관리자 알림 발송 완료
```

---

### ?? 스마트홈 & IoT (고급)

#### 20. Home Assistant 고급 연동 ??

?? 설명
OpenClaw를 Home Assistant OS에서 운영하고, 복잡한 자동화 규칙을 자연어로 제어합니다. "점심시간에 에어컨 켜고, 퇴근하면 불 켜줘" 같은 복합 조건을 쉽게 설정할 수 있습니다.

?? 활용 효과
- 복잡한 자동화 규칙 자연어 설정
- 여러 기기 연동
- 상황 인지형 스마트홈

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| homeassistant | HA 연동 | `clawhub install homeassistant` |
| automation | 자동화 규칙 | `clawhub install automation` |
| geolocation | 위치 기반 | `clawhub install geolocation` |
| time | 시간 기반 | `clawhub install time` |

?? 단계별 설정 방법

1단계: HA Add-on 설치
```bash
# Home Assistant에서
# 설정 → 애드온 → OpenClaw 설치

clawhub install homeassistant automation geolocation time
```

2단계: 복합 자동화 규칙
```javascript
// advanced-automation.js
module.exports = {
  name: "점심시간 에어컨 + 퇴근 불",
  triggers: [
    { type: "time", at: "12:00", if: "home" },
    { type: "geolocation", enter: "home_zone", after: "18:00" }
  ],
  actions: [
    { device: "climate.living_room", state: "on", temp: 24 },
    { device: "light.entrance", state: "on", brightness: 80 }
  ]
};
```

?? 사용 예시
```
User: 새 자동화 만들어줘

OpenClaw:
?? 새 자동화 생성

무엇을 만들까요?
[1. 시간 기반] [2. 위치 기반] [3. 센서 기반] [4. 복합 조건]

User: 4번

OpenClaw:
복합 조건 자동화

조건 1: 언제?
- 특정 시간
- 일출/일몰
- 센서 감지
- 위치 변화

User: 특정 시간이랑 위치 둘 다

OpenClaw:
조건 구성:
- 매일 12:00 AND 집에 있을 때
- OR 퇴근 후 집에 도착했을 때 (18:00 이후)

동작:
- 에어컨 24도 ON
- 현관 불 켜기 (80% 밝기)
- 환영 메시지 재생

이대로 저장할까요?
[저장] [수정] [취소]
```

---

### ?? 콘텐츠 제작 & 마케팅

#### 21. 콘텐츠 멀티 플랫폼 재활용 ??

?? 설명
하나의 포스트를 입력하면 X(트위터) 스레드, LinkedIn, Instagram 캡션, YouTube Shorts 스크립트 등 각 플랫폼에 맞게 자동으로 변환합니다. 한 번의 글쓰기로 모든 채널을 커버합니다.

?? 활용 효과
- 콘텐츠 제작 시간 70% 단축
- 플랫폼별 최적화
- 일관된 브랜딩 유지

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| content | 콘텐츠 생성 | `clawhub install content` |
| twitter | X(Twitter) | `clawhub install twitter` |
| linkedin | LinkedIn | `clawhub install linkedin` |
| instagram | Instagram | `clawhub install instagram` |
| youtube | YouTube | `clawhub install youtube` |

?? 단계별 설정 방법

1단계: 소셜 미디어 연동
```bash
clawhub install content twitter linkedin instagram youtube
openclaw config
openclaw config
```

2단계: 브랜드 설정
```json
{
  "content": {
    "brand": {
      "tone": "professional_but_casual",
      "hashtags": ["#TechLife", "#Developer"],
      "emoji": true
    },
    "platforms": {
      "twitter": { "maxLength": 280, "thread": true },
      "linkedin": { "maxLength": 3000, "professional": true },
      "instagram": { "maxLength": 2200, "visual": true }
    }
  }
}
```

?? 사용 예시
```
User: 블로그 글 멀티플랫폼 변환해줘
(첨부: "OpenClaw로 개발 생산성 2배 높이기" 블로그)

OpenClaw:
?? 텐츠 재활용 완료

?? X (Twitter) - 스레드:
Tweet 1/5 ??
OpenClaw로 개발 생산성 2배 높이는 방법

AI 비서가 코드 리뷰부터 배포까지 자동화해줍니다.

#개발 #생산성 #OpenClaw

[2/5] ...

?? LinkedIn:
AI 시대의 개발자 생산성 혁명 ??

최근 OpenClaw를 도입하여 개발 워크플로우를 자동화했습니다.
그 결과...
(전문 2800자)

#개발 #AI #생산성 #테크

?? Instagram:
? AI 비서와 함께하는 개발 라이프

개발 → 코드 리뷰 → 배포
이 모든 게 메신저로 가능하다면?

링크 in bio ??

#개발자 #개발일상 #AI #생산성

?? YouTube Shorts 스크립트:
[0:00] Hook: "이렇게 개발하면 생산성 2배"
[0:05] Problem: "코드 리뷰, 배포, 모니터링..."
[0:15] Solution: "OpenClaw가 한 번에"
[0:25] CTA: "댓글로 알려줘"

? 검토 후 게시하시겠습니까?
[X에 게시] [LinkedIn에 게시] [Instagram에 게시] [모두 게시]
```

---

#### 22. 브랜드 멘션 실시간 모니터링 ??

?? 설명
X(트위터), Reddit 등에서 브랜드나 키워드가 언급되면 실시간으로 감지하고, 감정 분석(긍정/부정/중립)을 수행하며, 매일 리포트를 전송합니다. 위기 상황을 조기에 발견할 수 있습니다.

?? 활용 효과
- 실시간 브랜드 모니터링
- 감성 분석 트렌드 파악
- 위기 대응 시간 단축

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| monitoring | 소셜 모니터링 | `clawhub install monitoring` |
| sentiment | 감성 분석 | `clawhub install sentiment` |
| twitter | X API | `clawhub install twitter` |
| reddit | Reddit API | `clawhub install reddit` |
| report | 리포트 생성 | `clawhub install report` |

?? 단계별 설정 방법

1단계: 모니터링 설정
```bash
clawhub install monitoring sentiment twitter reddit report
```

2단계: 키워드 설정
```json
{
  "brandMonitoring": {
    "keywords": ["MyCompany", "@mycompany", "#myproduct"],
    "competitors": ["CompetitorA", "CompetitorB"],
    "platforms": ["twitter", "reddit"],
    "alertThreshold": {
      "negative": 0.7,
      "volume": 100
    },
    "report": {
      "daily": true,
      "time": "09:00"
    }
  }
}
```

?? 사용 예시
```
OpenClaw (실시간 알림):
?? 긴급: 부정적 멘션 급증

키워드: @mycompany
플랫폼: Twitter
감성: 매우 부정적 (0.85)

?? 원문:
"@mycompany 이번 업데이트 개판이네요 
제대로 테스트 안 했나요? 데이터 다 날아갔어요"

?? 상황 분석:
- 유저 팔로워: 5,000+
- 리트윗: 23회 (10분 내)
- 유사 멘션: 5건 추가 감지

?? 위험도: HIGH
추천 조치: 즉시 답변 및 조사

[빠른 답변 보내기] [내부에 알림] [상세 분석 보기]

---

OpenClaw (일일 리포트):
?? 브랜드 모니터링 리포트 (2월 24일)

?? 전체 멘션: 234건 (+12%)
?? 긍정: 156건 (67%)
?? 중립: 58건 (25%)
?? 부정: 20건 (8%)

?? 핫 토픽:
1. 신기능 출시 (긍정 89%)
2. 가격 정책 (부정 45%)
3. 고객 지원 (긍정 78%)

?? 경쟁사 비교:
- MyCompany: 67% 긍정
- CompetitorA: 54% 긍정
- CompetitorB: 61% 긍정

?? 액션 아이템:
- 가격 관련 부정 의견 조사 필요
- 신기능 마케팅 강화 권장
```

---

## ?? 고급 레벨 (51-60)

> 전제조건: 중급 사례 5개 이상 경험, 프로그래밍 지식, 서버 관리 능력 필요

---

### ?? 멀티 에이전트 & 자율 운영

#### 23. 멀티 에이전트 드림팀 ??

?? 설명
하나의 요청을 오케스트레이터가 Builder, Reviewer, Deployer 등 전문화된 에이전트에게 나누어 3분 만에 완료하는 시스템입니다. 소프트웨어 개발 전 과정을 AI 에이전트가 협업하여 처리합니다.

?? 활용 효과
- 개발 속도 10배 향상
- 24/7 자동 개발 파이프라인
- 인적 오류 최소화

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| orchestrator | 작업 분배 | `clawhub install orchestrator` |
| builder | 코드 생성 | `clawhub install builder` |
| reviewer | 코드 리뷰 | `clawhub install reviewer` |
| tester | 테스트 | `clawhub install tester` |
| deployer | 배포 | `clawhub install deployer` |

?? 단계별 설정 방법

1단계: 에이전트 프로필 생성
```bash
# 각 에이전트용 프로필 생성
openclaw agents add builder
openclaw agents add reviewer
openclaw agents add deployer
```

2단계: 오케스트레이터 설정
```javascript
// orchestrator-config.js
module.exports = {
  agents: {
    builder: {
      profile: 'builder',
      role: 'Generate code based on requirements',
      tools: ['github', 'code-gen', 'docs']
    },
    reviewer: {
      profile: 'reviewer',
      role: 'Review code for quality and security',
      tools: ['github', 'security-scan', 'lint']
    },
    deployer: {
      profile: 'deployer',
      role: 'Deploy to staging and production',
      tools: ['docker', 'k8s', 'ci-cd']
    }
  },
  workflow: [
    { step: 1, agent: 'builder', action: 'implement' },
    { step: 2, agent: 'reviewer', action: 'review', parallel: false },
    { step: 3, agent: 'deployer', action: 'deploy', condition: 'review.passed' }
  ]
};
```

?? 사용 예시
```
User: @orchestrator 로그인 기능에 2FA 추가해줘

Orchestrator:
?? 워크플로우 시작: add-2fa-login

━━━━━━━━━━━━━━━━━━━━━━
STEP 1/3: 빌드
━━━━━━━━━━━━━━━━━━━━━━

Builder ???:
요청 분석 중...
- 기능: 로그인에 2FA 추가
- 기술 스택: React, Node.js, PostgreSQL
- 예상 파일: 5개

코드 생성 중... ?
? 완료:
- auth/two-factor.js (새로운)
- components/TwoFactorForm.jsx (새로운)
- api/login.js (수정)
- database/migrations/003_add_2fa.sql (새로운)
- tests/auth.2fa.test.js (새로운)

커밋: "feat: add 2FA to login"
브랜치: feature/add-2fa-234

━━━━━━━━━━━━━━━━━━━━━━
STEP 2/3: 리뷰
━━━━━━━━━━━━━━━━━━━━━━

Reviewer ??:
코드 분석 중...

? 품질: 92/100
? 보안: 통과 (OWASP 기준)
?? 경고: 2개 (사소)
   - console.log 남아있음
   - 주석 추가 권장

리뷰 코멘트 작성 완료
승인: YES

━━━━━━━━━━━━━━━━━━━━━━
STEP 3/3: 배포
━━━━━━━━━━━━━━━━━━━━━━

Deployer ??:
스테이징 배포 중... ?
헬스체크 중... ?

스테이징 URL: https://staging.example.com
테스트 실행 중... ? (127/127 통과)

프로덕션 배포 중... ?
완료! ?

━━━━━━━━━━━━━━━━━━━━━━

?? 워크플로우 완료 (2분 45초)

변경사항:
- PR #234 생성 및 머지
- 프로덕션 배포 완료
- 모니터링 활성화

?? 메트릭:
- 코드 커버리지: 94%
- 보안 스캔: 통과
- 배포 소요: 45초

[모니터링 보기] [롤백] [성능 테스트]
```

---

#### 24. 개발자 워크플로우 전체 자동화 ??

?? 설명
"이 기능 추가해"라고 말하면 코드 작성 → 테스트 → PR 생성 → 코드 리뷰 → 배포까지 모든 과정을 AI가 혼자 처리합니다. 개발자는 요구사항만 설명하고 결과를 검증하기만 하면 됩니다.

?? 활용 효과
- 개발 주기 80% 단축
- 아이디어 → 프로덕션 1시간 이내
- 반복 작업 제로

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| fullstack | 풀스택 개발 | `clawhub install fullstack` |
| testing | 테스트 작성 | `clawhub install testing` |
| cicd | CI/CD | `clawhub install cicd` |
| github | GitHub 관리 | `clawhub install github` |

?? 단계별 설정 방법

1단계: 개발 환경 설정
```bash
clawhub install fullstack testing cicd github
```

2단계: 프로젝트 템플릿
```json
{
  "project": {
    "name": "my-app",
    "stack": {
      "frontend": "react",
      "backend": "node",
      "database": "postgres"
    },
    "standards": {
      "testing": true,
      "typescript": true,
      "linting": "strict"
    }
  }
}
```

?? 사용 예시
```
User: 사용자 프로필 페이지 만들어줘
- 이름, 이메일, 프로필 사진 표시
- 수정 가능해야 함
- 모바일 반응형

OpenClaw:
?? 전체 개발 워크플로우 시작

[1/5] 요구사항 분석 ?
- 페이지: 사용자 프로필
- 기능: 조회, 수정, 사진 업로드
- 반응형: 모바일 우선

[2/5] 코드 작성 ? (3분)
파일 생성:
- frontend/src/pages/Profile.jsx
- frontend/src/components/ProfileForm.jsx
- frontend/src/components/AvatarUpload.jsx
- backend/src/routes/profile.js
- backend/src/models/User.js
- database/migrations/004_profile_fields.sql
- tests/profile.test.js

[3/5] 테스트 작성 및 실행 ? (2분)
- 단위 테스트: 12개 작성
- 통합 테스트: 4개 작성
- E2E 테스트: 2개 작성
- 커버리지: 91%
- 결과: ? 모두 통과

[4/5] PR 생성 및 리뷰 ? (1분)
- PR #235: "feat: add user profile page"
- 자동 리뷰: 통과
- 체크: 통과 (8/8)

[5/5] 배포 ? (2분)
- 스테이징: ?
- 프로덕션: ?
- 모니터링: 활성화

━━━━━━━━━━━━━━━━━━━━━━
?? 완료! (총 8분)

?? 결과물:
- 프로덕션: https://app.example.com/profile
- 스토리북: https://storybook.example.com/profile
- 테스트 리포트: [링크]

? 핵심 기능:
- 반응형 프로필 페이지
- 실시간 이메일 유효성 검사
- 이미지 드래그 앤 드롭 업로드
- 낙관적 업데이트

?? 기술 스택:
- React 18 + TypeScript
- React Query
- AWS S3 (이미지)
- Jest + React Testing Library

?? 성능:
- First Contentful Paint: 0.8s
- Lighthouse: 95점
- 번들 크기: 42KB

[바로 확인하기] [수정 요청] [다음 기능]
```

---

#### 25. 비즈니스 자율 운영 ??

?? 설명
$1,000 초기 자금을 주고 "사업 만들어"라고 하면, 웹사이트 제작 → 제품 소싱 → SNS 계정 운영 → 마케팅 캠페인 실행까지 스스로 운영하여 실제 수익을 창출하는 자율 비즈니스 에이전트입니다.

?? 활용 효과
- 완전 자율 비즈니스 운영
- 24/7 수익 창출
- 인건비 절감

??? 필요 스킬
| 스킬 | 용도 | 설치 명령어 |
|------|------|------------|
| business | 비즈니스 기획 | `clawhub install business` |
| webdev | 웹 개발 | `clawhub install webdev` |
| marketing | 마케팅 | `clawhub install marketing` |
| ecommerce | 이커머스 | `clawhub install ecommerce` |
| analytics | 분석 | `clawhub install analytics` |

?? 단계별 설정 방법

1단계: 비즈니스 에이전트 설정
```bash
clawhub install business webdev marketing ecommerce analytics
```

2단계: 초기 자금 및 목표 설정
```json
{
  "business": {
    "initialCapital": 1000,
    "currency": "USD",
    "goal": "profit",
    "niche": "eco-friendly products",
    "timeline": "3_months",
    "autonomy": "full"
  }
}
```

?? 사용 예시
```
User: $1000으로 친환경 제품 사업 시작해줘

OpenClaw:
?? 자율 비즈니스 에이전트 활성화

━━━━━━━━━━━━━━━━━━━━━━
WEEK 1: 시장 조사 & 기획
━━━━━━━━━━━━━━━━━━━━━━

?? 시장 분석:
- 트렌드: 재사용 가능한 실리콘 용기 상승세
- 경쟁: 중간 수준, 차별화 여지 있음
- 타겟: 25-40세 환경-conscious 여성

?? 비즈니스 모델:
- D2C 이커머스
- 직접 소싱 (중국 제조업체)
- 마진율: 60%

?? 자금 배분:
- 제품 소싱: $400
- 웹사이트: $100
- 마케팅: $400
- 운영비: $100

━━━━━━━━━━━━━━━━━━━━━━
WEEK 2: 제품 소싱 & 웹사이트
━━━━━━━━━━━━━━━━━━━━━━

?? 제조업체 선정:
- 15개 업체 연락
- 샘플 품질 테스트
- 최종 선정: GreenMfg Co.
- 첫 주문: 실리콘 도시락 100개 ($350)

?? 웹사이트 구축:
- 플랫폼: Shopify
- 도메인: ecocontainers.co
- 결제: Stripe 연동
- 배송: 자동화 설정

━━━━━━━━━━━━━━━━━━━━━━
WEEK 3: 마케팅 실행
━━━━━━━━━━━━━━━━━━━━━━

?? SNS 계정 생성:
- Instagram: @ecocontainers (팔로워 0 → 1,200)
- TikTok: @ecocontainers (팔로워 0 → 3,400)

?? 광고 캠페인:
- Facebook Ads: $200
- TikTok Ads: $200
- CTR: 2.3%, CPC: $0.45

━━━━━━━━━━━━━━━━━━━━━━
WEEK 4+: 운영 & 최적화
━━━━━━━━━━━━━━━━━━━━━━

?? 실적 (3개월 후):
- 총 매출: $4,200
- 총 비용: $1,800
- 순이익: $2,400 (+140%)

?? 자동화된 작업:
- 매일: 재고 확인, 주문 처리
- 주간: 마케팅 성과 분석, 광고 최적화
- 월간: 신제품 기획, 공급업체 협상

?? 현재 상태:
- 일일 방문자: 150명
- 전환율: 3.2%
- 고객 만족도: 4.7/5

?? AI 제안:
"신제품(실리콘 빨대 세트) 추가 시 
예상 월 매출 +$800"

[제안 수락] [수정] [자세히 보기]
```

---

## ?? 사례별 난이도 요약

| 레벨 | 카테고리 | 사례 수 | 주요 스킬 |
|------|---------|--------|----------|
| ?? 초급 | 이메일/메시지 | 4개 | gmail, email, calendar |
| ?? 초급 | 일정/생산성 | 2개 | calendar, todoist, notion |
| ?? 초급 | 메모/기록 | 3개 | memory, notes, audio |
| ?? 초급 | 정보/모니터링 | 2개 | tracking, slack |
| ?? 초급 | 스마트홈 | 2개 | homeassistant, iot |
| ?? 초급 | 콘텐츠 | 2개 | screenshot, translate |
| ?? 중급 | 업무/비즈니스 | 4개 | crm, github, meeting |
| ?? 중급 | 개발/DevOps | 3개 | monitoring, docker, cicd |
| ?? 중급 | 스마트홈 고급 | 1개 | homeassistant, automation |
| ?? 중급 | 마케팅 | 2개 | content, monitoring |
| ?? 고급 | 멀티 에이전트 | 4개 | orchestrator, builder, deployer |

---

## ?? 다음 단계

시작하기 전에:
1. [보안 체크리스트](/security/skill-checklist) 확인
2. [빠른 시작 가이드](/quickstart)로 OpenClaw 설치
3. 초급 사례부터 하나씩 시도

특정 사례 구현에 문제가 있으면:
- [OpenClaw Discord](https://discord.gg/clawd)에서 질문
- [GitHub Issues](https://github.com/openclaw/openclaw/issues)에 보고
- [공식 문서](https://docs.openclaw.ai) 참고

---

> ?? 팁: 모든 사례는 조합하여 사용할 수 있습니다. 예를 들어 "아침 브리핑"에 "이메일 인박스 제로" 기능을 통합하거나, "멀티 에이전트"에 "회의 전사"를 연결할 수 있습니다.
