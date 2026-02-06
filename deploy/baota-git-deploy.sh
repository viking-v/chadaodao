#!/bin/bash

# ChaDao 宝塔面板 Git 自动部署脚本
# 这是最可靠的部署方式，避免手动操作错误

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# 日志函数
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

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# 配置参数
SERVER_HOST=${1:-"your-server.com"}
SERVER_USER=${2:-"root"}
SERVER_PATH=${3:-"/www/wwwroot/chadao"}
REPO_URL=${4:-"https://github.com/your-username/chadao.git"}
BRANCH=${5:-"main"}
DOMAIN=${6:-"your-domain.com"}

# 显示配置信息
echo "=========================================="
echo "🚀 ChaDao 宝塔面板 Git 部署"
echo "=========================================="
log_info "📋 部署配置:"
echo "   🖥️  服务器: $SERVER_HOST"
echo "   👤 用户: $SERVER_USER"
echo "   📁 路径: $SERVER_PATH"
echo "   🔗 仓库: $REPO_URL"
echo "   🌿 分支: $BRANCH"
echo "   🌐 域名: $DOMAIN"
echo "=========================================="

# 检查本地Git状态
log_step "检查本地Git状态..."
if [ -n "$(git status --porcelain)" ]; then
    log_warning "检测到未提交的更改，正在自动提交..."
    git add .
    git commit -m "Auto commit before deployment - $(date)"
    log_success "本地更改已提交"
fi

# 推送到远程仓库
log_step "推送代码到远程仓库..."
if ! git remote get-url origin >/dev/null 2>&1; then
    log_info "添加远程仓库..."
    git remote add origin $REPO_URL
fi

git push origin $BRANCH --force
log_success "代码推送完成"

# SSH连接到服务器执行部署
log_step "连接服务器执行部署..."
ssh $SERVER_USER@$SERVER_HOST << EOF
set -e

echo "=========================================="
echo "🔧 服务器端部署开始"
echo "=========================================="

# 创建备份目录
BACKUP_DIR="/backup/chadao_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# 进入项目目录
cd $SERVER_PATH

# 备份当前版本
if [ -d ".next" ] || [ -f "package.json" ]; then
    echo "💾 备份当前版本..."
    cp -r . $BACKUP_DIR/ 2>/dev/null || true
    echo "✅ 备份完成: $BACKUP_DIR"
fi

# Git 操作
echo "📥 Git 操作..."
if [ ! -d ".git" ]; then
    echo "🆕 首次部署，克隆仓库..."
    git clone $REPO_URL .
else
    echo "🔄 更新现有代码..."
    git fetch origin
    git reset --hard origin/$BRANCH
    git clean -fd
fi

echo "✅ Git 操作完成"

# 安装依赖
echo "📦 安装依赖..."
if ! command -v pnpm &> /dev/null; then
    echo "📥 安装 pnpm..."
    npm install -g pnpm
fi

pnpm install --production
echo "✅ 依赖安装完成"

# 构建项目
echo "🔨 构建项目..."
pnpm build

# 检查构建结果
if [ ! -d ".next" ]; then
    echo "❌ 构建失败，.next 目录不存在"
    exit 1
fi

echo "✅ 项目构建完成"

# 配置环境变量
echo "⚙️ 配置环境变量..."
if [ ! -f ".env.local" ]; then
    if [ -f ".env.production" ]; then
        cp .env.production .env.local
        echo "✅ 生产环境配置已应用"
    else
        echo "⚠️ 未找到环境配置文件，请手动配置 .env.local"
        echo "请编辑 $SERVER_PATH/.env.local 文件"
    fi
else
    echo "✅ 环境配置文件已存在"
fi

# 设置文件权限
echo "🔐 设置文件权限..."
chown -R www:www .
chmod -R 755 .
echo "✅ 权限设置完成"

# PM2 进程管理
echo "🔄 PM2 进程管理..."
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
    echo "✅ PM2 配置完成"
else
    echo "⚠️ PM2 未安装，请手动安装: npm install -g pm2"
fi

# Nginx 配置
echo "🌐 Nginx 配置..."
if command -v nginx &> /dev/null; then
    nginx -t
    if [ $? -eq 0 ]; then
        nginx -s reload
        echo "✅ Nginx 重载成功"
    else
        echo "⚠️ Nginx 配置有误，请检查配置文件"
    fi
else
    echo "⚠️ Nginx 未找到"
fi

# 清理旧备份 (保留最近5个)
echo "🧹 清理旧备份..."
cd /backup
ls -t | tail -n +6 | xargs -r rm -rf
echo "✅ 备份清理完成"

echo "=========================================="
echo "🎉 服务器端部署完成！"
echo "=========================================="

EOF

# 检查部署结果
if [ $? -eq 0 ]; then
    log_success "🎉 部署成功！"
    echo ""
    echo "📱 访问地址:"
    echo "   🌐 网站: https://$DOMAIN"
    echo "   🔧 管理后台: https://$DOMAIN/admin"
    echo "   📊 宝塔面板: http://$SERVER_HOST:8888"
    echo ""
    echo "📊 部署信息:"
    echo "   📁 项目路径: $SERVER_PATH"
    echo "   🌿 Git分支: $BRANCH"
    echo "   ⏰ 部署时间: $(date)"
    echo ""
    echo "🔍 验证部署:"
    echo "   1. 访问 https://$DOMAIN"
    echo "   2. 测试用户注册/登录"
    echo "   3. 检查管理后台"
    echo "   4. 验证所有功能"
    echo ""
    log_info "📝 查看应用状态:"
    echo "   SSH: ssh $SERVER_USER@$SERVER_HOST"
    echo "   PM2: pm2 status"
    echo "   日志: pm2 logs chadao"
else
    log_error "❌ 部署失败，请检查错误信息"
    exit 1
fi
