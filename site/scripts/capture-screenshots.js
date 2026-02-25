#!/usr/bin/env node
/**
 * OpenClaw 문서 사이트 스크린샷 자동화 스크립트
 * 
 * 사용법:
 *   node scripts/capture-screenshots.js
 * 
 * 출력:
 *   - site/public/screenshots/*.png
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'public/screenshots';

// 스크린샷 설정
const screenshots = [
  {
    name: 'dashboard-first-run',
    description: 'OpenClaw 설치 완료 후 첫 화면',
    url: 'http://localhost:18789/',
    viewport: { width: 1280, height: 800 },
    waitFor: '.dashboard',
    note: 'OpenClaw가 실행 중일 때만 캡처 가능'
  },
  {
    name: 'settings-models',
    description: '설정/프로필(모델/키) 화면',
    url: 'http://localhost:18789/settings/models',
    viewport: { width: 1280, height: 800 },
    waitFor: '.model-config',
    note: 'OpenClaw가 실행 중일 때만 캡처 가능'
  },
  {
    name: 'onboarding-wizard',
    description: '온보딩 마법사',
    url: 'http://localhost:18789/onboard',
    viewport: { width: 1280, height: 800 },
    waitFor: '.onboarding-step',
    note: '첫 실행 시에만 표시'
  },
  {
    name: 'mobile-dashboard',
    description: '모바일 대시보드 뷰',
    url: 'http://localhost:18789/',
    viewport: { width: 375, height: 812 }, // iPhone X
    waitFor: '.dashboard',
    note: '모바일 최적화 확인용'
  },
  {
    name: 'docs-site-preview',
    description: '문서 사이트 미리보기',
    url: 'http://localhost:4321/',
    viewport: { width: 1280, height: 800 },
    waitFor: 'main',
    note: 'Astro 개발 서버 실행 필요: npm run dev'
  },
  {
    name: 'docs-mobile',
    description: '문서 사이트 모바일 뷰',
    url: 'http://localhost:4321/',
    viewport: { width: 375, height: 812 },
    waitFor: 'main',
    note: '모바일 반응형 확인용'
  }
];

async function captureScreenshots() {
  console.log('🎬 OpenClaw 스크린샷 생성 시작...\n');

  // 출력 디렉토리 생성
  const outputPath = path.resolve(OUTPUT_DIR);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
    console.log(`📁 디렉토리 생성: ${OUTPUT_DIR}`);
  }

  // 브라우저 시작
  const browser = await chromium.launch({
    headless: true
  });

  const results = [];

  for (const config of screenshots) {
    console.log(`📸 ${config.name} 캡처 중...`);
    
    try {
      const context = await browser.newContext({
        viewport: config.viewport,
        deviceScaleFactor: 2 // Retina 품질
      });

      const page = await context.newPage();

      // 페이지 로드
      await page.goto(config.url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // 특정 요소 대기
      if (config.waitFor) {
        try {
          await page.waitForSelector(config.waitFor, { timeout: 5000 });
        } catch (e) {
          console.log(`   ⚠️ 요소 대기 실패: ${config.waitFor}`);
        }
      }

      // 추가 대기 (애니메이션 등)
      await page.waitForTimeout(1000);

      // 스크린샷 저장
      const filePath = path.join(outputPath, `${config.name}.png`);
      await page.screenshot({
        path: filePath,
        fullPage: false
      });

      results.push({
        name: config.name,
        status: 'success',
        path: filePath,
        size: fs.statSync(filePath).size
      });

      console.log(`   ✅ 완료: ${filePath}`);

      await context.close();

    } catch (error) {
      results.push({
        name: config.name,
        status: 'failed',
        error: error.message
      });
      console.log(`   ❌ 실패: ${error.message}`);
      console.log(`      💡 ${config.note}`);
    }
  }

  await browser.close();

  // 결과 요약
  console.log('\n📊 스크린샷 생성 완료');
  console.log('─'.repeat(50));
  
  const successCount = results.filter(r => r.status === 'success').length;
  const failCount = results.filter(r => r.status === 'failed').length;

  console.log(`성공: ${successCount}개`);
  console.log(`실패: ${failCount}개`);

  if (failCount > 0) {
    console.log('\n⚠️ 실패한 캡처:');
    results
      .filter(r => r.status === 'failed')
      .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  }

  // 리포트 저장
  const reportPath = path.join(outputPath, 'capture-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results
  }, null, 2));

  console.log(`\n📝 리포트 저장: ${reportPath}`);
  console.log('\n💡 참고: OpenClaw가 실행 중이지 않으면 일부 스크린샷이 생성되지 않습니다.');
  console.log('   openclaw gateway 실행 후 다시 시도하세요.');
}

// 실행
captureScreenshots().catch(error => {
  console.error('오류 발생:', error);
  process.exit(1);
});
