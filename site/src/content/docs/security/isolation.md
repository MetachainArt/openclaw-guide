---
title: 격리 및 최소권한
description: OpenClaw를 안전하게 실행하기 위한 아키텍처 패턴
---

> 🔒 **보안 필수**  
> ⏱️ **예상 소요시간**: 30분  
> 🎯 **목표**: 방어 심층(Defense in Depth) 구현

## 격리 전략

### 1. 환경 격리

| 레벨 | 방법 | 권장도 |
|------|------|--------|
| **프로세스** | 별도 사용자 계정 | ⭐⭐⭐ |
| **컨테이너** | Docker | ⭐⭐⭐⭐ |
| **가상머신** | VM / WSL2 | ⭐⭐⭐⭐⭐ |
| **물리적** | 별도 PC/서버 | ⭐⭐⭐⭐⭐ |

### 2. 네트워크 격리

```bash
# Tailscale 사용 (권장)
openclaw gateway --bind 127.0.0.1
tailscale serve 18789

# VPN 낸부에서만 접근
openclaw gateway --allowed-ips 10.0.0.0/8
```

## 최소권한 원칙

### 파일 시스템

```bash
# 전용 사용자 생성
sudo useradd -m openclaw
sudo su - openclaw

# 권한 제한
chmod 700 ~/.openclaw
```

### API 키

- 필요한 권한만 부여
- 정기적인 키 회전
- 별도의 키 per 프로필

### 네트워크

```json
{
  "security": {
    "allowedHosts": [
      "api.openai.com",
      "api.anthropic.com"
    ],
    "blockPrivateIPs": true
  }
}
```

## 체크리스트

- [ ] 전용 계정으로 실행
- [ ] Docker/WSL2 격리
- [ ] 최소 필요 권한만 부여
- [ ] 네트워크 접근 제한
- [ ] 정기적인 감사 로그 검토

---

## 다음 단계

- [60가지 활용 사례](/usecases/all-cases)
