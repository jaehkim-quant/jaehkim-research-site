/**
 * 비밀번호 해시 생성 스크립트
 *
 * 사용법:
 *   npx ts-node scripts/hash-password.ts YOUR_PASSWORD
 *
 * 출력된 해시값을 .env.local의 ADMIN_PASSWORD_HASH에 붙여넣으세요.
 */

import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("사용법: npx ts-node scripts/hash-password.ts YOUR_PASSWORD");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\n=== 아래 해시값을 .env.local의 ADMIN_PASSWORD_HASH에 넣으세요 ===");
console.log(hash);
console.log("================================================================\n");
