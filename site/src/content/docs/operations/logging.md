---
title: 로그 및 백업
description: OpenClaw 로그 확인 및 설정 백업 방법
---

> ⏱️ **예상 소요시간**: 15분  
> 🎯 **목표**: 로그 확인 및 백업 설정

## 로그 확인

### 실시간 로그

```bash
# 게이트웨이 로그
openclaw gateway logs

# 에이전트 로그
openclaw agent logs

# 팔로우 모드
openclaw gateway logs -f
```

### 로그 파일 위치

```
~/.openclaw/
├── logs/
│   ├── gateway.log
│   ├── agent.log
│   └── errors.log
```

### 로그 레벨 설정

```bash
# 디버그 모드
openclaw gateway --verbose

# 설정 파일에서
{
  "logging": {
    "level": "debug"
  }
}
```

## 백업

### 설정 백업

```bash
# 전체 설정 백업
tar -czf openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw/

# 자동 백업 스크립트
#!/bin/bash
BACKUP_DIR="~/backups/openclaw"
mkdir -p $BACKUP_DIR
cp -r ~/.openclaw $BACKUP_DIR/openclaw-$(date +%Y%m%d)
find $BACKUP_DIR -mtime +30 -delete
```

### 복원

```bash
# 백업에서 복원
tar -xzf openclaw-backup-20260225.tar.gz -C ~/
```

---

## 다음 단계

- [업데이트](/operations/updating)
