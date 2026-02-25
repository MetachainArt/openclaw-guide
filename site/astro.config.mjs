import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://openclaw.dmssolution.co.kr',
  base: '/',
  integrations: [
    starlight({
      title: 'OpenClaw 완벽 가이드',
      description: 'OpenClaw 설치부터 활용까지 - 초급자부터 중급자를 위한 웹북',
      disable404Route: false,
      social: {
        github: 'https://github.com/openclaw/openclaw',
        discord: 'https://discord.gg/clawd',
      },
      sidebar: [
        {
          label: '🏠 시작하기',
          items: [
            { label: '소개', slug: 'index' },
            { label: '빠른 시작 (30분)', slug: 'quickstart' },
          ],
        },
        {
          label: '📦 설치 가이드',
          collapsed: false,
          items: [
            { label: '📺 설치 튜토리얼 모음', slug: 'install/tutorials' },
            { label: '설치 전 준비', slug: 'install/prerequisites' },
            { label: 'Windows/WSL2 설치', slug: 'install/windows' },
            { label: 'macOS 설치', slug: 'install/macos' },
            { label: 'Linux 설치', slug: 'install/linux' },
            { label: 'Docker 설치', slug: 'install/docker' },
            { label: '최초 실행 및 설정', slug: 'install/first-run' },
            { label: '모델 연결 설정', slug: 'install/models' },
            { label: '문제 해결', slug: 'install/troubleshooting' },
          ],
        },
        {
          label: '⚙️ 운영 가이드',
          items: [
            { label: '업무 분리 패턴', slug: 'operations/workspace' },
            { label: '로그 및 백업', slug: 'operations/logging' },
            { label: '업데이트', slug: 'operations/updating' },
          ],
        },
        {
          label: '🚀 활용 사례',
          collapsed: false,
          items: [
            { label: '📂 카테고리 목록', slug: 'usecases' },
            { label: '🟢 업무 자동화 기본기', slug: 'usecases/category-01-work-automation' },
            { label: '🟢 개인 생산성 & 지식관리', slug: 'usecases/category-02-personal-productivity' },
            { label: '🟡 팀 협업 & 운영 자동화', slug: 'usecases/category-03-team-collaboration' },
            { label: '🟡 데이터 정리 & 리포트', slug: 'usecases/category-04-data-report' },
            { label: '🟡 개발 워크플로우 자동화', slug: 'usecases/category-05-dev-workflow' },
            { label: '🟢 콘텐츠 기획 & 글쓰기', slug: 'usecases/category-06-content-writing' },
            { label: '🟡 영상·이미지 크리에이티브', slug: 'usecases/category-07-creative' },
            { label: '🟡 마케팅 실행 자동화', slug: 'usecases/category-08-marketing' },
            { label: '🔴 비즈니스 전략 & 의사결정', slug: 'usecases/category-09-business' },
            {
              label: '🔴 멀티 에이전트 & 시스템화',
              items: [
                { label: '카테고리 개요', slug: 'usecases/category-10-multi-agent' },
                { label: '팀 에이전트 운영', slug: 'usecases/team-agents' },
                { label: '레포 분석 자동화', slug: 'usecases/repo-analysis' },
              ],
            },
            { label: '📋 전체 사례 모음', slug: 'usecases/all-cases' },
          ],
        },
        {
          label: '🔒 보안 가이드',
          items: [
            { label: '⚠️ 보안 경고', slug: 'security/warnings' },
            { label: '스킬 설치 체크리스트', slug: 'security/skill-checklist' },
            { label: '프롬프트 인젝션 방지', slug: 'security/prompt-injection' },
            { label: '격리 및 최소권한', slug: 'security/isolation' },
          ],
        },
        {
          label: '📚 부록',
          items: [
            { label: '❓ 자주 묻는 질문', slug: 'appendix/faq' },
            { label: '용어집', slug: 'appendix/glossary' },
            { label: '체크리스트 PDF', slug: 'appendix/checklist-pdf' },
            { label: '참고 링크/레포', slug: 'appendix/references' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'description',
            content: 'OpenClaw 설치 가이드 및 활용 사례 모음. 초급자부터 중급자까지 따라 할 수 있는 웹북',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: true,
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap',
          },
        },
      ],
      locales: {
        root: {
          label: '한국어',
          lang: 'ko-KR',
        },
      },
      lastUpdated: true,
      pagination: true,
    }),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
