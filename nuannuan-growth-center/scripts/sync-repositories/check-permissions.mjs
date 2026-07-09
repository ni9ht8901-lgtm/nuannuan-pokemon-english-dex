import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";

const checks = [
  {
    id: "github",
    label: "GitHub 授权",
    command: ["gh", "auth", "status"]
  },
  {
    id: "vercel",
    label: "Vercel 授权",
    command: ["vercel", "whoami"]
  }
];

const results = checks.map((check) => {
  try {
    execFileSync(check.command[0], check.command.slice(1), { stdio: "ignore" });
    return { ...check, ok: true, blocker: "" };
  } catch {
    return { ...check, ok: false, blocker: `${check.label}不可用或未登录` };
  }
});

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  results.push({
    id: "supabase",
    label: "Supabase 项目",
    command: [],
    ok: false,
    blocker: "缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY"
  });
}

const report = {
  checkedAt: new Date().toISOString(),
  blockers: results.filter((item) => !item.ok).map((item) => item.blocker),
  results
};
const outputPath = path.resolve(process.argv[2] ?? "registry/permission-check.json");
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
