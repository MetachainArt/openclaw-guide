---
title: "03. 팀 협업 & 운영 자동화"
description: 팀 알림, 업무 분배, 주간 보고 체계 - 팀 전체의 생산성 향상
---

> 🟡 중급 레벨  
> 👥 팀 단위로 확장하는 자동화 전략

---

## 📋 사례 목록 (총 6개)

### 1. 부재중 슬랙/팀즈 채널 요약
<a href="#case-1" class="case-link">자세히 보기 →</a>

핵심 효과: 자리 비운 사이 쌓인 대화의 핵심만 요약
필요 스킬: `slack`, `teams`, `summarizer`

---

### 2. 주간 보고 자동 생성
<a href="#case-2" class="case-link">자세히 보기 →</a>

핵심 효과: GitHub, Jira, 캘린더 데이터를 한눈에 정리
필요 스킬: `github`, `jira`, `reports`

---

### 3. 팀 알림 및 리마인더 관리
<a href="#case-3" class="case-link">자세히 보기 →</a>

핵심 효과: 마감일, 리뷰 대기, 미팅 알림 자동화
필요 스킬: `calendar`, `reminder`, `slack`

---

### 4. 업무 분배 및 트래킹
<a href="#case-4" class="case-link">자세히 보기 →</a>

핵심 효과: 자동으로 티켓 할당 및 진행 상황 추적
필요 스킬: `jira`, `asana`, `notion`

---

### 5. 신규 팀원 온복딩 자동화
<a href="#case-5" class="case-link">자세히 보기 →</a>

핵심 효과: 입사 첫날 계정 생성부터 문서 공유까지 자동
필요 스킬: `hr`, `google`, `slack`

---

### 6. CEO/리더 대시보드
<a href="#case-6" class="case-link">자세히 보기 →</a>

핵심 효과: 멀티 에이전트로 역할 분담해 운영
필요 스킬: `multi-agent`, `analytics`, `reports`

---

<h2 id="case-1">1. 부재중 슬랙/팀즈 채널 요약</h2>

### 💬 사용 예시

```
User: 슬랙 #dev-team 채널 요약해줘 (점심시간 동안)

OpenClaw:
📋 #dev-team 채널 요약 (12:00-14:00)

💬 총 메시지: 47개
👥 참여자: 8명

🔴 중요 결정사항:
1. 배포 일정 변경: 목요일 → 금요일로 연기
   - 이유: 테스트 추가 필요
   - 결정자: @팀장

2. 새로운 라이브러리 도입 승인
   - React Query 도입하기로 합의
   - 마이그레이션 담당: @김개발

📋 액션 아이템:
- [ ] @김개발: React Query POC 작성 (내일까지)
- [ ] @이기획: 배포 체크리스트 업데이트

❓ 내가 답변해야 할 질문:
- "API 엔드포인트 언제 나옴?" (13:45)
  → 답변 필요!

[📊 전체 대화 보기] [💬 빠른 답장] [🔔 알림 끄기]
```

---

<h2 id="case-2">2. 주간 보고 자동 생성</h2>

### 💬 사용 예시

```
User: 이번 주 보고서 생성해줘

OpenClaw:
📊 주간 업무 보고서 (2월 4주차)

👤 작성자: 홍길동
📅 기간: 2/24 ~ 3/1

━━━━━━━━━━━━━━━━━━

🎯 주요 성과

1. 프로젝트 A 대시보드 개선
   - 완료: UI 리뉴얼, 성능 최적화
   - GitHub: 12 commits, 3 PR merged
   - Jira: 5 tickets closed

2. API 문서화
   - Swagger 문서 작성 완료
   - 팀 낸부 공유 완료

3. 버그 수정
   - Critical: 1개
   - Major: 3개
   - Minor: 5개

━━━━━━━━━━━━━━━━━━

📊 통계

코드:
• commits: 18
• PRs: 5 (merged: 4)
• 리뷰: 12개

협업:
• 미팅: 8시간
• Slack 메시지: 127개
• 문서 작성: 3개

━━━━━━━━━━━━━━━━━━

📅 다음 주 계획

1. 프로젝트 B 스펙 확정 (월)
2. 기술 부채 정리 (화-수)
3. 팀 기술 공유 (목)

━━━━━━━━━━━━━━━━━━

✅ Google Docs에 저장 완료
📧 팀장님에게 공유 완료

[📄 보고서 보기] [📊 상세 통계] [📝 수정하기]
```

---

<h2 id="case-6">6. CEO/리더 대시보드</h2>

### 💬 사용 예시

```
User: 오늘 CEO 브리핑 준비해줘

OpenClaw:
📊 CEO 모닝 브리핑 (2월 26일)

━━━━━━━━━━━━━━━━━━

💰 매출 현황
• 이번 달: ₩850M (목표 92%)
• 전월 대비: +15%
• 예상 마감: ₩920M

👥 인사/조직
• 신규 입사자: 3명
• 퇴사 예정: 1명
• 채용 진행중: 5포지션

🚀 프로젝트
• 진행중: 8개
• 마감 임박: 2개 (D-3)
• 지연: 1개 (프로젝트 X, 2일)

⚠️ 주요 이슈
1. 서버 비용 초과 (15%)
2. 클라이언트 A 컴플레인
3. 보안 감사 준비 필요

━━━━━━━━━━━━━━━━━━

🤖 AI 분석

긍정적:
• 팀 생산성 12% 상승
• CSAT 점수 역대 최고

주의:
• 퇴사률 상승 추세 (월 1.5% → 2.3%)
• 일부 프로젝트 일정 지연

제안:
• 1:1 면담 주기 단축 검토
• 프로젝트 X 리소스 추가 투입

[📊 상세 대시보드] [📧 팀장 공유] [📅 회의 예약]
```

---

## 다음 카테고리

[04. 데이터 정리 & 리포트 →](/usecases/category-04-data-report)

<style>
.case-list { display: flex; flex-direction: column; gap: 1.5rem; margin: 2rem 0; }
.case-list h3 { margin: 0; color: #6366f1; font-size: 1.1rem; }
.case-link { display: inline-block; margin-top: 0.5rem; color: #8b5cf6; text-decoration: none; font-size: 0.9rem; }
.case-link:hover { text-decoration: underline; }
</style>
