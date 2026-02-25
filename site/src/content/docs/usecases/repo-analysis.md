---
title: 레포 분석 → 컨텍스트 자동화
description: 새 레포를 받으면 문서화/요약/온볼딩 가이드를 자동 생성하는 템플릿
---

> ?? 목표: GitHub 레포를 입력하면 → 자동으로 프로젝트 이해를 위한 가이드 생성  
> ?? 예상 소요시간: 초기 설정 30분, 이후 레포당 5-10분

---

## 자동화 개요

새로운 오픈소스 프로젝트나 팀 레포를 받았을 때, OpenClaw가 자동으로 다음을 생성합니다:

1. 읽어야 할 파일 Top 10
2. 프로젝트 구조 한 장 요약
3. 실행 방법
4. 변경/테스트 포인트
5. 위험 요소 분석 (키, 권한, 외부 호출)

---

## 전제 조건

### 필요 스킬

- `github` - 레포 클론 및 분석
- `filesystem` - 파일 탐색
- `browser` - 문서 검색
- `code-analysis` - 코드 구조 분석

### API 키

- GitHub Personal Access Token (repo 권한)
- (선택) OpenAI/Anthropic API

---

## 자동화 워크플로우

### 1단계: 레포 입력

메신저 또는 CLI로:

```
/repo analyze https://github.com/example/project
```

### 2단계: 자동 분석

OpenClaw가 다음을 수행:

1. 레포 메타데이터 수집
   - README, LICENSE, CONTRIBUTING
   - 최근 커밋, 이슈, PR
   - 의존성 파일 (package.json, requirements.txt 등)

2. 코드 구조 분석
   - 디렉토리 구조 파악
   - 주요 소스 파일 식별
   - 테스트 파일 위치
   - 설정 파일 매핑

3. 위험 요소 스캔
   - API 키/비밀번호 노출 여부
   - 외부 네트워크 호출
   - 파일 시스템 접근
   - 의심스러운 의존성

### 3단계: 리포트 생성

마크다운 문서로 생성:

```markdown
# 프로젝트 분석 리포트: project-name

## ?? 개요
- 언어: TypeScript
- 프레임워크: Express.js
- 라이선스: MIT
- 마지막 업데이트: 2026-02-20

## ?? 읽어야 할 파일 Top 10
1. README.md - 프로젝트 소개
2. src/index.ts - 진입점
3. src/routes/api.ts - API 라우트
...

## ??? 프로젝트 구조
```
src/
├── index.ts        # 서버 진입점
├── routes/         # API 라우트
├── models/         # 데이터 모델
├── services/       # 비즈니스 로직
└── utils/          # 유틸리티
```

## ?? 실행 방법
```bash
npm install
npm run dev
```

## ?? 테스트
```bash
npm test
```

## ?? 위험 요소
- 외부 API 호출: api.example.com
- 파일 쓰기: /tmp/ 디렉토리
- 환경 변수: API_KEY, DATABASE_URL
```

---

## 실제 설정 방법

### 스킬 설치

```bash
clawhub install repo-analyzer
```

### 설정 파일

`~/.openclaw/skills/repo-analyzer/config.json`:

```json
{
  "template": {
    "sections": [
      "overview",
      "must-read-files",
      "structure",
      "setup",
      "testing",
      "risks"
    ],
    "maxFiles": 10,
    "maxDepth": 3
  },
  "riskAnalysis": {
    "checkSecrets": true,
    "checkNetwork": true,
    "checkFilesystem": true,
    "checkDependencies": true
  },
  "output": {
    "format": "markdown",
    "saveTo": "~/.openclaw/reports/"
  }
}
```

### 프롬프트 템플릿

`~/.openclaw/skills/repo-analyzer/prompt.md`:

```markdown
당신은 시니어 소프트웨어 엔지니어입니다.
주어진 레포지토리를 분석하여 신규 개발자가 프로젝트를 이해할 수 있도록 가이드를 작성하세요.

## 분석할 내용

1. 핵심 파일 (10개 이내)
   - 진입점
   - 주요 모듈
   - 설정 파일
   - 테스트 예시

2. 프로젝트 구조
   - 디렉토리 트리 (3단계 깊이)
   - 각 디렉토리의 역할

3. 실행 방법
   - 설치 단계
   - 개발 서버 실행
   - 프로덕션 빌드

4. 위험 요소
   - 민감 데이터 처리
   - 외부 API 호출
   - 파일 시스템 접근
   - 의심스러운 의존성

## 출력 형식

마크다운으로 작성. 코드 블록은 적절히 사용.
```

---

## 실행 예시

### Telegram에서

```
User: /repo https://github.com/vercel/next.js

OpenClaw: ?? 레포 분석 중...
- 15,000+ 파일 발견
- TypeScript 프로젝트 확인
- 주요 패키지: react, webpack, babel

?? 분석 완료! 리포트를 생성했습니다:
/nextjs-analysis-20260225.md

요약:
? 핵심 파일: packages/next/src/server/next.ts
? 실행: pnpm install && pnpm dev
? 테스트: pnpm test
?? 주의: 200+ 외부 의존성
```

### CLI에서

```bash
openclaw message "Analyze this repository: https://github.com/vercel/next.js" \
  --output nextjs-guide.md \
  --include-risk-analysis
```

---

## 고급 사용법

### 팀 공유 설정

팀 전체가 같은 분석 템플릿을 사용:

```bash
# 팀 설정 동기화
openclaw message "Create a template from this repo" \
  --url https://github.com/company/repo-analysis-template
```

### CI/CD 통합

GitHub Actions에서 자동 분석:

```yaml
# .github/workflows/repo-analysis.yml
name: Repo Analysis
on:
  repository_dispatch:
    types: [analyze]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Analyze with OpenClaw
        run: |
          openclaw message "Analyze current repository and output to report.md"
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: analysis-report
          path: report.md
```

### 데이터베이스 저장

분석 결과를 지식베이스에 저장:

```json
{
  "storage": {
    "type": "vector",
    "provider": "pinecone",
    "index": "repo-analysis"
  },
  "embedding": {
    "model": "text-embedding-3-small"
  }
}
```

---

## 추천 GitHub 레포 (학습용)

| 레포 | 언어 | 학습 포인트 |
|------|------|------------|
| [expressjs/express](https://github.com/expressjs/express) | JS | 미들웨어 패턴 |
| [nestjs/nest](https://github.com/nestjs/nest) | TS | 의존성 주입 |
| [fastapi/fastapi](https://github.com/fastapi/fastapi) | Python | 현대적인 Python API |
| [gin-gonic/gin](https://github.com/gin-gonic/gin) | Go | 고성능 라우터 |

---

## 문제 해결

### 분석이 너무 오래 걸림

```bash
# 깊이 제한
openclaw message "Analyze <url> up to depth 2"

# 파일 수 제한
openclaw message "Analyze <url> max 50 files"
```

### 클론 실패

```bash
# SSH 대신 HTTPS 사용
openclaw message "Analyze https://github.com/... via HTTPS"

# 인증 추가
openclaw config set github.token $GITHUB_TOKEN
```

---

## 다음 단계

- [중급: 팀 에이전트 운영](/usecases/team-agents)
- [보안: 스킬 설치 체크리스트](/security/skill-checklist)
