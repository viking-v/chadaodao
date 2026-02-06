#!/bin/bash

# ChaDao Git远程部署到宝塔面板脚本

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

# 配置参数
SERVER_HOST=${1:-"your-server.com"}
SERVER_USER=${2:-"root"}
SERVER_PATH=${3:-"/www/wwwroot/chadao"}
REPO_URL=${4:-"https://github.com/your-username/chadao.git"}
BRANCH=${5:-"main"}

log_info "🚀 开始Git远程部署到宝塔面板"
echo ""
log_info "📋 部署配置:"
echo "   服务器: $SERVER_HOST"
echo "   用户: $SERVER_USER"
echo "   路径: $SERVER_PATH"
echo "   仓库: $REPO_URL"
echo "   分支: $BRANCH"
echo ""

# 检查Git状态
log_info "🔍 检查Git状态..."
if [ -n "$(git status --porcelain)" ]; then
    log_warning "检测到未提交的更改，正在提交..."
    git add .
    git commit -m "Auto commit before deployment"
fi

# 推送到远程仓库
log_info "📤 推送代码到远程仓库..."
if ! git remote get-url origin; then
    log_info "添加远程仓库..."
    git remote add origin $REPO_URL
fi

git push origin $BRANCH --force
log_success "代码推送完成"

# SSH连接到服务器并部署
log_info "🔗 连接到服务器进行部署..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
set -e

echo "🔧 开始服务器端部署..."

# 进入项目目录
cd $SERVER_PATH

# 备份当前版本
if [ -d ".git" ]; then
    echo "💾 备份当前版本..."
    BACKUP_DIR="/backup/chadao_$(date +%Y%m%d_%H%M%S)"
    mkdir -p $BACKUP_DIR
    cp -r . $BACKUP_DIR/
    echo "备份完成: $BACKUP_DIR"
fi

# 拉取最新代码
echo "📥 拉取最新代码..."
if [ ! -d ".git" ]; then
    echo "🆕 首次部署，克隆仓库..."
    git clone $REPO_URL .
else
    echo "🔄 更新现有代码..."
    git fetch origin
    git reset --hard origin/$BRANCH
    git clean -fd
fi

# 安装/更新依赖
echo "📦 安装依赖..."
if command -v pnpm &> /dev/null; then
    pnpm install --production
else
    npm install --production
fi

# 构建项目
echo "🔨 构建项目..."
if command -v pnpm &> /dev/null; then
    pnpm build
else
    npm run build
fi

# 检查构建结果
if [ ! -d ".next" ]; then
    echo "❌ 构建失败，.next目录不存在"
    exit 1
fi

echo "✅ 构建完成"

# 配置环境变量
echo "⚙️ 配置环境变量..."
if [ ! -f ".env.local" ]; then
    if [ -f ".env.production" ]; then
        cp .env.production .env.local
        echo "✅ 生产环境配置已应用"
    else
        echo "⚠️ 未找到环境配置文件，请手动配置.env.local"
    fi
fi

# 设置权限
echo "🔐 设置文件权限..."
chown -R www:www .
chmod -R 755 .

# 重启PM2进程
echo "🔄 重启应用服务..."
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "chadao"; then
        echo "🔄 重启现有应用..."
        pm2 restart chadao
    else
        echo "🚀 启动新应用..."
        pm2 start ecosystem.config.js
    fi
    pm2 save
    pm2 startup
else
    echo "⚠️ PM2未安装，请手动启动应用"
fi

# 重载Nginx
echo "🌐 重载Nginx配置..."
if command -v nginx &> /dev/null; then
    nginx -t && nginx -s reload
    echo "✅ Nginx重载成功"
else
    echo "⚠️ Nginx未找到，请手动重载"
fi

echo "🎉 服务器端部署完成！"

EOF

if [ $? -eq 0 ]; then
    log_success "🎉 部署成功！"
    echo ""
    log_info "📱 访问地址: http://$SERVER_HOST"
    log_info "🔧 管理面板: http://$SERVER_HOST:8888"
    echo ""
    log_info "📊 部署信息:"
    echo "   项目路径: $SERVER_PATH"
    echo "   Git分支: $BRANCH"
    echo "   部署时间: $(date)"
    echo ""
    log_info "🔍 验证部署:"
    echo "   1. 访问 http://$SERVER_HOST"
    echo "   2. 测试登录功能"
    echo "   3. 检查应用状态"
else
    log_error "❌ 部署失败，请检查错误信息"
    exit 1
fi
