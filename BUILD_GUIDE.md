# Android APK 自动构建指南

本仓库配置了 GitHub Actions 自动构建流程，每次推送代码到 `main` 或 `master` 分支时，会自动构建 Android APK。

## 使用步骤

### 1. 获取 Expo Token

1. 访问 [Expo 账户设置](https://expo.dev/accounts)
2. 登录你的 Expo 账户（如果没有，先注册）
3. 点击左侧菜单的 "Access Tokens"
4. 点击 "Create new token"
5. 输入 token 名称（如 "GitHub Actions"），选择 "Personal Access Token"
6. 复制生成的 token

### 2. 配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 "Settings" > "Secrets and variables" > "Actions"
3. 点击 "New repository secret"
4. 添加以下 secret：

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `EXPO_TOKEN` | 上一步复制的 Expo Token | 用于访问 Expo 构建服务 |

### 3. 触发构建

构建会自动触发，也可以手动触发：

#### 自动触发
- 推送代码到 `main` 或 `master` 分支
- 创建 Pull Request 到 `main` 或 `master` 分支

#### 手动触发
1. 进入 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择 "Build Android APK" 工作流
4. 点击 "Run workflow"
5. 选择分支，点击 "Run workflow" 按钮

### 4. 下载 APK

1. 进入 "Actions" 标签
2. 点击最近一次构建记录
3. 滚动到底部的 "Artifacts" 部分
4. 点击 "android-apk" 下载
5. 解压后得到 `.apk` 文件

### 5. 安装 APK

1. 将 APK 文件传输到 Android 设备
2. 在设备上启用"未知来源应用安装"
3. 点击 APK 文件安装

## 发布新版本

如果需要发布正式版本，可以创建 Git tag：

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

这会自动创建 GitHub Release 并附加 APK 文件。

## 注意事项

1. **首次构建可能较慢**：第一次构建需要下载依赖和缓存，可能需要 20-30 分钟
2. **免费账户限制**：Expo 免费账户每月有一定构建次数限制
3. **APK 签名**：当前配置使用调试签名，正式发布需要配置生产签名
4. **构建时间**：通常需要 10-20 分钟完成

## 构建配置说明

- **Profile**: `preview` - 生成可安装的 APK 文件
- **Platform**: `Android` - 构建安卓应用
- **Retention**: APK 文件保留 7 天
- **Java Version**: 17 - Android 构建要求
- **Node Version**: 20 - 与项目配置一致

## 故障排查

### 构建失败

1. 检查 Expo Token 是否有效
2. 确认 GitHub Secrets 配置正确
3. 查看 Actions 日志中的错误信息

### APK 无法安装

1. 确认启用了"未知来源应用安装"
2. 尝试卸载旧版本后重新安装
3. 检查 Android 版本兼容性

### 构建超时

1. 如果构建超过 30 分钟，可能需要检查网络连接
2. 可以尝试手动触发重新构建

## 相关链接

- [Expo EAS Build 文档](https://docs.expo.dev/build/introduction/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Expo Token 管理](https://expo.dev/accounts)
