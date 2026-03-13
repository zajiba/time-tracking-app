# 本地构建 Android APK 指南

由于无法使用 GitHub Actions，本指南提供两种构建方案：

## 方案 A：EAS 云端构建（推荐，需要 Expo Token）

### 优点
- ✅ 无需配置本地 Android SDK
- ✅ 构建速度快（10-20 分钟）
- ✅ 构建过程在云端完成
- ✅ 只需要 Expo Token

### 构建步骤

#### 1. 获取 Expo Token

1. 访问 https://expo.dev/accounts
2. 登录或注册 Expo 账户（免费）
3. 点击左侧菜单的 **"Access Tokens"**
4. 点击 **"Create new token"**
5. 填写信息：
   - Name: `Local Build`
   - Expiration: 建议设置 30 天或更长
   - Scope: 勾选必要的权限
6. 点击 **"Create token"**
7. **立即复制生成的 token**（只显示一次，请妥善保存）

#### 2. 设置环境变量

**Linux / macOS:**
```bash
export EXPO_TOKEN=你的token
```

**Windows PowerShell:**
```powershell
$env:EXPO_TOKEN="你的token"
```

**Windows CMD:**
```cmd
set EXPO_TOKEN=你的token
```

#### 3. 执行构建

**使用构建脚本（推荐）：**
```bash
cd /workspace/projects
bash build-apk.sh
```

**手动执行：**
```bash
cd /workspace/projects/client
eas build --platform android --profile preview
```

#### 4. 下载 APK

构建成功后，EAS 会提供一个下载链接：
```
✅ Build finished
📦 APK 下载链接: https://...
```

点击链接下载 APK 文件，然后安装到 Android 设备。

---

## 方案 B：使用 Expo Go（无需构建，快速测试）

### 优点
- ✅ 完全不需要构建
- ✅ 立即可用
- ✅ 支持热更新
- ✅ 开发调试最方便

### 缺点
- ❌ 不是独立的 APK
- ❌ 需要安装 Expo Go 应用
- ❌ 只能用于开发测试，不能正式发布

### 使用步骤

#### 1. 安装 Expo Go

- **Android**: Google Play 或应用商店搜索 "Expo Go"
- **iOS**: App Store 搜索 "Expo Go"

#### 2. 启动开发服务器

```bash
cd /workspace/projects
coze dev
```

#### 3. 扫描二维码

- 在 Expo Go 应用中点击 "Scan QR Code"
- 扫描终端显示的二维码
- 应用会自动加载并运行

---

## 常见问题

### Q: Expo Token 过期了怎么办？

A: 重新生成一个新 token：
1. 访问 https://expo.dev/accounts
2. 点击 "Access Tokens"
3. 删除旧的 token
4. 创建新的 token
5. 重新设置环境变量

### Q: 构建失败怎么办？

A: 检查以下几点：
1. Expo Token 是否有效
2. 网络连接是否正常
3. 是否有足够的磁盘空间
4. 查看错误日志中的具体信息

### Q: 构建需要多长时间？

A: 通常 10-20 分钟。首次构建可能需要 20-30 分钟（需要下载依赖）。

### Q: APK 可以分享给别人吗？

A: 可以。APK 文件可以直接安装到其他 Android 设备上。

### Q: 如何发布到应用商店？

A: 需要配置生产签名和生成 AAB 格式：
```bash
eas build --platform android --profile production
```

---

## 推荐流程

**开发调试**: 使用 Expo Go（方案 B）
**测试分享**: EAS 云端构建（方案 A）
**正式发布**: 配置生产签名后使用 production profile 构建

---

## 技术支持

如遇到问题，可以：
1. 查看构建日志中的错误信息
2. 访问 [Expo 文档](https://docs.expo.dev/)
3. 查看 [EAS Build 文档](https://docs.expo.dev/build/introduction/)
