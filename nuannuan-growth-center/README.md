# 暖暖 AI 成长中心

本目录是统一总控工作区，负责管理暖暖相关 PWA、绘本和未来新项目的登记、数据同步、迁移和验收。

## 已落地内容

- `registry/discovered-projects.json`: 当前工作区扫描结果。
- `apps/admin`: 管理后台，读取真实登记表和迁移状态。
- `packages/growth-sdk`: `@nuannuan/growth-sdk` 初版，支持事件、进度、离线队列、旧数据迁移记录和 Supabase REST 补传。
- `supabase/migrations`: 数据库表、RLS 和索引脚本。
- `scripts/discover-projects`: 本地项目与绘本扫描。
- `scripts/register-project`: 将项目根目录的 `nuannuan.project.json` 登记入总表。
- `scripts/sync-repositories`: 权限检查脚本。

## 本地命令

```bash
npm run growth:discover
npm run growth:test
npm run growth:admin:build
```

## 当前阻塞

真实 GitHub 扫描、Supabase 建库、Vercel 部署和跨设备同步验收需要外部授权。阻塞项集中记录在 `docs/blockers.md`。
