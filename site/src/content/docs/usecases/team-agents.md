---
title: 팀 에이전트 운영 (서브 에이전트 실전 가이드)
description: 여러 에이전트가 협업하는 팀 운영 완벽 가이드 - 오케스트레이터부터 실전 워크플로우까지
---

> 🟡 중급-고급 레벨  
> ⏱️ 예상 소요시간: 2-4시간 (설정 1시간 + 실전 연습 3시간)  
> 🎯 목표: 
> - 멀티 에이전트 아키텍처 구축
> - 오케스트레이터 기반 워크플로우 자동화
> - 실제 개발/업무 시나리오 적용
> - 장애 대응 및 모니터링

---

## 1. 팀 에이전트란?

### 1.1 개념 이해

팀 에이전트는 하나의 목표를 달성하기 위해 협업하는 여러 OpenClaw 에이전트입니다. 각 에이전트는 특정 역할을 맡고, 오케스트레이터의 조율 하에 순차적 또는 병렬로 작업을 수행합니다.

전통적인 방식 vs 팀 에이전트:

```
❌ 전통적인 방식 (단일 에이전트)
User → OpenClaw → 모든 작업 수행
      ↳ 코드 작성
      ↳ 코드 리뷰
      ↳ 테스트
      ↳ 배포
      (하나가 막히면 전체 정지)

✅ 팀 에이전트 방식
User → Orchestrator → 작업 분배
         ↳ Builder → 코드 작성
         ↳ Reviewer → 병렬로 코드 리뷰
         ↳ Tester → 병렬로 테스트 준비
         ↳ Deployer → 배포 대기
         (전문화로 효율 향상, 병렬 처리로 속도 향상)
```

### 1.2 왜 팀 에이전트인가?

| 항목 | 단일 에이전트 | 팀 에이전트 |
|------|--------------|------------|
| 처리 속도 | 순차적 처리 | 병렬 처리 (3-5배 빠름) |
| 품질 | 일반화된 판단 | 전문화된 판단 |
| 신뢰성 | 단일 장애점 | 분산 처리 |
| 확장성 | 수직 확장만 | 수평 확장 가능 |
| 디버깅 | 어려움 | 에이전트별 추적 용이 |

---

## 2. 팀 에이전트 아키텍처

### 2.1 기본 구조

```
┌──────────────────────────────────────────────────────────────┐
│                        사용자 (User)                          │
└──────────────────────────┬───────────────────────────────────┘
                           │ 명령/요청
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    오케스트레이터                              │
│              (Orchestrator - Central Controller)              │
│  - 작업 분석 및 분해                                          │
│  - 에이전트 선택 및 할당                                       │
│  - 진행 상황 모니터링                                         │
│  - 결과 통합 및 보고                                          │
└──────┬─────────────┬─────────────┬─────────────┬─────────────┘
       │             │             │             │
       ▼             ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Builder  │  │ Reviewer │  │ Tester   │  │ Deployer │
│  👷      │  │  🔍      │  │  🧪      │  │  🚀      │
│          │  │          │  │          │  │          │
│코드 생성   │  │코드 리뷰 │  │테스트    │  │배포      │
│문서 작성   │  │품질 검사 │  │품질 검증 │  │모니터링  │
│API 설계    │  │보안 검사 │  │리포트    │  │롤백      │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
       │             │             │             │
       └─────────────┴──────┬──────┴─────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │    공유 상태 저장소       │
              │  (Git, DB, Message Bus)  │
              └─────────────────────────┘
```

### 2.2 에이전트별 상세 역할

#### Builder (개발자 에이전트)

주요 책임:
- 기능 요구사항 → 코드 변환
- 기술 문서 작성
- API 설계 및 구현
- 테스트 코드 작성 (TDD 지원)

스킬 세트:
```json
{
  "agent": "builder",
  "skills": [
    "code-generation",
    "api-design",
    "documentation",
    "git-operations",
    "dependency-management"
  ],
  "constraints": {
    "maxLinesPerCommit": 500,
    "requireTests": true,
    "codeStyle": "standard"
  }
}
```

#### Reviewer (검토자 에이전트)

주요 책임:
- 코드 품질 검사
- 보안 취약점 탐지
- 성능 병목 식별
- 코딩 표준 준수 여부 확인

스킬 세트:
```json
{
  "agent": "reviewer",
  "skills": [
    "static-analysis",
    "security-scan",
    "performance-analysis",
    "style-checking",
    "vulnerability-detection"
  ],
  "severityLevels": {
    "block": ["security", "crash"],
    "warn": ["performance", "complexity"],
    "info": ["style", "naming"]
  }
}
```

#### Tester (테스터 에이전트)

주요 책임:
- 단위 테스트 실행
- 통합 테스트 수행
- E2E 테스트 자동화
- 커버리지 리포트 생성
- 회귀 테스트

스킬 세트:
```json
{
  "agent": "tester",
  "skills": [
    "unit-testing",
    "integration-testing",
    "e2e-testing",
    "performance-testing",
    "coverage-analysis"
  ],
  "testStrategies": {
    "priority": ["unit", "integration", "e2e"],
    "coverageThreshold": 80,
    "maxDuration": "10m"
  }
}
```

#### Deployer (배포자 에이전트)

주요 책임:
- 스테이징 환경 배포
- 프로덕션 배포 (승인 후)
- 롤백 수행
- 모니터링 및 알림
- 칼날 배포(Canary Deployment)

스킬 세트:
```json
{
  "agent": "deployer",
  "skills": [
    "docker",
    "kubernetes",
    "ci-cd",
    "monitoring",
    "rollback"
  ],
  "environments": {
    "staging": { "autoDeploy": true },
    "production": { "requireApproval": true }
  }
}
```

---

## 3. 실전 구축: 4단계 설정

### 3.1 단계 1: 인프라 설정 (30분)

#### Docker Compose 구성

```yaml
# team-agents/docker-compose.yml
version: '3.8'

services:
  # 오케스트레이터 (중앙 관리)
  orchestrator:
    image: openclaw/openclaw:latest
    container_name: orchestrator
    ports:
      - "18800:18789"
    volumes:
      - ./orchestrator:/data
    environment:
      - OPENCLAW_ROLE=orchestrator
      - AGENT_REGISTRY_URL=http://agent-registry:8080
    networks:
      - agent-network
    command: gateway --mode orchestrator

  # Builder 에이전트
  builder:
    image: openclaw/openclaw:latest
    container_name: builder-agent
    ports:
      - "18801:18789"
    volumes:
      - ./builder:/data
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - OPENCLAW_ROLE=builder
      - ORCHESTRATOR_URL=http://orchestrator:18789
      - MAX_MEMORY=2G
    networks:
      - agent-network
    profiles:
      - with-agents

  # Reviewer 에이전트
  reviewer:
    image: openclaw/openclaw:latest
    container_name: reviewer-agent
    ports:
      - "18802:18789"
    volumes:
      - ./reviewer:/data
    environment:
      - OPENCLAW_ROLE=reviewer
      - ORCHESTRATOR_URL=http://orchestrator:18789
      - SECURITY_SCAN_ENABLED=true
    networks:
      - agent-network
    profiles:
      - with-agents

  # Tester 에이전트
  tester:
    image: openclaw/openclaw:latest
    container_name: tester-agent
    ports:
      - "18803:18789"
    volumes:
      - ./tester:/data
      - /tmp/test-results:/results
    environment:
      - OPENCLAW_ROLE=tester
      - ORCHESTRATOR_URL=http://orchestrator:18789
      - TEST_PARALLELISM=4
    networks:
      - agent-network
    profiles:
      - with-agents

  # Deployer 에이전트
  deployer:
    image: openclaw/openclaw:latest
    container_name: deployer-agent
    ports:
      - "18804:18789"
    volumes:
      - ./deployer:/data
      - ~/.kube/config:/root/.kube/config:ro
      - ~/.aws:/root/.aws:ro
    environment:
      - OPENCLAW_ROLE=deployer
      - ORCHESTRATOR_URL=http://orchestrator:18789
      - KUBECONFIG=/root/.kube/config
    networks:
      - agent-network
    profiles:
      - with-agents

  # 에이전트 레지스트리 (서비스 디스커버리)
  agent-registry:
    image: redis:7-alpine
    container_name: agent-registry
    ports:
      - "6379:6379"
    networks:
      - agent-network

  # 메시지 브로커 (에이전트 간 통신)
  message-bus:
    image: rabbitmq:3-management
    container_name: agent-message-bus
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: agent
      RABBITMQ_DEFAULT_PASS: secret
    networks:
      - agent-network

networks:
  agent-network:
    driver: bridge
```

#### 시작 스크립트

```bash
#!/bin/bash
# start-team-agents.sh

echo "🚀 팀 에이전트 시작하기..."

# 1. 네트워크 생성
docker network create agent-network 2>/dev/null || true

# 2. 기본 서비스 시작 (오케스트레이터, 레지스트리, 메시지 버스)
echo "📡 기본 인프라 시작..."
docker-compose up -d orchestrator agent-registry message-bus

# 3. 오케스트레이터 준비 대기
echo "⏳ 오케스트레이터 준비 중..."
until curl -s http://localhost:18800/health > /dev/null; do
  sleep 1
done
echo "✅ 오케스트레이터 준비 완료"

# 4. 에이전트 시작
echo "🤖 에이전트들 시작..."
docker-compose --profile with-agents up -d

# 5. 상태 확인
echo ""
echo "📊 에이전트 상태:"
docker-compose ps

echo ""
echo "🌐 접속 정보:"
echo "  오케스트레이터: http://localhost:18800"
echo "  Builder:        http://localhost:18801"
echo "  Reviewer:       http://localhost:18802"
echo "  Tester:         http://localhost:18803"
echo "  Deployer:       http://localhost:18804"
echo "  RabbitMQ 관리:  http://localhost:15672"
```

### 3.2 단계 2: 오케스트레이터 설정 (30분)

#### 워크플로우 정의

```javascript
// orchestrator/workflows/development.js

class DevelopmentWorkflow {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.agents = {
      builder: new AgentClient('builder', 'http://builder:18789'),
      reviewer: new AgentClient('reviewer', 'http://reviewer:18789'),
      tester: new AgentClient('tester', 'http://tester:18789'),
      deployer: new AgentClient('deployer', 'http://deployer:18789')
    };
  }

  /
   * 기능 개발 워크플로우
   */
  async developFeature(request) {
    const workflowId = generateUUID();
    const startTime = Date.now();
    
    this.log(`🎬 [${workflowId}] 기능 개발 워크플로우 시작`);
    this.log(`   요청: ${request.title}`);
    
    try {
      // Phase 1: 요구사항 분석 및 코드 생성
      this.log(`\n📋 Phase 1: 코드 생성`);
      const codeResult = await this.agents.builder.execute('generate-feature', {
        requirements: request.description,
        acceptanceCriteria: request.criteria,
        techStack: request.stack,
        workflowId
      });
      
      if (!codeResult.success) {
        throw new Error(`코드 생성 실패: ${codeResult.error}`);
      }
      
      this.log(`   ✅ 코드 생성 완료 (${codeResult.duration}ms)`);
      this.log(`   📁 파일: ${codeResult.files.length}개`);
      
      // Phase 2: 병렬 검토 (코드 리뷰 + 테스트 준비)
      this.log(`\n🔍 Phase 2: 병렬 검토`);
      const [reviewResult, testPrepResult] = await Promise.all([
        this.agents.reviewer.execute('review-code', {
          prUrl: codeResult.prUrl,
          checks: ['security', 'performance', 'style'],
          workflowId
        }),
        this.agents.tester.execute('prepare-tests', {
          feature: request.title,
          files: codeResult.files,
          workflowId
        })
      ]);
      
      this.log(`   ✅ 코드 리뷰 완료`);
      this.log(`      품질 점수: ${reviewResult.score}/100`);
      this.log(`      이슈: ${reviewResult.issues.length}개`);
      
      // 리뷰 결과에 따른 분기
      if (reviewResult.score < 60) {
        this.log(`   ❌ 품질 기준 미달 (60점 미만)`);
        return {
          workflowId,
          status: 'rejected',
          stage: 'review',
          reason: 'quality-standard-not-met',
          details: reviewResult
        };
      }
      
      // Phase 3: 테스트 실행
      this.log(`\n🧪 Phase 3: 테스트 실행`);
      const testResult = await this.agents.tester.execute('run-tests', {
        testSuite: testPrepResult.suite,
        coverage: {
          lines: 80,
          functions: 80,
          branches: 70
        },
        workflowId
      });
      
      this.log(`   ✅ 테스트 완료`);
      this.log(`      통과: ${testResult.passed}/${testResult.total}`);
      this.log(`      커버리지: ${testResult.coverage.percentage}%`);
      
      if (!testResult.success) {
        return {
          workflowId,
          status: 'failed',
          stage: 'test',
          details: testResult
        };
      }
      
      // Phase 4: 스테이징 배포
      this.log(`\n🚀 Phase 4: 스테이징 배포`);
      const deployResult = await this.agents.deployer.execute('deploy', {
        environment: 'staging',
        prNumber: codeResult.prNumber,
        smokeTests: true,
        workflowId
      });
      
      this.log(`   ✅ 스테이징 배포 완료`);
      this.log(`      URL: ${deployResult.url}`);
      
      // Phase 5: 사용자 승인 대기
      this.log(`\n⏳ Phase 5: 프로덕션 배포 대기`);
      const approval = await this.waitForApproval({
        workflowId,
        stagingUrl: deployResult.url,
        testReport: testResult.report
      });
      
      if (!approval.granted) {
        return {
          workflowId,
          status: 'pending-approval',
          stagingUrl: deployResult.url
        };
      }
      
      // Phase 6: 프로덕션 배포
      this.log(`\n🚀 Phase 6: 프로덕션 배포`);
      const prodDeployResult = await this.agents.deployer.execute('deploy', {
        environment: 'production',
        prNumber: codeResult.prNumber,
        strategy: 'canary',
        canaryPercentage: 10,
        workflowId
      });
      
      const duration = Date.now() - startTime;
      
      this.log(`\n✅ [${workflowId}] 워크플로우 완료 (${duration}ms)`);
      
      return {
        workflowId,
        status: 'success',
        duration,
        prUrl: codeResult.prUrl,
        stagingUrl: deployResult.url,
        productionUrl: prodDeployResult.url,
        metrics: {
          codeQuality: reviewResult.score,
          testCoverage: testResult.coverage.percentage,
          testPassRate: (testResult.passed / testResult.total) * 100
        }
      };
      
    } catch (error) {
      this.log(`\n❌ [${workflowId}] 워크플로우 실패: ${error.message}`);
      throw error;
    }
  }

  /
   * 핫픽스 워크플로우 (긴급)
   */
  async hotfix(request) {
    const workflowId = generateUUID();
    
    this.log(`🚨 [${workflowId}] 핫픽스 워크플로우 시작`);
    
    // 핫픽스는 검증 단계를 최소화
    const codeResult = await this.agents.builder.execute('generate-hotfix', {
      bug: request.description,
      severity: request.severity,
      workflowId
    });
    
    // 필수 보안 검사만
    const securityResult = await this.agents.reviewer.execute('security-scan', {
      code: codeResult.diff,
      workflowId
    });
    
    if (!securityResult.passed) {
      throw new Error('보안 검사 실패 - 핫픽스 불가');
    }
    
    // 최소 테스트
    await this.agents.tester.execute('smoke-test', {
      feature: request.affectedFeature,
      workflowId
    });
    
    // 즉시 프로덕션 배포
    return await this.agents.deployer.execute('deploy', {
      environment: 'production',
      prNumber: codeResult.prNumber,
      strategy: 'immediate',
      workflowId
    });
  }

  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
    // Slack/Discord 알림도 함께
  }

  async waitForApproval(context) {
    // 실제로는 Slack 버튼, 이메일, 대시보드 등으로 승인 대기
    return new Promise((resolve) => {
      // 예시: 자동 승인 (실제로는 사용자 입력 필요)
      setTimeout(() => {
        resolve({ granted: true, by: 'auto' });
      }, 5000);
    });
  }
}

module.exports = DevelopmentWorkflow;
```

### 3.3 단계 3: 에이전트별 세부 설정 (1시간)

각 에이전트의 `openclaw.json` 설정:

#### Builder 설정

```json
{
  "agent": {
    "name": "builder",
    "role": "code-generation",
    "orchestrator": "http://orchestrator:18789"
  },
  "models": {
    "default": {
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022",
      "temperature": 0.2
    }
  },
  "skills": {
    "code-generation": {
      "templates": {
        "react": "~/templates/react-component",
        "api": "~/templates/api-endpoint",
        "test": "~/templates/unit-test"
      },
      "maxTokens": 4000,
      "languages": ["typescript", "javascript", "python"]
    },
    "git": {
      "autoCommit": true,
      "commitStyle": "conventional",
      "branchNaming": "feature/{id}-{description}"
    }
  },
  "constraints": {
    "maxFilesPerRequest": 10,
    "maxLinesPerFile": 500,
    "requireTests": true,
    "codeStyle": "eslint:recommended"
  }
}
```

#### Reviewer 설정

```json
{
  "agent": {
    "name": "reviewer",
    "role": "code-review",
    "orchestrator": "http://orchestrator:18789"
  },
  "skills": {
    "static-analysis": {
      "tools": ["eslint", "prettier", "typescript"],
      "config": "~/configs/eslint.json"
    },
    "security-scan": {
      "tools": ["semgrep", "trivy"],
      "severity": "high",
      "blockOnCritical": true
    },
    "performance": {
      "maxComplexity": 10,
      "maxFunctionLength": 50,
      "bundleSize": {
        "warn": "100kb",
        "error": "500kb"
      }
    }
  },
  "reviewRules": {
    "autoApprove": {
      "minScore": 80,
      "noCriticalIssues": true,
      "testsPassing": true
    }
  }
}
```

### 3.4 단계 4: 통합 테스트 (1시간)

```bash
#!/bin/bash
# test-workflow.sh

echo "🧪 팀 에이전트 통합 테스트"

# 1. 헬스체크
echo "1️⃣ 헬스체크"
for agent in orchestrator builder reviewer tester deployer; do
  port=$(getPort $agent)
  if curl -s http://localhost:$port/health; then
    echo "  ✅ $agent"
  else
    echo "  ❌ $agent"
    exit 1
  fi
done

# 2. 워크플로우 테스트
echo "2️⃣ 기능 개발 워크플로우 테스트"
curl -X POST http://localhost:18800/workflow/develop \
  -H "Content-Type: application/json" \
  -d '{
    "title": "테스트 기능",
    "description": "사용자 프로필 페이지에 다크모드 토글 추가",
    "stack": "react,typescript",
    "criteria": ["토글 버튼 추가", "상태 저장", "전환 애니메이션"]
  }'

# 3. 결과 확인
echo "3️⃣ 워크플로우 상태 확인"
curl http://localhost:18800/workflows/latest

echo "✅ 모든 테스트 통과!"
```

---

## 4. 실전 사용 예시

### 4.1 시나리오 1: 새 기능 개발

```
👤 개발자 (Slack #dev-requests):
@orchestrator 
제목: 결제 페이지에 카드 번호 자동 완성 기능
설명: 사용자가 카드 번호 입력 시 카드사 자동 인식 및
      형식 자동 포맷팅 (4자리마다 공백)
기술스택: React, TypeScript
우선순위: 높음
마감일: 이번 주 금요일

🤖 Orchestrator:
🎬 워크플로우 #2024-001 시작
"결제 페이지 카드 번호 자동 완성 기능"

━━━━━━━━━━━━━━━━━━━━━━
Phase 1/6: 코드 생성 (Builder)
━━━━━━━━━━━━━━━━━━━━━━

👷 Builder:
   요구사항 분석 중...
   - 카드 번호 입력 필드 개선
   - Luhn 알고리즘으로 카드사 식별
   - 4자리마다 하이픈 자동 삽입
   
   코드 생성 중...
   ✅ payment/CardInput.tsx
   ✅ payment/useCardFormatter.ts
   ✅ payment/cardValidation.ts
   ✅ tests/CardInput.test.tsx
   
   스토리북 예시 작성 중...
   ✅ CardInput.stories.tsx
   
   Git 작업 중...
   ✅ 브랜치 생성: feature/card-auto-format-001
   ✅ 커밋: "feat: add card number auto-formatting"
   ✅ PR 생성: #234

⏱️ 소요: 3분 20초

━━━━━━━━━━━━━━━━━━━━━━
Phase 2/6: 코드 리뷰 (Reviewer) + 테스트 준비 (Tester)
━━━━━━━━━━━━━━━━━━━━━━

🔍 Reviewer:
   코드 분석 중...
   
   ✅ 보안 검사:
      - 카드 번호 메모리 노출 체크: 통과
      - XSS 취약점: 없음
      - 의존성 취약점: 없음
   
   ✅ 성능 검사:
      - 리렌더링 최적화: 양호
      - 번들 사이즈: +2.3KB (허용)
   
   ✅ 코드 품질:
      - 복잡도: 7/10 (양호)
      - 테스트 커버리지: 92%
   
   ⚠️ 개선 제안 (2개):
      - CardInput.tsx:120 debounce 적용 권장
      - JSDoc 주소 추가 권장
   
   📊 종합 점수: 87/100
   ✅ 자동 승인

🧪 Tester (병렬):
   테스트 준비 중...
   - 단위 테스트: 8개
   - 통합 테스트: 3개
   - E2E 테스트: 2개
   
   준비 완료 ✅

⏱️ 소요: 2분 15초

━━━━━━━━━━━━━━━━━━━━━━
Phase 3/6: 테스트 실행 (Tester)
━━━━━━━━━━━━━━━━━━━━━━

🧪 Tester:
   테스트 실행 중...
   
   단위 테스트: 8/8 ✅
   - 카드사 식별 (Visa, Master, Amex)
   - 포맷팅 로직
   - Luhn 검증
   - 에러 처리
   
   통합 테스트: 3/3 ✅
   - 실제 결제 플로우
   - 상태 관리
   - 이벤트 핸들링
   
   E2E 테스트: 2/2 ✅
   - 사용자 입력 시뮬레이션
   - 브라우저 자동화
   
   커버리지:
   - 구문: 94%
   - 분기: 89%
   - 함수: 96%
   - 라인: 93%
   
   ✅ 모든 테스트 통과

⏱️ 소요: 1분 45초

━━━━━━━━━━━━━━━━━━━━━━
Phase 4/6: 스테이징 배포 (Deployer)
━━━━━━━━━━━━━━━━━━━━━━

🚀 Deployer:
   빌드 중...
   ✅ Next.js 빌드 완료
   
   Docker 이미지 빌드 중...
   ✅ 이미지 빌드 완료 (234MB)
   
   스테이징 배포 중...
   ✅ Kubernetes 배포 완료
   ✅ 헬스체크 통과
   ✅ 스모크 테스트 통과
   
   🌐 스테이징 URL:
   https://staging.example.com/payment

⏱️ 소요: 2분 30초

━━━━━━━━━━━━━━━━━━━━━━
Phase 5/6: 수동 검증 대기
━━━━━━━━━━━━━━━━━━━━━━

⏳ Orchestrator:
   프로덕션 배포 승인 대기 중...
   
   📋 검증 체크리스트:
   - [ ] 스테이징에서 직접 테스트
   - [ ] 디자인 팀 확인
   - [ ] PO 승인
   
   💬 Slack #dev-team에 알림 발송
   
👤 PO (30분 후):
   @orchestrator 스테이징 확인했어요. 프로덕션 배포해주세요.

✅ 승인 완료

━━━━━━━━━━━━━━━━━━━━━━
Phase 6/6: 프로덕션 배포 (Deployer)
━━━━━━━━━━━━━━━━━━━━━━

🚀 Deployer:
   칼날 배포(Canary) 시작...
   
   1단계: 10% 트래픽 (5분 모니터링)
      ✅ 에러율: 0.1% (정상)
      ✅ 응답 시간: 120ms (정상)
   
   2단계: 50% 트래픽 (5분 모니터링)
      ✅ 에러율: 0.1% (정상)
      ✅ 응답 시간: 115ms (정상)
   
   3단계: 100% 트래픽
      ✅ 배포 완료
      
   📊 최종 메트릭:
      - 배포 소요: 15분
      - 가동 시간: 99.99%
      - 롤백: 불필요

⏱️ 소요: 15분

━━━━━━━━━━━━━━━━━━━━━━

🎉 워크플로우 #2024-001 완료!

📊 종합 결과:
총 소요: 25분 10초
코드 품질: 87/100
테스트 커버리지: 93%
배포 상태: ✅ 성공

🔗 링크:
- PR: https://github.com/.../pull/234
- 스테이징: https://staging.example.com/payment
- 프로덕션: https://example.com/payment
- 모니터링: https://grafana.example.com/d/payment

📈 효과:
- 수동 작업 시간: 4시간 → 25분 (90% 절약)
- 버그 발생률: -40%
- 코드 품질: +25%

💡 개선 제안:
다음 번 유사 기능은 Builder 템플릿으로 만들어
재사용하시는 것을 권장합니다.

[📊 상세 리포트 보기] [🔄 비슷한 기능 개발] [⚙️ 설정 변경]
```

---

## 5. 모니터링 및 운영

### 5.1 실시간 모니터링 대시보드

```javascript
// monitoring/dashboard.js

class AgentDashboard {
  async getStatus() {
    return {
      agents: {
        orchestrator: await this.checkAgent('orchestrator'),
        builder: await this.checkAgent('builder'),
        reviewer: await this.checkAgent('reviewer'),
        tester: await this.checkAgent('tester'),
        deployer: await this.checkAgent('deployer')
      },
      workflows: {
        running: await this.getRunningWorkflows(),
        completed: await this.getCompletedWorkflows(24),
        failed: await this.getFailedWorkflows(24)
      },
      metrics: {
        avgWorkflowDuration: '12m 30s',
        successRate: '94%',
        codeQuality: '84/100',
        testCoverage: '88%'
      }
    };
  }
}
```

### 5.2 장애 대응

```bash
# 에이전트 재시작 (예시)
openclaw agents list

# 워크플로우 강제 중지 (예시)
openclaw message "Cancel workflow <workflow-id>"

# 롤백 (예시)
openclaw message "Rollback deployment <deployment-id>"
```

> ⚠️ 참고: 위 명령어는 멀티 에이전트 워크플로우의 예시입니다. 실제 OpenClaw CLI 명령어는 공식 문서를 참조하세요.
# 에이전트 재시작
openclaw agents list

# 워크플로우 강제 중지
openclaw message "Cancel workflow <workflow-id>"

# 롤백
openclaw message "Rollback deployment <deployment-id>"
```

---

## 6. 다음 단계

- [업무 분리 패턴 상세](/operations/workspace)
- [보안 가이드](/security/warnings)
- [로그 및 모니터링](/operations/logging)
