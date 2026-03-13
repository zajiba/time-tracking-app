#!/bin/bash

# 工作时间记录 App - 本地 APK 构建脚本
# 使用说明：
# 1. 先获取 Expo Token: https://expo.dev/accounts → Access Tokens → Create new token
# 2. 设置环境变量: export EXPO_TOKEN=你的token
# 3. 执行脚本: bash build-apk.sh

set -e

echo "========================================="
echo "  工作时间记录 App - APK 本地构建"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Expo Token
if [ -z "$EXPO_TOKEN" ]; then
    echo -e "${RED}❌ 错误: 未设置 EXPO_TOKEN 环境变量${NC}"
    echo ""
    echo "请先获取 Expo Token："
    echo "1. 访问: https://expo.dev/accounts"
    echo "2. 登录后点击左侧 'Access Tokens'"
    echo "3. 点击 'Create new token'"
    echo "4. 输入名称（如 'Local Build'）并创建"
    echo "5. 复制生成的 token"
    echo ""
    echo "然后设置环境变量："
    echo "  export EXPO_TOKEN=你的token"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Expo Token 已设置${NC}"
echo ""

# 进入客户端目录
cd "$(dirname "$0")/client"
echo "📁 工作目录: $(pwd)"
echo ""

# 检查 eas.json 是否存在
if [ ! -f "eas.json" ]; then
    echo -e "${RED}❌ 错误: eas.json 文件不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✅ EAS 配置文件存在${NC}"
echo ""

# 显示构建配置
echo "📋 构建配置:"
echo "  - 平台: Android"
echo "  - Profile: preview (生成 APK)"
echo "  - 构建类型: apk"
echo ""

# 确认构建
read -p "开始构建? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸️  构建已取消${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  开始构建... (预计 10-20 分钟)${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""

# 设置环境变量
export EXPO_TOKEN="$EXPO_TOKEN"

# 执行构建
eas build --platform android --profile preview

# 检查构建结果
BUILD_EXIT_CODE=$?

echo ""
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}  ✅ 构建成功！${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "📦 APK 文件位置:"
    ls -lh *.apk 2>/dev/null || echo "APK 文件在 EAS 构建输出中"
    echo ""
    echo "📱 安装到 Android 设备:"
    echo "  1. 将 APK 文件传输到手机"
    echo "  2. 启用'未知来源应用安装'"
    echo "  3. 点击 APK 文件安装"
    echo ""
else
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}  ❌ 构建失败${NC}"
    echo -e "${RED}=========================================${NC}"
    echo ""
    echo "请检查上面的错误信息，常见原因："
    echo "  - Expo Token 无效或过期"
    echo "  - 网络连接问题"
    echo "  - 依赖安装失败"
    echo ""
    exit 1
fi
