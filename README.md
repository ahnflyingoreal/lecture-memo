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

### 3. Neon DB 연결

1. Vercel 프로젝트 → **Storage** → **Create Database** → **Neon** 선택  
   (또는 [Neon](https://neon.tech)에서 직접 만들고 연결 문자열 복사)
2. 연동 후 환경 변수가 자동으로 들어갑니다:
   - `DATABASE_URL` — 앱 런타임(풀링 URL 권장)
   - `POSTGRES_URL` 등이 생기면, Prisma용으로 `DATABASE_URL`에 **pooled** 연결을 매핑
3. **Settings → Environment Variables**에서 `DIRECT_URL` 추가  
   Neon 대시보드의 **Direct / Unpooled** connection string (마이그레이션용)

| 변수 | 용도 |
|------|------|
| `DATABASE_URL` | 서버 액션·Prisma 런타임 |
| `DIRECT_URL` | `prisma migrate deploy` (빌드 시) |

Neon만 쓸 때는 두 URL이 같아도 동작하는 경우가 많습니다. 마이그레이션 오류가 나면 unpooled URL을 `DIRECT_URL`에 넣으세요.

### 4. 배포

**Deploy**를 누르면 빌드 중 `prisma migrate deploy`로 테이블이 생성됩니다.

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
