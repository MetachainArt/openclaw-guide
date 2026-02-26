---
title: 스킬 설치 체크리스트
description: OpenClaw 스킬을 안전하게 설치하기 위한 체크리스트
---

>  2026년 2월 ClawHub에서 341개 이상의 악성 스킬이 발견되었습니다.
> 이 체크리스트를 반드시 완료한 후 스킬을 설치하세요.

---

## 설치 전 체크리스트

### 1단계: 출처 확인 

- [ ] GitHub 저장소 확인: 스킬이 오픈소스인가?
- [ ] 스타 수: 10개 이상 (신뢰도 지표)
- [ ] 최근 업데이트: 6개월 이내 활동
- [ ] 개발자 프로필: GitHub 프로필 확인, 다른 프로젝트 존재
- [ ] 이슈 확인: 보안 관련 이슈는 없는가?

### 2단계: 코드 검토 

- [ ] `index.ts`/`index.js` 읽기: 메인 로직 확인
- [ ] 외부 URL 확인: 의심스러운 API 호출 없음
- [ ] 환경 변수 접근: `process.env` 접근 범위 확인
- [ ] 파일 시스템 접근: 어떤 파일을 읽고/쓰는가?
- [ ] 네트워크 요청: `fetch`/`axios` 호출 대상 확인

### 3단계: 권한 검토 

- [ ] skill.json/manifest 확인: 요구 권한 나열
- [ ] 불필요한 권한: 요구 권한이 기능에 비해 과도하지 않은가?
- [ ] 네트워크 권한: 인터넷 접근이 필요한 이유 확인

### 4단계: 샌드박스 테스트 

- [ ] 격리 환경: WSL2/도커/VM에서 먼저 테스트
- [ ] 가짜 데이터: 민감 정보 없이 테스트
- [ ] 네트워크 모니터링: `wireshark` 또는 `tcpdump`로 트래픽 확인
- [ ] 로그 확인: 어떤 로그를 남기는가?

---

## 빨간 깃발 (설치 금지)

다음 중 하나라도 해당되면 설치하지 마세요:

 심각한 위험
- 바이너리 파일 포함 (`.exe`, `.bin`, `.so` 등)
- 난독화된 코드
- `eval()` 또는 동적 코드 실행
- 외부 스크립트 다운로드/실행

 주의 필요
- API 키 요구 (특히 클립보드 접근)
- 모든 파일 시스템 접근 권한
- 관리자/root 권한 요구
- 최근 생성된 GitHub 계정 (2026년 이후)

 의심스러움
- README가 없거나 형편없음
- 버전 관리 없음
- 이슈/PR 비활성화
- 개발자 연락처 없음

---

## 안전한 설치 절차

### 1. 백업

```bash
# 설정 백업
cp -r ~/.openclaw ~/.openclaw.backup.$(date +%Y%m%d)

# API 키 목록 내보내기
openclaw config export --keys > ~/openclaw-keys-backup.json
```

### 2. 격리 테스트

```bash
# WSL2/도커에서 테스트 인스턴스 생성
docker run -it --rm \
  -v $(pwd)/test-data:/data \
  openclaw/openclaw:latest

# 테스트 환경에서 스킬 설치
clawhub install suspect-skill --workspace test
```

### 3. 네트워크 모니터링

```bash
# WSL2에서
sudo tcpdump -i any -w /tmp/openclaw-skill.pcap

# 또는
sudo netstat -tulpn | grep openclaw
```

### 4. 권한 제한

```bash
# 읽기 전용 작업 공간 생성
mkdir -p ~/openclaw-sandbox
chmod 500 ~/openclaw-sandbox

# 스킬 전용 프로필 사용
clawhub install <skill> --profile sandbox
```

---

## 설치 후 모니터링

### 즉시 확인 (설치 후 1시간 내)

```bash
# 프로세스 확인
ps aux | grep openclaw

# 네트워크 연결 확인
ss -tulpn | grep openclaw

# 로그 확인
openclaw logs --follow
```

### 정기 확인 (매일/매주)

- [ ] 설치된 스킬 목록 확인: `openclaw skill list`
- [ ] 네트워크 트래픽 이상 유무
- [ ] API 키 사용량 급증 여부
- [ ] 불필요한 파일 생성 여부

---

## 스킬 감사 명령어

```bash
# 설치된 모든 스킬 목록
openclaw skill list --all

# 특정 스킬 정보
openclaw skill info <skill-name>

# 스킬 권한 확인
openclaw skill permissions <skill-name>

# 스킬 제거
openclaw skill remove <skill-name>

# 의심스러운 스킬 제거
openclaw skill remove <skill-name> --purge  # 데이터도 삭제
```

---

## 문제 발견 시 대응

### 1. 즉시 중지

```bash
# 게이트웨이 중지
openclaw gateway stop

# 또는 스킬만 비활성화
openclaw skill disable <skill-name>
```

### 2. 네트워크 차단

```bash
# WSL2
sudo iptables -A OUTPUT -p tcp --dport 443 -j DROP

# 또는 호스트에서
wsl --terminate Ubuntu-22.04
```

### 3. API 키 폐기

- 즉시 모든 API 키 폐기
- 새 키 발급
- `.env` 파일 삭제

### 4. 보고

- GitHub Security Advisory 제출
- OpenClaw Discord #security 채널
- Koi Security 등 보안 업체

---

## 안전한 스킬 출처

| 출처 | 신뢰도 | 비고 |
|------|--------|------|
| 공식 번들 스킬 |  | OpenClaw에 기본 포함 |
| 검증된 관리 스킬 |  | 오픈소스, 커뮤니티 검증 |
| GitHub 직접 설치 |  | 직접 코드 검토 필요 |
| ClawHub |  | 2026.02 기준 주의 필요 |
| 기타 출처 |  | 설치 금지 |

---

## 요약

| 단계 | 행동 | 시간 |
|------|------|------|
| 설치 전 | 출처/코드/권한 확인 | 10-30분 |
| 설치 중 | 샌드박스 테스트 | 15-30분 |
| 설치 후 | 모니터링 | 지속적 |

핵심 원칙: *불확실하면 설치하지 마세요*
