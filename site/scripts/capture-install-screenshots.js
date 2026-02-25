#!/usr/bin/env node
/**
 * OpenClaw 설치 튜토리얼 스크린샷 캡처 스크립트
 * YouTube 및 블로그 튜토리얼에서 스크린샷 수집
 * 
 * 사용법:
 *   node scripts/capture-install-screenshots.js
 * 
 * 출력:
 *   - site/public/images/install-screenshots/*.png
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'public/images/install-screenshots';

// OpenClaw 설치 튜토리얼 페이지 목록
const screenshots = [
  {
    name: 'youtube-tutorial-metics',
    description: 'Metics Media OpenClaw 튜토리얼',
    url: 'https://www.youtube.com/watch?v=fcZMmP5dsl4',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    note: 'Full OpenClaw Setup Tutorial - 119K views'
  },
  {
    name: 'youtube-tutorial-adrian',
    description: 'Adrian Twarog OpenClaw Crash Course',
    url: 'https://www.youtube.com/watch?v=u4ydH-QvPeg',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    note: '120K views - Popular tutorial'
  },
  {
    name: 'youtube-tutorial-kevin',
    description: 'Kevin Jeppesen 10분 설치 가이드',
    url: 'https://www.youtube.com/watch?v=khTA_AfJ01Y',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    note: 'VPS Setup + Fix Common Issues'
  },
  {
    name: 'blog-korean-codingopera',
    description: '코딩오페라 Windows 설치 가이드',
    url: 'https://codingopera.tistory.com/86',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    note: 'Korean blog - Windows installation'
  },
  {
    name: 'blog-korean-tars',
    description: 'Tars 블로그 WSL2 설치',
    url: 'https://tars.tistory.com/m/entry/OpenClaw-%EC%84%A4%EC%B9%98%ED%95%B4%EB%B3%B4%EA%B8%B0',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    note: 'Windows 11 WSL installation'
  },
  {
    name: 'blog-docker-leenit',
    description: 'Leenit Docker 설치 가이드',
    url: 'https://blog.leenit.kr/install-openclaw-with-docker/',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    note: 'Docker 5분 설치'
  },
  {
    name: 'blog-jangwook',
    description: '장욱님 블로그 완벽 튜토리얼',
    url: 'https://jangwook.net/ko/blog/ko/openclaw-installation-tutorial/',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    note: '설치부터 첫 대화까지'
  },
  {
    name: 'blog-medium-gul',
    description: 'Medium 설치 가이드',
    url: 'https://medium.com/@guljabeen222/how-to-install-openclaw-2026-the-complete-step-by-step-guide-516b74c163b9',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    note: 'Complete step-by-step guide'
  },
  {
    name: 'blog-tikongs',
    description: '콩쓰s 온볼딩 위저드',
    url: 'https://tikongs.tistory.com/1130',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    note: '온볼딩 위저드 가이드'
  },
  {
    name: 'blog-bloghub',
    description: '블로그허브 WSL2 가이드',
    url: 'https://bloghub.co.kr/openclaw-%EC%9C%88%EB%8F%84%EC%9A%B0-%EC%84%A4%EC%B9%98-%EB%B0%A9%EB%B2%95-%EC%99%84%EB%B2%BD-%EA%B0%80%EC%9D%B4%EB%93%9C-wsl2%EB%A1%9C-%EC%89%BD%EA%B2%8C-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0/',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    note: 'WSL2 완벽 가이드'
  },
  {
    name: 'official-docs',
    description: 'OpenClaw 공식 문서',
    url: 'https://docs.openclaw.ai',
    viewport: { width: 1280, height: 900 },
    waitFor: 'body',
    note: 'Official documentation'
  }
];

async function captureScreenshots() {
  console.log('🎬 OpenClaw 설치 튜토리얼 스크린샷 생성 시작...\n');
  console.log('총 ' + screenshots.length + '개의 페이지를 캡처합니다.\n');

  // 출력 디렉토리 생성
  const outputPath = path.resolve(OUTPUT_DIR);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
    console.log(`📁 디렉토리 생성: ${OUTPUT_DIR}\n`);
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

      // 페이지 로드 (타임아웃 60초)
      await page.goto(config.url, {
        waitUntil: 'networkidle',
        timeout: 60000
      });

      // 특정 요소 대기
      if (config.waitFor) {
        try {
          await page.waitForSelector(config.waitFor, { timeout: 10000 });
        } catch (e) {
          console.log(`   ⚠️ 요소 대기 실패: ${config.waitFor}`);
        }
      }

      // 추가 대기 (렌더링 완료)
      await page.waitForTimeout(3000);

      // 스크린샷 저장
      const filePath = path.join(outputPath, `${config.name}.png`);
      await page.screenshot({
        path: filePath,
        fullPage: true // 전체 페이지 캡처
      });

      results.push({
        name: config.name,
        status: 'success',
        path: filePath,
        size: fs.statSync(filePath).size,
        url: config.url,
        note: config.note
      });

      console.log(`   ✅ 완료: ${filePath}`);
      console.log(`   📊 크기: ${(fs.statSync(filePath).size / 1024).toFixed(1)} KB`);

      await context.close();

    } catch (error) {
      results.push({
        name: config.name,
        status: 'failed',
        error: error.message,
        url: config.url
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

  console.log('\n📁 저장된 파일 목록:');
  results
    .filter(r => r.status === 'success')
    .forEach(r => console.log(`  - ${r.name}.png (${(r.size / 1024).toFixed(1)} KB) - ${r.note}`));

  // 리포트 저장
  const reportPath = path.join(outputPath, 'install-screenshots-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: screenshots.length,
    success: successCount,
    failed: failCount,
    results
  }, null, 2));

  console.log(`\n📝 리포트 저장: ${reportPath}`);
}

// 실행
captureScreenshots().catch(error => {
  console.error('오류 발생:', error);
  process.exit(1);
});
