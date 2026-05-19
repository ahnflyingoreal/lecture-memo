const { execSync } = require("node:child_process");

function run(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env });
}

// Vercel Storage(Neon/Postgres) 연동 시 자동 주입되는 이름 → Prisma용
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED;
}

if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL;
}

run("npx prisma generate");

if (process.env.DATABASE_URL) {
  console.log("Running prisma migrate deploy…");
  run("npx prisma migrate deploy");
} else {
  console.warn(
    "\n⚠  DATABASE_URL이 없어 마이그레이션을 건너뜁니다.\n" +
      "   Vercel → Settings → Environment Variables에서 Neon을 연결하거나\n" +
      "   DATABASE_URL / POSTGRES_PRISMA_URL 을 추가한 뒤 Redeploy 하세요.\n",
  );
}

run("npx next build");
