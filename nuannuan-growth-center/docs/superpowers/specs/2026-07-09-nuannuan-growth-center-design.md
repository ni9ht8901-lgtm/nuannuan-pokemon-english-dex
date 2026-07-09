# 暖暖 AI 成长中心设计

## 范围

本阶段先完成本地可执行基础：总控工作区、项目扫描、统一登记表、管理后台、Supabase 数据库脚本、统一 SDK，以及当前工作区 PWA 的试点接入。GitHub 全量仓库扫描、Supabase 真实建库、Vercel 部署和跨设备实测受外部权限限制，作为阻塞项继续跟踪。

## 架构

总控工作区位于 `nuannuan-growth-center`。后台读取 `registry/*.json` 展示真实扫描结果；未来接入 Supabase 后，后台数据源可从 JSON 切到数据库。`packages/growth-sdk` 给旧 PWA 和未来项目提供统一事件、进度、离线队列、旧数据迁移和 Supabase 补传能力。

## 数据

Supabase 迁移脚本创建家庭、成员、设备、项目、版本、事件、进度、成就、绘本、阅读记录、迁移日志和冲突表。所有家庭数据通过 `family_id` 隔离，事件通过 `event_id` 去重，旧数据迁移只追加记录，不删除旧本地数据。

## 试点

根目录 `字母变身局` 作为第一个试点。它保留原 `localStorage` 与 IndexedDB，同时调用 SDK 记录 `app_opened`、`session_started`、`task_completed`、`achievement_unlocked`、`progress_updated` 和 `legacy_data_migrated`。

## 验证

本地验证包含 SDK 编译、Node 测试、后台 TypeScript 编译、后台构建和根 PWA 构建。跨设备同步与线上部署等最终验收需要权限补齐后继续执行。
