const { execSync } = require("node:child_process");

function run(cmd, env = process.env) {
  execSync(cmd, { stdio: "inherit", env });
}

function isPooled(url) {
  return /pooler|pgbouncer=true|-pooler\./i.test(url);
}

// Vercel Storage(Neon) 변수명 정리
const pooled =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

const direct =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DIRECT_URL;

// 런타임·generate용 (풀링 URL 우선)
if (pooled) {
  process.env.DATABASE_URL = pooled;
} else if (direct) {
  process.env.DATABASE_URL = direct;
}

run("npx prisma generate");

// migrate deploy는 반드시 direct(unpooled) 연결 사용
const migrateUrl =
  direct || (process.env.DATABASE_URL && !isPooled(process.env.DATABASE_URL)
    ? process.env.DATABASE_URL
    : null);

if (migrateUrl) {
  console.log("Running prisma migrate deploy (direct / unpooled)…");
  run("npx prisma migrate deploy", {
    ...process.env,
    DATABASE_URL: migrateUrl,
  });
} else if (pooled) {
  console.warn(
    "\n⚠  Unpooled DB URL이 없어 migrate를 건너뜁니다.\n" +
      "   Vercel Storage 연결 시 POSTGRES_URL_NON_POOLING 이 생깁니다.\n" +
      "   없으면 Neon 대시보드에서 Direct connection을 DIRECT_URL 로 추가하세요.\n",
  );
  console.log("Trying prisma db push as fallback…");
  run("npx prisma db push --skip-generate", {
    ...process.env,
    DATABASE_URL: pooled,
  });
} else {
  console.warn(
    "\n⚠  DATABASE_URL이 없어 DB 스키마 적용을 건너뜁니다.\n" +
      "   Vercel → Storage → Neon 연결 후 Redeploy 하세요.\n",
  );
}

run("npx next build");
