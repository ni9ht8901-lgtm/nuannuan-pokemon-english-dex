# 暖暖的宝可梦英语图鉴 PWA

一个面向 6 岁儿童的英语启蒙 PWA 小工具。孩子每天认识 3 只宝可梦风格角色，学习简单英文单词和短句，完成小测验后获得星星和糖果，并逐步解锁图鉴与进化。

首版特点：

- React + Vite + TypeScript + Tailwind CSS
- PWA，可在 iPhone / iPad Safari 添加到主屏幕
- 无后台、无登录，学习进度保存在本机 `localStorage`
- 30 只宝可梦官方 artwork，多条进化链
- 支持 Web Speech API 英文朗读
- 单词和句子会触发对应动效，例如 fire 喷火、water 水花、wing 飞起
- 支持 GitHub Pages 部署

## 本地启动

```bash
npm install
npm run dev
```

打开终端显示的网址即可预览。

## 构建

```bash
npm run build
```

构建结果会输出到 `dist` 文件夹。

## GitHub Pages 部署

项目已包含 `.github/workflows/deploy.yml`。上传到 GitHub 后：

1. 在 GitHub 仓库进入 `Settings`
2. 打开 `Pages`
3. Source 选择 `GitHub Actions`
4. 推送到 `main` 分支后自动构建和发布

Vite 的 `base` 已设置为 `./`，适合 GitHub Pages 的子路径部署。

## iPhone / iPad 添加到主屏幕

1. 用 Safari 打开部署后的网址
2. 点底部或顶部的分享按钮
3. 选择“添加到主屏幕”
4. 名称显示为“暖暖图鉴”
5. 从主屏幕打开后会以独立 App 方式显示

项目已配置：

- `manifest.webmanifest`
- service worker
- app icon
- theme color
- iOS 主屏幕相关 meta 标签
- 安全区域适配

## 如何新增宝可梦数据

编辑 `src/data/pokemonData.ts`，按现有结构新增一条数据：

```ts
{
  id: "new-mon",
  nameEn: "Newmon",
  nameZh: "新角色",
  type: "fire",
  stage: 1,
  evolutionLine: ["new-mon"],
  image: "./pokemon/new-mon.svg",
  storyZh: "一句简单中文故事。",
  words: [
    { word: "sun", meaning: "太阳" },
    { word: "hot", meaning: "热的" },
    { word: "run", meaning: "跑" }
  ],
  sentences: ["I see the sun.", "It is hot.", "It can run."],
  interactions: ["tap-body-hop"],
  quizzes: [
    { question: "Which word means 太阳？", options: ["sun", "water", "leaf"], answer: "sun" },
    { question: "Fill in: It is ____.", options: ["hot", "blue", "small"], answer: "hot" }
  ]
}
```

如果有图片，把 SVG/PNG 放到 `public/pokemon/`，并更新 `image` 路径。学习页会优先展示这里的图片。

## 如何修改每日学习数量

编辑 `src/data/pokemonData.ts`：

```ts
export const DAILY_LEARNING_COUNT = 3;
```

改成想要的数量即可。

## 版权说明

本项目仅用于个人家庭学习用途。当前版本接入了 PokeAPI 提供的宝可梦官方 artwork 作为学习展示素材。如需公开发布或商业使用，建议替换为完全原创角色、名称和视觉资产。
