# OpenClaw 완벽 가이드 (웹북)

> OpenClaw 설치부터 활용까지 - 초급자부터 중급자를 위한 인터넷 공개용 웹북

![OpenClaw](https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text.png)

## 🚀 빠른 시작

```bash
# macOS / Linux / WSL2
curl -fsSL https://openclaw.ai/install.sh | bash

# 온보딩 실행
openclaw onboard --install-daemon

# 대시보드 열기
openclaw dashboard
```

## 📚 문서 구조

| 챕터 | 내용 | 소요시간 |
|------|------|----------|
| [빠른 시작](/docs/quickstart) | 30분 만에 시작하기 | 30분 |
| [설치 가이드](/docs/install/prerequisites) | OS별 상세 설치 | 2-10시간 |
| [운영 가이드](/docs/operations/workspace) | 업무 분리/로그/백업 | 1-2시간 |
| [활용 사례](/docs/usecases/all-cases) | 60가지 실제 사례 | 참고용 |
| [보안 가이드](/docs/security/warnings) | 필수 보안 체크리스트 | 30분 |

## ⚠️ 보안 경고

> **2026년 2월 ClawHub에서 341개 이상의 악성 스킬이 발견되었습니다.**
> 
> 스킬 설치 전 반드시 [보안 체크리스트](/docs/security/skill-checklist)를 확인하세요.

## 🛠️ 기술 스택

- **프레임워크**: [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
- **스타일**: CSS Custom Properties
- **빌드**: Static Site Generation
- **배포**: Netlify/Vercel 권장

## 📦 로컬 개발

### 요구사항

- Node.js 22+
- npm 또는 pnpm

### 설치

```bash
cd site
npm install
```

### 개발 서버

```bash
npm run dev
```

http://localhost:4321 에서 미리보기

### 스크린샷 생성

```bash
# OpenClaw 실행 중 필요
npm run screenshots
```

### 빌드

```bash
# 전체 빌드 (스크린샷 포함)
npm run build:full

# 문서만 빌드
npm run build
```

### 미리보기

```bash
npm run preview
```

## 📸 스크린샷 자동화

Playwright를 사용하여 문서용 스크린샷을 자동 생성합니다.

```bash
cd site/scripts
npm install
npm run capture
```

출력: `site/public/screenshots/*.png`

## 📝 콘텐츠 작성

### 마크다운 파일 위치

```
site/src/content/docs/
├── index.md              # 홈
├── quickstart.md         # 빠른 시작
├── install/              # 설치 가이드
│   ├── prerequisites.md
│   ├── windows.md
│   ├── macos.md
│   ├── linux.md
│   └── ...
├── operations/           # 운영 가이드
├── usecases/             # 활용 사례
├── security/             # 보안 가이드
└── appendix/             # 부록
```

### 프론트매터 형식

```yaml
---
title: 페이지 제목
description: 페이지 설명
---
```

## 🎨 커스터마이징

### 테마 수정

`site/src/styles/custom.css`:

```css
:root {
  --sl-color-accent: #your-color;
}
```

### 사이드바 수정

`site/astro.config.mjs`의 `sidebar` 항목 편집

## 🚀 배포

### Netlify

```bash
# 빌드 명령
npm run build

# 배포 디렉토리
dist
```

### Vercel

```bash
vercel --prod
```

### GitHub Pages

```bash
# astro.config.mjs 수정
site: 'https://yourusername.github.io',
base: '/openclaw-guide',
```

## 📋 문서 정보

- **버전**: 2026.02.25-v1.0
- **OpenClaw 버전**: 2026.1.29+
- **최종 업데이트**: 2026년 2월 25일
- **라이선스**: MIT

## 🔗 링크

- [OpenClaw 공식 사이트](https://openclaw.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [공식 문서](https://docs.openclaw.ai)

## 🤝 기여

이 문서에 기여하려면:

1. Fork 생성
2. 브랜치 생성: `git checkout -b feature/my-update`
3. 변경사항 커밋: `git commit -am 'Add some feature'`
4. 브랜치 푸시: `git push origin feature/my-update`
5. Pull Request 생성

## 🙏 감사의 말

- OpenClaw 개발팀 및 커뮤니티
- 문서화에 기여한 모든 분들
- 보안 연구자들 (Koi Security, Alice.io 등)

---

**면책 조항**: 이 문서는 커뮤니티 기여물입니다. OpenClaw 공식 문서와 차이가 있을 수 있으며, 최신 정보는 [docs.openclaw.ai](https://docs.openclaw.ai)를 참고하세요.
