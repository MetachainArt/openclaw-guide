---
title: Docker 설치
description: Docker로 OpenClaw를 설치하는 방법
---

> ⏱️ **예상 소요시간**: 20-30분  
> 🎯 **목표**: Docker로 OpenClaw 실행

## Docker로 설치하기

Docker는 OpenClaw를 격리된 환경에서 실행하는 가장 안전한 방법입니다.

📺 **참고**: [Leenit 기술블로그 - Docker로 5분만에 OpenClaw 시작하기](https://blog.leenit.kr/install-openclaw-with-docker/)


### 요구사항

- Docker 24.0+
- Docker Compose v2
### 설치 방법

```bash
# Docker 이미지 다운로드
docker pull openclaw/openclaw:latest

# 컨테이너 실행
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v ~/.openclaw:/data \
  openclaw/openclaw:latest
```

### Docker Compose 사용

`docker-compose.yml`:

```yaml
version: '3.8'
services:
  openclaw:
    image: openclaw/openclaw:latest
    container_name: openclaw
    ports:
      - "18789:18789"
    volumes:
      - ./data:/data
    environment:
      - OPENCLAW_CONFIG_PATH=/data/openclaw.json
    restart: unless-stopped
```

실행:
```bash
docker-compose up -d
```

### 설정 파일 마운트

호스트의 설정 파일을 컨테이너에 마운트:

```bash
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v $(pwd)/openclaw.json:/data/openclaw.json \
  -v $(pwd)/state:/data/state \
  openclaw/openclaw:latest
```

---

## 다음 단계

- [최초 실행 및 설정](/install/first-run)
