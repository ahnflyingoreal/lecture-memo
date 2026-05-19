# Field Archive — 강의 메모

Next.js + Prisma + PostgreSQL(Neon) 기반 강의 기록 앱입니다.

## 로컬 개발

1. [Neon](https://neon.tech)에서 무료 PostgreSQL 프로젝트 생성
2. `.env.example`을 복사해 `.env` 작성 (`DATABASE_URL`, `DIRECT_URL`)
3. 의존성 설치 및 DB 마이그레이션:

```bash
npm install
npx prisma migrate deploy
npm run dev
```

기존 SQLite(`prisma/dev.db`) 데이터는 앱에서 **JSON 보내기** 후, Neon 연결 뒤 **JSON 가져오기**로 옮기세요.

## Vercel 배포

Vercel은 디스크에 SQLite 파일을 둘 수 없어 **Neon(PostgreSQL)** 이 필요합니다.

### 1. GitHub에 푸시

`lecture-memo` 폴더를 저장소 루트로 두거나, 모노레포면 Vercel **Root Directory**를 `lecture-memo`로 지정합니다.

### 2. Vercel 프로젝트 생성

1. [vercel.com](https://vercel.com) → **Add New Project** → GitHub 저장소 선택
2. 모노레포인 경우 **Root Directory**: `lecture-memo`
3. Framework Preset: **Next.js** (자동 감지)

### 3. Neon DB 연결 (배포 **전에** 필수)

1. Vercel 프로젝트 → **Storage** → **Create Database** → **Neon** 선택  
2. 프로젝트에 **Connect** 해서 환경 변수를 Production에 연결  
3. 아래 중 하나라도 있으면 빌드 스크립트가 Prisma용으로 자동 매핑합니다:

| Vercel/Neon 자동 변수 | Prisma에서 사용 |
|----------------------|-----------------|
| `POSTGRES_PRISMA_URL` | `DATABASE_URL` |
| `POSTGRES_URL` | `DATABASE_URL` (대체) |
| `POSTGRES_URL_NON_POOLING` | 빌드 시 `migrate deploy` (필수에 가깝음) |

수동 설정 시:

| 변수 | 용도 |
|------|------|
| `DATABASE_URL` 또는 `POSTGRES_PRISMA_URL` | 앱 런타임 (pooled) |
| `POSTGRES_URL_NON_POOLING` | 빌드 시 마이그레이션 (unpooled) |

> `migrate deploy`는 **pooler URL로 하면 실패**합니다. Vercel Storage를 프로젝트에 Connect하면 non-pooling 변수가 함께 들어옵니다.

> **Deploy 전에** Storage 연결을 끝내지 않으면 빌드는 통과할 수 있지만, 사이트에서 DB 오류가 납니다.

### 4. 배포

환경 변수 연결 후 **Redeploy** 하면 빌드 중 `prisma migrate deploy`로 테이블이 생성됩니다.

배포 URL에서 JSON 가져오기로 기존 메모를 복원할 수 있습니다.

### 5. (선택) 비밀번호 보호

현재 로그인이 없어 URL을 아는 사람은 모두 접근할 수 있습니다.  
공개 배포 시 Vercel **Deployment Protection** 또는 앱에 인증을 추가하는 것을 권장합니다.

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 마이그레이션 + 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npx prisma studio` | DB 브라우저 |
