---
title: Windows/WSL2 설치
description: Windows에서 OpenClaw를 설치하는 방법 (WSL2 권장)
---

> ⏱️ **예상 소요시간**: 45분 - 1시간  
> 🎯 **목표**: WSL2 환경에 OpenClaw 설치

:::danger[중요: WSL2 필수]
Windows에서 OpenClaw를 실행하려면 **WSL2 (Windows Subsystem for Linux)**가 필요합니다.

네이티브 Windows 설치는 **지원되지 않거나** 심각한 제약이 있습니다.
:::

## WSL2란?

WSL2는 Windows 10/11에서 Linux 환경을 실행할 수 있게 해주는 기능입니다. 가상머신보다 가볍고, Windows와 파일을 쉽게 공유할 수 있습니다.

### WSL2 장점
- ✅ OpenClaw 완전 호환
- ✅ 모든 스킬/기능 사용 가능
- ✅ Windows 파일 탐색기에서 직접 접근
- ✅ VS Code 통합 지원

### 📺 추천 영상 튜토리얼

- [Metics Media - Full OpenClaw Setup Tutorial (119K views)](https://www.youtube.com/watch?v=fcZMmP5dsl4)
- [Adrian Twarog - OpenClaw Tutorial for Beginners (120K views)](https://www.youtube.com/watch?v=u4ydH-QvPeg)
- [코딩오페라 Windows 설치 가이드 (블로그)](https://codingopera.tistory.com/86)

---
---

## 1단계: WSL2 설치 (15분)

### 자동 설치 (Windows 11)

관리자 권한 PowerShell에서 실행:

```powershell
wsl --install
```

컴퓨터가 재부팅됩니다.

### 수동 설치 (Windows 10)

1. **Windows 기능 켜기/끄기** 실행
   - Windows 키 + R → `optionalfeatures` 입력
   - 또는 제어판 → 프로그램 → Windows 기능 켜기/끄기

2. 다음 항목 체크:
   - [x] Linux용 Windows 하위 시스템
   - [x] 가상 머신 플랫폼
   - [x] Windows 하이퍼바이저 플랫폼

3. 컴퓨터 재부팅

3. **WSL2를 기본 버전으로 설정**:

```powershell
wsl --set-default-version 2
```

4. **Ubuntu 설치**:

Microsoft Store에서 "Ubuntu 22.04 LTS" 검색 후 설치

또는 PowerShell에서:
```powershell
wsl --install -d Ubuntu-22.04
```

### 설치 확인

```powershell
wsl --status
```

"기본 버전: 2"가 표시되어야 합니다.

---

## 2단계: Ubuntu 초기 설정 (10분)

### Ubuntu 실행

시작 메뉴에서 "Ubuntu 22.04 LTS" 실행

### 사용자 설정

첫 실행 시 사용자명과 비밀번호를 설정합니다:

```
Enter new UNIX username: yourname
New password: ********
Retype new password: ********
```

### 시스템 업데이트

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

---

## 3단계: Node.js 설치 (5분)

```bash
# NodeSource 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Node.js 설치
sudo apt-get install -y nodejs

# 설치 확인
node --version  # v22.x.x 출력 확인
npm --version
```

---

## 4단계: OpenClaw 설치 (10분)

### 인스톨러 스크립트 사용

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 또는 npm 사용

```bash
npm install -g openclaw@latest
```

### 설치 확인

```bash
openclaw --version
```

---

## 5단계: 온보딩 및 실행 (15분)

```bash
openclaw onboard --install-daemon
```

마법사를 따라 설정을 완료하세요.

### WSL2 특수 설정

#### 파일 경로

WSL2에서 Windows 파일에 접근:
```bash
# Windows C 드라이브
ls /mnt/c/Users/YourName/Documents

# OpenClaw 작업 공간으로 설정
mkdir -p /mnt/c/Users/YourName/openclaw-workspace
```

#### 자동 시작 설정

WSL2는 Windows 재부팅 시 자동으로 시작되지 않습니다.

**자동 시작 설정 (선택)**:

```bash
# Windows 작업 스케줄러에 등록
# (Windows PowerShell 관리자 권한에서 실행)
```

또는 수동 시작:
```bash
# Ubuntu 터미널에서
wsl ~ -d Ubuntu-22.04 -e bash -c "openclaw gateway"
```

---

## Windows 터미널 설정 (권장)

### Windows Terminal 설치

Microsoft Store에서 "Windows Terminal" 설치

### 기본 프로필 설정

1. Windows Terminal 실행
2. `Ctrl + ,` (설정 열기)
3. "시작" → "기본 프로필" → "Ubuntu-22.04" 선택
4. "기본 터미널 응용 프로그램"으로 설정

---

## 흔한 문제 및 해결책

### 문제: WSL2 설치 후 재부팅 루프

**해결책**: BIOS에서 가상화(VT-x/AMD-V) 활성화 확인

### 문제: "WSL 2 requires an update to its kernel component"

**해결책**:
```powershell
wsl --update
```

### 문제: Windows 방화벽 차단

**해결책**:
Windows Defender 방화벽 → 고급 설정 → 인바운드 규칙
- 포트 18789 허용 규칙 추가

### 문제: 파일 권한 오류

**해결책**:
```bash
# WSL2에서 Windows 파일 작업 시
sudo umount /mnt/c
sudo mount -t drvfs C: /mnt/c -o metadata,uid=1000,gid=1000,umask=22
```

---

## VS Code 연동

### WSL 확장 설치

VS Code에서 "Remote - WSL" 확장 설치

### WSL에서 VS Code 열기

```bash
# Ubuntu 터미널에서
code .
```

### 통합 터미널 설정

VS Code 설정 (`.vscode/settings.json`):
```json
{
  "terminal.integrated.defaultProfile.linux": "bash"
}
```

---

## 다음 단계

- [최초 실행 및 설정](/install/first-run)
- [모델 연결 설정](/install/models)
- [문제 해결](/install/troubleshooting)
