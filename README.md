# OpenClaw 완벽 가이드 (OpenClaw Complete Guide)

> 📚 OpenClaw 설치부터 활용까지 - 초급자부터 중급자를 위한 웹북

[![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?logo=astro)](https://astro.build)
[![Starlight](https://img.shields.io/badge/Starlight-0.30-7C4DFF?logo=astro)](https://starlight.astro.build)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Pages](https://img.shields.io/badge/Pages-40-blue.svg)]()
[![Words](https://img.shields.io/badge/Words-6000+-orange.svg)]()

---

## 🎯 이 프로젝트는 무엇인가요?

**OpenClaw 완벽 가이드**는 AI 에이전트 OpenClaw의 설치, 설정, 활용 방법을 담은 한국어 웹북입니다.

### 주요 특징

- 📱 **모바일 최적화** - Astro + Starlight 기반 반응형 디자인
- 🔍 **검색 기능** - Pagefind 기반 전문 검색 지원
- 📖 **40페이지 구성** - 설치부터 고급 활용까지 체계적 정리
- ⚡ **빠른 로딩** - 정적 사이트 생성 (SSG)

---

## 📚 문서 구성

### 🚀 시작하기
- [소개](site/src/content/docs/index.md)
- [빠른 시작 (30분)](site/src/content/docs/quickstart.md)

### 📦 설치 가이드
- [설치 튜토리얼 모음](site/src/content/docs/install/tutorials.md)
- [Windows/WSL2 설치](site/src/content/docs/install/windows.md)
- [macOS 설치](site/src/content/docs/install/macos.md)
- [Linux 설치](site/src/content/docs/install/linux.md)
- [Docker 설치](site/src/content/docs/install/docker.md)
- [모델 연결 설정](site/src/content/docs/install/models.md)
- [최초 실행 및 설정](site/src/content/docs/install/first-run.md)
- [문제 해결](site/src/content/docs/install/troubleshooting.md)

### 🚀 활용 사례 (10 카테고리)
1. [업무 자동화 기본기](site/src/content/docs/usecases/category-01-work-automation.md)
2. [개인 생산성 & 지식관리](site/src/content/docs/usecases/category-02-personal-productivity.md)
3. [팀 협업 & 운영 자동화](site/src/content/docs/usecases/category-03-team-collaboration.md)
4. [데이터 정리 & 리포트](site/src/content/docs/usecases/category-04-data-report.md)
5. [개발 워크플로우 자동화](site/src/content/docs/usecases/category-05-dev-workflow.md)
6. [콘텐츠 기획 & 글쓰기](site/src/content/docs/usecases/category-06-content-writing.md)
7. [영상·이미지 크리에이티브](site/src/content/docs/usecases/category-07-creative.md)
8. [마케팅 실행 자동화](site/src/content/docs/usecases/category-08-marketing.md)
9. [비즈니스 전략 & 의사결정](site/src/content/docs/usecases/category-09-business.md)
10. [멀티 에이전트 & 시스템화](site/src/content/docs/usecases/category-10-multi-agent.md)

### 🔒 보안 가이드
- [보안 경고](site/src/content/docs/security/warnings.md)
- [스킬 설치 체크리스트](site/src/content/docs/security/skill-checklist.md)
- [프롬프트 인젝션 방지](site/src/content/docs/security/prompt-injection.md)
- [격리 및 최소권한](site/src/content/docs/security/isolation.md)

### 📚 부록
- [❓ 자주 묻는 질문 (FAQ)](site/src/content/docs/appendix/faq.md)
- [용어집](site/src/content/docs/appendix/glossary.md)
- [참고 링크/레포](site/src/content/docs/appendix/references.md)

---

## 🛠️ 로컬 개발

### 필수 조건
- Node.js 22+
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/MetachainArt/openclaw-guide.git
cd openclaw-guide/site

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

개발 서버가 시작되면 브라우저에서 `http://localhost:4323/`로 접속할 수 있습니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물은 site/dist/에 생성됩니다
```

---

## 📋 문서 정보

- **버전**: 2026.02.25-v1.0
- **최종 업데이트**: 2026년 2월 25일
- **OpenClaw 버전**: 2026.1.29+ (보안 패치 포함)
- **총 페이지**: 40 pages
- **색인 단어**: 6,076 words

### 주요 출처
- [OpenClaw 공식 문서](https://docs.openclaw.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- 커뮤니티 블로그 및 유튜브 튜토리얼
- 2026년 2월 기준 보안 리포트 (Koi Security 등)

---

## ⚠️ 중요 보안 경고

> **2026년 2월 ClawHub 보안 사고**
> 
> OpenClaw 스킬 마켓플레이스(ClawHub)에서 **341개 이상의 악성 스킬**이 발견되었습니다.
> 
> **필수 조치**:
> - 스킬 설치 전 반드시 출처/권한 검증
> - 민감정보 환경에서는 WSL/별도 서버/최소권한 적용
> - [보안 가이드](/site/src/content/docs/security/warnings.md) 필독

---

## 📝 최신 AI 모델 정보 (2026년 2월 기준)

| 프로바이더 | 최신 모델 | 출시일 |
|-----------|----------|--------|
| Anthropic | Claude Opus 4.6 | 2026.02.05 |
| Anthropic | Claude Sonnet 4.6 | 2026.02.17 |
| OpenAI | GPT-5.3-Codex | 2026.02.05 |
| OpenAI | GPT-5.2 | 2025.12 |
| Google | Gemini 3.1 Pro | 2026.02.19 |
| Google | Gemini 3.0 Flash | 2024 |

---

## 🤝 기여하기

이 프로젝트는 개방형 문서 프로젝트입니다. 개선 사항이나 오류를 발견하셨다면 Issue나 Pull Request를 별내주세요.

### 기여 방법
1. 이 저장소를 Fork합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-content`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing content'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-content`)
5. Pull Request를 생성합니다

---

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.

문서 내용은 [OpenClaw 공식 문서](https://docs.openclaw.ai) (MIT License)와 커뮤니티 리소스를 기반으로 작성되었습니다.

---

## 🙏 감사의 말

- [OpenClaw](https://github.com/openclaw/openclaw) 개발팀
- [Astro](https://astro.build) 및 [Starlight](https://starlight.astro.build) 팀
- OpenClaw 커뮤니티 기여자들
- 보안 리포트 제공: Koi Security, OffSeq, The Hacker News

---

<p align="center">
  <strong>⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!</strong>
</p>
