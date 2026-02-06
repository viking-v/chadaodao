#!/bin/bash

# ChaDao 本地部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info "🚀 开始本地部署 ChaDao..."

# 检查Node.js版本
log_info "检查Node.js版本..."
if ! command -v node &> /dev/null; then
    log_error "Node.js未安装，请先安装Node.js 18.x或更高版本"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    log_error "Node.js版本过低，当前: $NODE_VERSION，需要: >= $REQUIRED_VERSION"
    exit 1
fi

log_success "Node.js版本检查通过: $NODE_VERSION"

# 检查pnpm
log_info "检查pnpm..."
if ! command -v pnpm &> /dev/null; then
    log_info "安装pnpm..."
    npm install -g pnpm
fi

log_success "pnpm检查通过"

# 清理旧的构建
log_info "清理旧的构建文件..."
rm -rf .next
rm -rf node_modules/.cache

# 安装依赖
log_info "安装项目依赖..."
pnpm install

# 配置环境变量
log_info "配置环境变量..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    log_success "已创建 .env.local 文件"
    log_warning "请根据需要编辑 .env.local 文件"
fi

# 构建项目
log_info "构建项目..."
pnpm build

# 检查构建结果
if [ ! -d ".next" ]; then
    log_error "构建失败，.next目录不存在"
    exit 1
fi

log_success "项目构建完成"

# 启动应用
log_info "启动应用..."
log_info "应用将在 http://localhost:3000 启动"
log_info "按 Ctrl+C 停止应用"

# 检查端口是否被占用
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log_warning "端口3000已被占用，正在尝试停止..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# 启动应用
pnpm start &

# 等待应用启动
log_info "等待应用启动..."
sleep 5

# 健康检查
log_info "执行健康检查..."
for i in {1..10}; do
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        log_success "应用启动成功！"
        log_info "访问地址: http://localhost:3000"
        log_info "测试账户: test@chadao.com / password123"
        break
    else
        if [ $i -eq 10 ]; then
            log_error "应用启动失败，请检查日志"
            exit 1
        fi
        log_info "等待应用启动... ($i/10)"
        sleep 2
    fi
done

# 显示有用的信息
echo ""
log_info "🎉 部署完成！"
echo ""
echo "📋 有用的命令:"
echo "  查看日志: pnpm logs"
echo "  重启应用: pnpm restart"
echo "  停止应用: pnpm stop"
echo ""
echo "🔗 访问链接:"
echo "  主页: http://localhost:3000"
echo "  登录: http://localhost:3000/auth/login"
echo "  Dashboard: http://localhost:3000/dashboard"
echo "  管理后台: http://localhost:3000/admin"
echo ""
echo "🧪 测试账户:"
echo "  邮箱: test@chadao.com"
echo "  密码: password123"
echo ""

# 保持脚本运行
log_info "应用正在运行，按 Ctrl+C 停止..."
wait
