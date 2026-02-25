#!/usr/bin/env node
/**
 * API Provider 웹사이트 스크린샷 자동화 스크립트
 * 
 * 사용법:
 *   node scripts/capture-api-screenshots.js
 * 
 * 출력:
 *   - site/public/images/screenshots/*.png
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'public/images/screenshots';

// API 제공자 웹사이트 스크린샷 설정
const screenshots = [
  {
    name: 'anthropic-api-keys',
    description: 'Anthropic Console API Keys 페이지',
    url: 'https://console.anthropic.com/settings/keys',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    authRequired: true,
    fallbackUrl: 'https://console.anthropic.com',
    note: '로그인 필요 - 미리보기 페이지 캡처'
  },
  {
    name: 'openai-api-keys',
    description: 'OpenAI Platform API Keys 페이지',
    url: 'https://platform.openai.com/api-keys',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    authRequired: true,
    fallbackUrl: 'https://platform.openai.com',
    note: '로그인 필요 - 미리보기 페이지 캡처'
  },
  {
    name: 'google-aistudio-api',
    description: 'Google AI Studio API Key 페이지',
    url: 'https://aistudio.google.com/app/apikey',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    authRequired: false,
    note: 'Google AI Studio 메인 페이지'
  },
  {
    name: 'groq-api-keys',
    description: 'Groq Console API Keys 페이지',
    url: 'https://console.groq.com/keys',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    authRequired: true,
    fallbackUrl: 'https://console.groq.com',
    note: '로그인 필요 - 미리보기 페이지 캡처'
  }
];

async function captureScreenshots() {
  console.log('🎬 API Provider 스크린샷 생성 시작...\n');
  console.log('⚠️  참고: 일부 사이트는 로그인이 필요합니다.');
  console.log('   대체 캡처 방법을 안내해 드립니다.\n');

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
    console.log(`   URL: ${config.url}`);
    
    try {
      const context = await browser.newContext({
        viewport: config.viewport,
        deviceScaleFactor: 2
      });

      const page = await context.newPage();

      // 페이지 로드
      await page.goto(config.url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // 로그인 페이지 감지 및 대체 URL로 이동
      const currentUrl = page.url();
      if (config.authRequired && (currentUrl.includes('login') || currentUrl.includes('signin'))) {
        console.log(`   ⚠️ 로그인 페이지 감지 - 대체 URL로 이동: ${config.fallbackUrl}`);
        await page.goto(config.fallbackUrl, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
      }

      // 특정 요소 대기
      if (config.waitFor) {
        try {
          await page.waitForSelector(config.waitFor, { timeout: 10000 });
        } catch (e) {
          console.log(`   ⚠️ 요소 대기 실패: ${config.waitFor}`);
        }
      }

      // 추가 대기 (렌더링 완료)
      await page.waitForTimeout(2000);

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
        size: fs.statSync(filePath).size,
        url: page.url()
      });

      console.log(`   ✅ 완료: ${filePath} (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`);

      await context.close();

    } catch (error) {
      results.push({
        name: config.name,
        status: 'failed',
        error: error.message
      });
      console.log(`   ❌ 실패: ${error.message}`);
    }
    
    console.log('');
  }

  await browser.close();

  // 결과 요약
  console.log('─'.repeat(60));
  console.log('📊 스크린샷 생성 완료');
  console.log('─'.repeat(60));
  
  const successCount = results.filter(r => r.status === 'success').length;
  const failCount = results.filter(r => r.status === 'failed').length;

  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${failCount}개`);

  if (failCount > 0) {
    console.log('\n⚠️ 실패한 캡처:');
    results
      .filter(r => r.status === 'failed')
      .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  }

  // 리포트 저장
  const reportPath = path.join(outputPath, 'api-screenshots-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results
  }, null, 2));

  console.log(`\n📝 리포트 저장: ${reportPath}`);
  
  // 대안 안내
  console.log('\n💡 로그인이 필요한 페이지는 수동 캡처가 필요합니다:');
  console.log('   1. 각 사이트에 로그인');
  console.log('   2. API Keys 페이지로 이동');
  console.log('   3. 브라우저 개발자도구 없이 전체화면 스크린샷 (F11)');
  console.log('   4. public/images/screenshots/ 에 저장');
  console.log('\n   Anthropic: console.anthropic.com → API Keys');
  console.log('   OpenAI:    platform.openai.com → API Keys');
  console.log('   Groq:      console.groq.com → API Keys');
}

// 실행
captureScreenshots().catch(error => {
  console.error('오류 발생:', error);
  process.exit(1);
});
