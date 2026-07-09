# 字母变身局数据映射

## 旧数据位置

- `localStorage`: `letter-transform-station-progress-v1`
- `IndexedDB`: `letter-transform-station` / `progress`

## 旧数据字段

- `childName`: 儿童昵称，默认暖暖。
- `avatar`: 头像选择。
- `mode`: 当前模式，`english` 或 `pinyin`。
- `stars`: 当前星星数。
- `stickerIds`: 已解锁贴纸。
- `completedTaskIds`: 已完成任务，包含 `identity`、`train`、`tone`。
- `events`: 答题记录，包含题目、正确性、尝试次数、错误类型和耗时。
- `recordings`: 录音记录。
- `onboarded`: 是否完成首次设置。

## 统一后台映射

- `projects.id`: `letter-transform-station`
- `events.type`: 任务完成记为 `task_completed`，答题记录记为 `lesson_completed`。
- `user_project_progress.progress.percent`: `completedTaskIds.length / 3 * 100`
- `user_project_progress.progress.currentLevel`: 下一个未完成任务。
- `user_project_progress.progress.counters.stars`: `stars`
- `user_project_progress.progress.counters.stickers`: `stickerIds.length`
- `achievements.id`: `sticker-switch-day1`

## 合并规则

- 已完成任务取并集。
- 星星保留较高有效值，不跨设备简单相加。
- 贴纸和录音取并集。
- 答题事件按事件 ID 或时间去重后追加。
- 无法判断的新旧冲突进入 `sync_conflicts`。
