---
title: 초급 - 문서 작성 + 스크린샷
description: Playwright로 스크린샷을 찍어 문서에 자동 삽입
---

> 🟢 초급 레벨  
> ⏱️ 예상 소요시간: 30분  
> 🎯 목표: 자동화된 문서 생성

## 개요

웹사이트를 방문하고 스크린샷을 찍어 보고서에 자동으로 삽입하는 워크플로우입니다.

## 사용 사례

- 일일 보고서 작성
- 경쟁사 사이트 모니터링
- 배포 결과 문서화

## 설정

### 브라우저 스킬 설치

```bash
openclaw skill install browser
```

## 실행 예시

### 메신저 명령

```
example.com 홈페이지 스크린샷 찍어서 보고서에 넣어줘
```

### 자동화 스크립트

```javascript
// daily-report.js
module.exports = async (agent) => {
  // 스크린샷 촬영
  const screenshot = await agent.browser.screenshot('https://status.example.com');
  
  // 문서 생성
  await agent.docs.create({
    title: `Daily Report ${new Date().toISOString().split('T')[0]}`,
    content: `
# 일일 상태 보고

## 서버 상태
![status](${screenshot})

생성 시간: ${new Date()}
    `
  });
};
```

## 결과

마크다운 문서가 자동으로 생성되고 스크린샷이 삽입됩니다.

---

## 다음 단계

- [레포 분석 자동화](/usecases/repo-analysis)
