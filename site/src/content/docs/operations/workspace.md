---
title: 업무 분리 패턴 (워크스페이스 & 서브 에이전트)
description: 프로젝트별 격리, 권한 분리, 서브 에이전트 구축을 위한 완벽 가이드
---

> ⏱️ 예상 소요시간: 1-2시간 (기본 설정 30분 + 고급 패턴 1시간)  
> 🎯 목표: 
> - 개인/업무 환경 완전 분리
> - 팀/프로젝트별 독립 에이전트 구축
> - 보안 권한 세분화 및 최소화
> - 서브 에이전트 자동화 파이프라인 구축

---

## 1. 왜 업무 분리가 필요한가?

### ⚠️ 문제 상황

하나의 OpenClaw 인스턴스로 모든 것을 처리할 때 발생하는 문제들:

```
❌ 보안 문제
- 개인 이메일과 회사 이메일이 섞임
- 민감한 API 키가 노출될 위험
- 팀원이 내 개인 데이터에 접근 가능

❌ 설정 충돌
- 프로젝트 A용 설정이 프로젝트 B에 영향
- 채널 연결이 꼬여 메시지가 잘못 감
- 스킬 버전 충돌

❌ 관리 복잡성
- 누가 어떤 작업을 했는지 추적 불가
- 로그가 섞여 디버깅 어려움
- 백업/복원 시 모든 것이 한꺼번에 처리됨
```

### ✅ 해결책: 업무 분리 패턴

| 분리 레벨 | 사용 사례 | 구현 방법 |
|-----------|----------|----------|
| 프로필 관리 | 개인 vs 업무 | `openclaw profiles` |
| 워크스페이스 분리 | 프로젝트별 | 디렉토리 격리 |
| 서브 에이전트 | 역할 기반 | 멀티 인스턴스 |
| 환경 분리 | 개발/스테이징/프로덕션 | 설정 파일 분리 |

---

## 2. 기본: 프로필(Profile) 시스템

### 2.1 프로필이란?

프로필은 독립된 설정 환경입니다. 각 프로필은 별도의:
- 설정 파일 (`openclaw.json`)
- 스킬 저장소
- 채널 연결
- 로그 파일
- 데이터베이스

을 가집니다.

### 2.2 프로필 생성 및 관리

#### 프로필 생성

```bash
# 기본 프로필 확인
ls ~/.openclaw/profiles
# 출력: default

# 새 프로필 생성
openclaw profiles create-profile work
# work 프로필이 생성됨

# 개인용 프로필 생성
openclaw profiles create-profile personal

# 프로젝트별 프로필 생성
openclaw profiles create-profile project-alpha
openclaw profiles create-profile project-beta
```

#### 프로필 전환

```bash
# 프로필 전환
export OPENCLAW_PROFILE=work
# 이제 모든 명령은 work 프로필에서 실행됨

# 특정 프로필로 한 번만 실행
openclaw --profile work gateway status
# 또는
OPENCLAW_PROFILE=work openclaw status

# 현재 프로필 확인
echo $OPENCLAW_PROFILE
# 출력: work
```

#### 프로필 구조

```
~/.openclaw/
├── config.json                    # 기본 설정 (프로필 공통)
├── profiles/
│   ├── default/                   # 기본 프로필
│   │   ├── openclaw.json         # 프로필별 설정
│   │   ├── skills/               # 설치된 스킬
│   │   ├── logs/                 # 로그 파일
│   │   └── data/                 # 데이터베이스
│   │
│   ├── work/                      # 업무용 프로필
│   │   ├── openclaw.json
│   │   ├── skills/
│   │   ├── logs/
│   │   └── data/
│   │
│   ├── personal/                  # 개인용 프로필
│   │   ├── openclaw.json
│   │   ├── skills/
│   │   ├── logs/
│   │   └── data/
│   │
│   └── project-alpha/             # 프로젝트별 프로필
│       ├── openclaw.json
│       ├── skills/
│       ├── logs/
│       └── data/
```

### 2.3 실전: 개인/업무 완전 분리

#### 시나리오

- 개인용: 쇼핑, 일정, 가족 연락, 개인 메모
- 업무용: 회사 이메일, 업무용 Slack, 프로젝트 관리

#### 단계별 설정

Step 1: 개인용 프로필 설정

```bash
# 개인용 프로필 생성 및 전환
openclaw profiles create-profile personal
export OPENCLAW_PROFILE=personal

# 설정 파일 편집
openclaw config
```

```json
{
  "profile": {
    "name": "personal",
    "description": "개인용 설정"
  },
  "gateway": {
    "port": 18790,
    "auth": {
      "mode": "token",
      "token": "personal-token-123"
    }
  },
  "models": {
    "default": {
      "provider": "anthropic",
      "apiKey": "${ANTHROPIC_PERSONAL_KEY}"
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_PERSONAL_BOT}",
      "dmPolicy": "pairing"
    },
    "imessage": {
      "enabled": true
    }
  },
  "skills": {
    "installed": [
      "shopping",
      "weather",
      "calendar",
      "notes"
    ]
  }
}
```

Step 2: 업무용 프로필 설정

```bash
# 업무용 프로필 생성 및 전환
openclaw profiles create-profile work
export OPENCLAW_PROFILE=work

# 설정 파일 편집
openclaw config
```

```json
{
  "profile": {
    "name": "work",
    "description": "회사 업무용 설정"
  },
  "gateway": {
    "port": 18791,
    "auth": {
      "mode": "token",
      "token": "work-token-456"
    }
  },
  "models": {
    "default": {
      "provider": "openai",
      "apiKey": "${OPENAI_WORK_KEY}"
    }
  },
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "${SLACK_WORK_BOT}",
      "workspace": "mycompany"
    },
    "telegram": {
      "enabled": false
    }
  },
  "skills": {
    "installed": [
      "github",
      "jira",
      "confluence",
      "email"
    ]
  },
  "security": {
    "allowFrom": ["@company.com"],
    "dmPolicy": "pairing"
  }
}
```

Step 3: 빠른 전환 설정

```bash
# ~/.bashrc 또는 ~/.zshrc에 추가

# OpenClaw 프로필 전환 함수
oc-personal() {
  export OPENCLAW_PROFILE=personal
  echo "✅ 개인용 프로필 활성화 (포트: 18790)"
  openclaw status
}

oc-work() {
  export OPENCLAW_PROFILE=work
  echo "✅ 업무용 프로필 활성화 (포트: 18791)"
  openclaw status
}

# 별명 (alias)
alias ocp='oc-personal'
alias ocw='oc-work'
```

사용 예시:
```bash
# 개인용으로 전환
ocp
# 출력: ✅ 개인용 프로필 활성화 (포트: 18790)

# 업무용으로 전환
ocw
# 출력: ✅ 업무용 프로필 활성화 (포트: 18791)
```

---

## 3. 중급: 워크스페이스(Workspace) 패턴

### 3.1 프로필 vs 워크스페이스

| 구분 | 프로필 | 워크스페이스 |
|------|--------|-------------|
| 범위 | 설정 단위 | 프로젝트 단위 |
| 격리 수준 | 설정 파일 분리 | 완전 독립 인스턴스 |
| 사용 사례 | 개인/업무 구분 | 팀/프로젝트별 격리 |
| 게이트웨이 | 공유 가능 | 독립적 실행 |

### 3.2 프로젝트별 워크스페이스 구축

#### 디렉토리 구조

```
~/workspaces/
├── personal/                    # 개인 워크스페이스
│   ├── .openclaw/              # OpenClaw 데이터
│   ├── projects/               # 개인 프로젝트
│   └── docker-compose.yml      # 개인용 Docker
│
├── company-a/                   # A회사 워크스페이스
│   ├── .openclaw/
│   ├── projects/
│   ├── shared/                 # 팀 공유 자료
│   └── docker-compose.yml
│
├── company-b/                   # B회사 워크스페이스 (프리랜서)
│   ├── .openclaw/
│   ├── projects/
│   └── docker-compose.yml
│
└── side-project/               # 사이드 프로젝트
    ├── .openclaw/
    ├── projects/
    └── docker-compose.yml
```

#### Docker 기반 격리 (권장)

각 워크스페이스를 Docker 컨테이너로 완전히 격리합니다.

docker-compose.yml 템플릿:

```yaml
version: '3.8'

services:
  openclaw:
    image: openclaw/openclaw:latest
    container_name: openclaw-${WORKSPACE_NAME}
    ports:
      - "${GATEWAY_PORT}:18789"
    volumes:
      - ./.openclaw:/data
      - ./projects:/projects
    environment:
      - OPENCLAW_PROFILE=${WORKSPACE_NAME}
      - OPENCLAW_CONFIG_PATH=/data/openclaw.json
    networks:
      - openclaw-network
    restart: unless-stopped

  # 선택: 프로젝트별 DB
  postgres:
    image: postgres:15
    container_name: postgres-${WORKSPACE_NAME}
    environment:
      POSTGRES_DB: ${WORKSPACE_NAME}
      POSTGRES_USER: openclaw
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - openclaw-network
    profiles:
      - with-db

volumes:
  postgres-data:

networks:
  openclaw-network:
    driver: bridge
```

.env 파일:

```bash
WORKSPACE_NAME=company-a
GATEWAY_PORT=18791
DB_PASSWORD=secure-password-123
```

#### 워크스페이스 스위처 스크립트

```bash
#!/bin/bash
# ~/bin/workspace-switch.sh

WORKSPACE_DIR="$HOME/workspaces"

switch_workspace() {
    local workspace=$1
    
    if [ ! -d "$WORKSPACE_DIR/$workspace" ]; then
        echo "❌ 워크스페이스 '$workspace'가 존재하지 않습니다"
        echo "생성하시겠습니까? (y/n)"
        read answer
        if [ "$answer" = "y" ]; then
            create_workspace $workspace
        fi
        return
    fi
    
    # 현재 워크스페이스 중지
    cd "$WORKSPACE_DIR"
    for dir in */; do
        if [ -f "$dir/docker-compose.yml" ]; then
            cd "$dir"
            docker-compose down 2>/dev/null
            cd ..
        fi
    done
    
    # 새 워크스페이스 시작
    cd "$WORKSPACE_DIR/$workspace"
    docker-compose up -d
    
    # 환경 변수 설정
    export OPENCLAW_WORKSPACE=$workspace
    export OPENCLAW_CONFIG_PATH="$WORKSPACE_DIR/$workspace/.openclaw/openclaw.json"
    
    echo "✅ 워크스페이스 '$workspace' 활성화"
    echo "🌐 Gateway: http://localhost:$(grep GATEWAY_PORT .env | cut -d= -f2)"
    
    # 상태 확인
    docker-compose ps
}

create_workspace() {
    local workspace=$1
    mkdir -p "$WORKSPACE_DIR/$workspace"
    cd "$WORKSPACE_DIR/$workspace"
    
    # 템플릿 복사
    cp ~/templates/openclaw/docker-compose.yml .
    cp ~/templates/openclaw/.env.template .env
    
    # 환경 변수 설정
    sed -i "s/WORKSPACE_NAME=.*/WORKSPACE_NAME=$workspace/" .env
    
    # OpenClaw 디렉토리 생성
    mkdir -p .openclaw
    
    echo "✅ 새 워크스페이스 '$workspace' 생성 완료"
    echo "⚙️ .env 파일을 편집한 후 'workspace-switch $workspace'를 실행하세요"
}

# 메인
switch_workspace $1
```

사용 예시:
```bash
# 워크스페이스 전환
workspace-switch company-a
# 출력:
# ✅ 워크스페이스 'company-a' 활성화
# 🌐 Gateway: http://localhost:18791

# 다른 워크스페이스로 전환
workspace-switch personal
```

---

## 4. 고급: 서브 에이전트 (Sub-Agent) 아키텍처

### 4.1 서브 에이전트란?

서브 에이전트는 하나의 OpenClaw 게이트웨이 아래에서 실행되는 독립적인 에이전트 인스턴스입니다. 각 서브 에이전트는:

- 독립적인 스킬 세트
- 독립적인 메모리/컨텍스트
- 독립적인 채널 연결
- 특정 역할/권한

을 가집니다.

### 4.2 서브 에이전트 vs 프로필

| 구분 | 프로필 | 서브 에이전트 |
|------|--------|---------------|
| 동시 실행 | ❌ 한 번에 하나만 | ✅ 동시에 여러 개 |
| 통신 | 불가능 | 에이전트 간 통신 가능 |
| 상위 제어 | 없음 | 오케스트레이터가 관리 |
| 사용 사례 | 환경 전환 | 역할 기반 자동화 |

### 4.3 서브 에이전트 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                      │
│                  (Master Controller)                     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼────┐ ┌────▼────┐ ┌─────▼──────┐
│  Builder   │ │ Reviewer│ │  Deployer  │
│   Agent    │ │  Agent  │ │   Agent    │
└─────┬──────┘ └────┬────┘ └─────┬──────┘
      │             │            │
      └─────────────┴────────────┘
                    │
            ┌───────▼────────┐
            │ Orchestrator   │
            │   (Coordinator)│
            └────────────────┘
```

### 4.4 실전: 개발 팀 서브 에이전트 구축

#### 시나리오

개발 팀을 위한 4개의 서브 에이전트:
1. Builder: 코드 작성, 기능 구현
2. Reviewer: 코드 리뷰, 품질 검사
3. Tester: 테스트 작성, 실행
4. Deployer: 배포, 모니터링

#### 설정 단계

Step 1: 마스터 게이트웨이 설정

```bash
# 마스터 프로필 생성
openclaw profiles create-profile dev-team-master
export OPENCLAW_PROFILE=dev-team-master

# 설정 파일
openclaw config
```

```json
{
  "gateway": {
    "port": 18800,
    "auth": {
      "mode": "token",
      "token": "master-token"
    },
    "subAgents": {
      "enabled": true,
      "agents": [
        {
          "name": "builder",
          "port": 18801,
          "role": "code-generation",
          "allowedSkills": ["github", "code-gen", "docs"]
        },
        {
          "name": "reviewer",
          "port": 18802,
          "role": "code-review",
          "allowedSkills": ["github", "security", "lint"]
        },
        {
          "name": "tester",
          "port": 18803,
          "role": "testing",
          "allowedSkills": ["testing", "coverage", "e2e"]
        },
        {
          "name": "deployer",
          "port": 18804,
          "role": "deployment",
          "allowedSkills": ["docker", "k8s", "ci-cd"]
        }
      ]
    }
  }
}
```

Step 2: 각 서브 에이전트 설정

```bash
# Builder 에이전트
openclaw agents add builder
openclaw config
```

```json
{
  "name": "builder",
  "role": "Generate code based on requirements",
  "model": {
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022"
  },
  "skills": ["github", "code-gen", "docs", "api-design"],
  "constraints": {
    "maxFilesPerRequest": 10,
    "allowedFileTypes": [".js", ".ts", ".jsx", ".tsx", ".css"],
    "blockedOperations": ["delete", "exec"]
  },
  "channels": {
    "slack": {
      "channel": "#dev-builder",
      "notifyOnComplete": true
    }
  }
}
```

Step 3: 오케스트레이터 설정

```javascript
// ~/.openclaw/agents/orchestrator/workflow.js

class DevWorkflow {
  constructor() {
    this.agents = {
      builder: new SubAgent('builder'),
      reviewer: new SubAgent('reviewer'),
      tester: new SubAgent('tester'),
      deployer: new SubAgent('deployer')
    };
  }

  async handleRequest(request) {
    const { type, description, priority } = request;
    
    switch(type) {
      case 'feature':
        return await this.featureWorkflow(description);
      case 'bugfix':
        return await this.bugfixWorkflow(description);
      case 'hotfix':
        return await this.hotfixWorkflow(description);
      default:
        throw new Error(`Unknown request type: ${type}`);
    }
  }

  async featureWorkflow(description) {
    const workflowId = generateId();
    
    // Step 1: Builder - 코드 생성
    console.log(`[${workflowId}] Builder: 코드 생성 시작`);
    const code = await this.agents.builder.run('generate-code', {
      description,
      includeTests: true,
      includeDocs: true
    });
    
    // Step 2: Reviewer - 코드 리뷰
    console.log(`[${workflowId}] Reviewer: 코드 리뷰 시작`);
    const review = await this.agents.reviewer.run('review-code', {
      code,
      checks: ['security', 'performance', 'style']
    });
    
    if (!review.passed) {
      return {
        status: 'failed',
        stage: 'review',
        issues: review.issues
      };
    }
    
    // Step 3: Tester - 테스트 실행
    console.log(`[${workflowId}] Tester: 테스트 실행`);
    const testResult = await this.agents.tester.run('run-tests', {
      code,
      coverage: 80
    });
    
    if (!testResult.passed) {
      return {
        status: 'failed',
        stage: 'test',
        failures: testResult.failures
      };
    }
    
    // Step 4: Deployer - 배포
    console.log(`[${workflowId}] Deployer: 스테이징 배포`);
    const deployment = await this.agents.deployer.run('deploy', {
      environment: 'staging',
      code,
      runSmokeTests: true
    });
    
    return {
      status: 'success',
      workflowId,
      prUrl: code.prUrl,
      stagingUrl: deployment.url,
      coverage: testResult.coverage
    };
  }
}

module.exports = DevWorkflow;
```

### 4.5 실제 사용 예시

#### 예시 1: 새 기능 개발

```
User (Slack #dev-requests):
@orchestrator 로그인 페이지에 "비밀번호 찾기" 기능 추가해줘

Orchestrator:
🎬 워크플로우 #1234 시작
"비밀번호 찾기 기능 추가"

[14:32:05] Builder 🔨:
   코드 생성 중...
   - forgot-password/page.tsx
   - forgot-password/form.tsx
   - api/auth/forgot-password.ts
   - tests/forgot-password.test.tsx
   
   ✅ 완료 (2분 15초)
   PR #567 생성됨

[14:34:20] Reviewer 🔍:
   코드 리뷰 중...
   - 보안 검사: ✅ 통과
   - 성능 검사: ✅ 통과
   - 스타일 검사: ⚠️ 2개 경고
   
   ✅ 승인 (1분 30초)

[14:35:50] Tester 🧪:
   테스트 실행 중...
   - 단위 테스트: 12/12 ✅
   - 통합 테스트: 4/4 ✅
   - E2E 테스트: 2/2 ✅
   - 커버리지: 87%
   
   ✅ 통과 (45초)

[14:36:35] Deployer 🚀:
   스테이징 배포 중...
   - 빌드: ✅
   - 배포: ✅
   - 스모크 테스트: ✅
   
   ✅ 완료 (1분 10초)
   URL: https://staging.example.com/forgot-password

━━━━━━━━━━━━━━━━━━━━━━
🎉 워크플로우 #1234 완료 (총 4분 40초)

📊 결과:
- PR: #567 (대기 중)
- 스테이징: https://staging.example.com/forgot-password
- 테스트 커버리지: 87%

👥 다음 조치:
- 수동 리뷰 후 PR 머지
- 프로덕션 배포 승인 필요

[PR 보기] [스테이징 확인] [프로덕션 배포]
```

#### 예시 2: 긴급 핫픽스

```
User:
@orchestrator 프로덕션 장애! 결제가 안 됨 - 핫픽스 필요

Orchestrator:
🚨 긴급 핫픽스 워크플로우 #1235

⚡ 고속 모드 활성화 (리뷰/테스트 축소)

[14:40:10] Builder 🔨:
   긴급 수정 중...
   - payment/gateway.ts 수정
   - 결제 검증 로직 롤백
   
   ✅ 완료 (30초)

[14:40:40] Reviewer 🔍 (자동):
   - 보안 검사: ✅ 통과
   - 자동 승인 (핫픽스 모드)

[14:40:50] Tester 🧪 (핵심만):
   - 결제 플로우 테스트: ✅
   
   ✅ 통과 (20초)

[14:41:10] Deployer 🚀:
   프로덕션 배포 중...
   - 롤링 배포: ✅
   - 헬스체크: ✅
   
   ✅ 완료 (40초)

━━━━━━━━━━━━━━━━━━━━━━
🎉 핫픽스 #1235 완료 (총 1분 30초)

⚠️ 사후 조치 필요:
- 원인 분석 및 롱텀 픽스 개발
- 장애 보고서 작성
- 테스트 커버리지 보완
```

---

## 5. 보안 및 권한 관리

### 5.1 최소 권한 원칙

각 서브 에이전트에게 필요한 최소한의 권한만 부여합니다.

```json
{
  "security": {
    "agents": {
      "builder": {
        "github": {
          "permissions": ["contents:write", "pull_requests:write"],
          "blockedRepos": ["production-config", "secrets"]
        },
        "filesystem": {
          "read": ["./src", "./tests"],
          "write": ["./src", "./tests"],
          "blocked": ["./config", "./secrets"]
        },
        "network": {
          "allowedHosts": ["api.github.com", "registry.npmjs.org"],
          "blockedHosts": ["*"]
        }
      },
      "deployer": {
        "kubernetes": {
          "namespace": "staging",
          "blockedNamespaces": ["production"]
        }
      }
    }
  }
}
```

### 5.2 감사 로그

모든 서브 에이전트의 행동을 기록합니다.

```javascript
// audit-logger.js
class AuditLogger {
  async log(agentName, action, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      agent: agentName,
      action,
      details,
      user: details.userId,
      ip: details.ip,
      result: details.result
    };
    
    // 로그 파일에 저장
    await this.appendToFile('audit.log', logEntry);
    
    // 실시간 알림 (중요 작업)
    if (this.isCritical(action)) {
      await this.sendAlert(logEntry);
    }
  }
}
```

---

## 6. 모범 사례 및 팁

### 6.1 디버깅

```bash
# 특정 서브 에이전트 로그 확인
openclaw logs

# 모든 서브 에이전트 상태 확인
openclaw agents list

# 워크플로우 재실행
openclaw message "Rerun workflow <workflow-id>"
```

### 6.2 백업

```bash
# 프로필 백업
cp -r ~/.openclaw/profiles/work ./work-backup

# 워크스페이스 전체 백업
tar -czf workspace-backup.tar.gz ~/workspaces/company-a/
```

### 6.3 문제 해결

문제: 서브 에이전트가 응답하지 않음

```bash
# 1. 상태 확인
openclaw health

# 2. 재시작
openclaw message "Restart builder agent"

# 3. 로그 확인
openclaw logs --lines 100
```

---

## 7. 다음 단계

- [로그 및 백업 관리](/operations/logging)
- [보안 가이드 - 스킬 체크리스트](/security/skill-checklist)
- [팀 에이전트 운영 고급](/usecases/team-agents)
