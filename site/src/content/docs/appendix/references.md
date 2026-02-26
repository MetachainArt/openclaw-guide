---
title: 참고 링크 및 레포 목록
description: OpenClaw 학습 및 확장을 위한 참고 자료
---

## 공식 자료

### 문서
- [OpenClaw 공식 문서](https://docs.openclaw.ai) - 가장 정확하고 최신 정보
- [GitHub README](https://github.com/openclaw/openclaw) - 프로젝트 개요
- [SECURITY.md](https://github.com/openclaw/openclaw/blob/main/SECURITY.md) - 보안 정책
- [CHANGELOG](https://github.com/openclaw/openclaw/blob/main/CHANGELOG.md) - 업데이트 내역

### 커뮤니티
- [Discord](https://discord.gg/clawd) - 공식 디스코드 서버
- [GitHub Discussions](https://github.com/openclaw/openclaw/discussions) - 기술 토론
- [Twitter/X @openclaw](https://twitter.com/openclaw) - 공식 계정

---

## 설치/운영 관련 레포

### Docker/WSL
| 레포 | 설명 | 참고 |
|------|------|------|
| [openclaw/openclaw](https://github.com/openclaw/openclaw) | 메인 레포, Dockerfile 포함 | `/Dockerfile`, `/docker-compose.yml` |
| [openclaw/nix-openclaw](https://github.com/openclaw/nix-openclaw) | Nix 패키지 | 선언적 설치 |

### 배포 템플릿
| 레포 | 설명 | 참고 |
|------|------|------|
| [fly.toml](https://github.com/openclaw/openclaw/blob/main/fly.toml) | Fly.io 배포 | 클라우드 호스팅 |
| [render.yaml](https://github.com/openclaw/openclaw/blob/main/render.yaml) | Render 배포 | 물리적 서버 |

---

## 스킬/확장 관련 레포

 주의: 2026년 2월 기준 ClawHub에서 악성 스킬이 발견되었습니다. 모든 서드파티 스킬은 설치 전 코드 검토가 필요합니다.

### 공식/검증된 스킬
| 카테고리 | 스킬 | 설명 |
|----------|------|------|
| Core | browser | Playwright 기반 브라우저 제어 |
| Core | canvas | A2UI 시각적 작업 공간 |
| Core | cron | 자동화 작업 스케줄링 |
| Channel | telegram | Telegram 봇 연동 |
| Channel | slack | Slack 앱 연동 |
| Channel | discord | Discord 봇 연동 |
| Tool | github | GitHub API 통합 |
| Tool | gmail | Gmail 자동화 |

### 커뮤니티 스킬 (주의 필요)
- [ClawHub](https://clawhub.openclaw.ai) - 공식 마켓플레이스
- [awesome-openclaw](https://github.com/topics/openclaw) - GitHub 토픽

---

## 학습 자료

### 블로그/아티클
| 제목 | 작성자 | 날짜 |
|------|--------|------|
| [How to Set Up OpenClaw](https://mrprompts.substack.com/p/how-to-set-up-openclaw-your-247-ai) | Mr. Prompts | 2026-02-18 |
| [OpenClaw macOS Installation Guide](https://medium.com/@fawwazraza2024/openclaw-macos-installation-guide) | Fawwazraza | 2026-02-19 |
| [OpenClaw Complete Guide 2026](https://www.clawctl.com/blog/setup-openclaw-complete-guide) | Clawctl Team | 2026-02-03 |
| [OpenClaw in 2026: Architecture, Setup, Skills Security](https://vallettasoftware.com/blog/post/openclaw-2026-guide) | Valletta Software | 2026-02-16 |

### 유튜브 튜토리얼
| 채널 | 제목 | 링크 |
|------|------|------|
| AI LABS | 놀라운 활용 사례들 | [youtube](http://www.youtube.com/watch?v=hp7n45JqvIw) |
| Alex Finn | 생산성 머신 만들기 | [youtube](http://www.youtube.com/watch?v=XeTgMEapbag) |
| Matthew Berman | 실제 유용한 워크플로우 | [youtube](http://www.youtube.com/watch?v=Q7r--i9lLck) |
| Duncan Rogoff | 실무 자동화 사례 | [youtube](http://www.youtube.com/watch?v=LV6Juz0xcrY) |
| Peter Yang | 30분 만에 설정부터 메모리까지 마스터하기 | [youtube](http://www.youtube.com/watch?v=ji_Sd4si7jo) |

---

## 보안 자료

### 보안 보고서
| 제목 | 출처 | 날짜 |
|------|------|------|
| [341 Malicious ClawHub Skills](https://radar.offseq.com/threat/researchers-find-341-malicious-clawhub-skills-stea-1b7d1ac6) | OffSeq/Koi Security | 2026-02-02 |
| [Auditing an AI Marketplace](https://alice.io/blog/we-audited-the-openclaw-marketplace-we-found-a-trojan) | Alice.io | 2026-02-11 |
| [OpenClaw skills leak API keys](https://www.theregister.com/2026/02/05/openclaw_skills_marketplace_leaky_security) | The Register | 2026-02-05 |
| [Personal AI Agents Security Nightmare](https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare) | Cisco Blogs | 2026-01-28 |

---

## 관련 프로젝트

### 유사 도구
| 도구 | 특징 | 오픈소스 |
|------|------|----------|
| AutoGPT | 완전 자율 에이전트 |  |
| BabyAGI | 태스크 기반 자동화 |  |
| SuperAGI | 엔터프라이즈 자율 에이전트 |  |
| n8n | 워크플로우 자동화 |  |
| Huginn | 개인용 IFTTT |  |

### 통합 가능 도구
| 도구 | 통합 방식 |
|------|----------|
| Home Assistant | 스마트홈 제어 |
| Obsidian | 지식베이스 |
| Notion | 문서/데이터베이스 |
| Telegram | 메신저 |
| Discord | 커뮤니티/알림 |

---

## 개발 자료

### API 문서
- [Plugin SDK](https://docs.openclaw.ai/tools/skills) - 스킬 개발 가이드
- [Gateway API](https://docs.openclaw.ai/gateway) - 게이트웨이 제어
- [Models API](https://docs.openclaw.ai/concepts/models) - 모델 설정

### 예제 코드
- [스킬 예제](https://github.com/openclaw/openclaw/tree/main/skills) - 공식 예제 스킬
- [테스트 코드](https://github.com/openclaw/openclaw/tree/main/test) - 테스트 모음

---

## 기여하기

### 코드 기여
- [CONTRIBUTING.md](https://github.com/openclaw/openclaw/blob/main/CONTRIBUTING.md)
- [Good First Issues](https://github.com/openclaw/openclaw/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

### 문서 기여
- [Docs GitHub](https://github.com/openclaw/docs) - 문서 레포

---

## 업데이트

최신 정보는 다음에서 확인하세요:
- [GitHub Releases](https://github.com/openclaw/openclaw/releases)
- [Changelog](https://github.com/openclaw/openclaw/blob/main/CHANGELOG.md)
- [Discord #announcements](https://discord.gg/clawd)

---

*마지막 업데이트: 2026년 2월 25일*
