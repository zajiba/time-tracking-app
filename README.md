# 工作时间记录 App

一个基于 Expo + Express.js 的工时管理应用，支持时间记录、数据导出和 AI 智能分析功能。

## 功能特性

- ✅ **时间记录管理** - 记录每日工作时间、项目、任务
- ✅ **数据统计** - 自动计算工作时长，展示统计数据
- ✅ **AI 智能分析** - 导出数据，AI 分析工作模式并提供改进建议
- ✅ **数据导出** - 支持 JSON 格式数据导出
- ✅ **历史记录** - 保存和查看历史分析结果

## 目录结构规范（严格遵循）

当前仓库是一个 monorepo（基于 pnpm 的 workspace）

- Expo 代码在 client 目录，Express.js 代码在 server 目录
- 本模板默认无 Tab Bar，可按需改造

目录结构说明

├── server/                     # 服务端代码根目录 (Express.js)
|   ├── src/
│   │   └── index.ts            # Express 入口文件
|   └── package.json            # 服务端 package.json
├── client/                     # React Native 前端代码
│   ├── app/                    # Expo Router 路由目录（仅路由配置）
│   │   ├── _layout.tsx         # 根布局文件（必需，务必阅读）
│   │   ├── index.tsx           # 首页
│   │   ├── time-record-form.tsx  # 添加/编辑记录页
│   │   └── analysis.tsx        # AI 分析页
│   ├── screens/                # 页面实现目录（与 app/ 路由对应）
│   │   ├── time-records/       # 时间记录列表
│   │   ├── time-record-form/   # 添加/编辑表单
│   │   └── analysis/           # AI 分析
│   ├── components/             # 可复用组件
│   │   └── Screen.tsx          # 页面容器组件（必用）
│   ├── hooks/                  # 自定义 Hooks
│   ├── contexts/               # React Context 代码
│   ├── constants/              # 常量定义（如主题配置）
│   ├── utils/                  # 工具函数
│   ├── assets/                 # 静态资源
│   ├── eas.json                # EAS Build 配置
│   └── package.json            # Expo 应用 package.json
├── .github/workflows/          # GitHub Actions 工作流
│   └── build-android-apk.yml  # Android 自动构建配置
├── package.json
├── BUILD_GUIDE.md              # Android APK 构建指南
├── .cozeproj                   # 预置脚手架脚本（禁止修改）
└── .coze                       # 配置文件（禁止修改）

## 快速开始

### 本地开发

运行 coze dev 可以同时启动前端和后端服务，如果端口已占用，该命令会先杀掉占用端口的进程再启动，也可以用来重启前端和后端服务

```bash
coze dev
```

### 安装依赖

```bash
pnpm i
```

### 新增依赖约束

如果需要新增依赖，需在 client 和 server 各自的目录添加（原因：隔离前后端的依赖），禁止在根目录直接安装依赖

### 新增依赖标准流程

- 编辑 `client/package.json` 或 `server/package.json`
- 在根目录执行 `pnpm i`

## 安装和部署

### 使用 Expo Go（开发调试）

1. 在手机上安装 [Expo Go](https://expo.dev/client)
2. 运行 `coze dev` 后，扫描二维码即可

### 构建 Android APK（推荐）

本仓库已配置 GitHub Actions 自动构建，详细步骤请查看 [BUILD_GUIDE.md](./BUILD_GUIDE.md)

**快速开始：**

1. 获取 [Expo Token](https://expo.dev/accounts)
2. 在 GitHub 仓库中配置 Secret: `EXPO_TOKEN`
3. 推送代码到 main 分支或手动触发 Actions
4. 在 Actions 页面下载构建好的 APK

## Expo 开发规范

### 路径别名

Expo 配置了 `@/` 路径别名指向 `client/` 目录：

```tsx
// 正确
import { Screen } from '@/components/Screen';

// 避免相对路径
import { Screen } from '../../../components/Screen';
```

## API 接口文档

### 时间记录接口

- `GET /api/v1/time-records` - 获取所有记录
- `GET /api/v1/time-records/:id` - 获取单条记录
- `POST /api/v1/time-records` - 创建记录
- `PUT /api/v1/time-records/:id` - 更新记录
- `DELETE /api/v1/time-records/:id` - 删除记录
- `GET /api/v1/time-records/export/all` - 导出数据

### AI 分析接口

- `POST /api/v1/analyze` - AI 分析（SSE 流式输出）
- `GET /api/v1/analyze/results` - 获取历史分析结果

## 技术栈

- **前端**: Expo 54 + React Native
- **后端**: Express.js
- **数据库**: Supabase
- **AI 能力**: LLM (Doubao)
- **构建**: EAS Build + GitHub Actions

## 许可证

MIT
