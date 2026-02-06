#!/bin/bash

# ChaDao 自动部署脚本
# 使用方法: ./deploy.sh [环境]
# 环境: dev, staging, production

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 检查参数
ENVIRONMENT=${1:-production}
log_info "部署环境: $ENVIRONMENT"

# 项目路径
PROJECT_DIR="/www/wwwroot/chadao"
BACKUP_DIR="/backup/chadao"
DATE=$(date +%Y%m%d_%H%M%S)

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    log_error "请使用root用户运行此脚本"
    exit 1
fi

# 创建备份
log_info "创建项目备份..."
if [ -d "$PROJECT_DIR" ]; then
    mkdir -p $BACKUP_DIR
    tar -czf "$BACKUP_DIR/chadao_$DATE.tar.gz" -C "$(dirname "$PROJECT_DIR")" "$(basename "$PROJECT_DIR")"
    log_success "备份创建完成: $BACKUP_DIR/chadao_$DATE.tar.gz"
fi

# 停止现有服务
log_info "停止现有服务..."
cd $PROJECT_DIR || exit 1

# 停止PM2进程
if command -v pm2 &> /dev/null; then
    pm2 stop chadao || true
    pm2 delete chadao || true
fi

# 停止Docker容器
if command -v docker &> /dev/null; then
    docker-compose -f deploy/docker-compose.yml down || true
fi

# 更新代码
log_info "更新项目代码..."
git pull origin main || {
    log_warning "Git pull失败，继续部署现有代码"
}

# 安装依赖
log_info "安装项目依赖..."
if command -v pnpm &> /dev/null; then
    pnpm install --production
else
    npm install --production
fi

# 配置环境变量
log_info "配置环境变量..."
if [ "$ENVIRONMENT" = "production" ]; then
    cp .env.production .env.local
elif [ "$ENVIRONMENT" = "staging" ]; then
    cp .env.staging .env.local
else
    cp .env.example .env.local
fi

# 构建项目
log_info "构建项目..."
if command -v pnpm &> /dev/null; then
    pnpm build
else
    npm run build
fi

# 检查构建结果
if [ ! -d ".next" ]; then
    log_error "构建失败，.next目录不存在"
    exit 1
fi

# 设置权限
log_info "设置文件权限..."
chown -R www:www $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

# 启动服务
log_info "启动应用服务..."

# 方式1: 使用PM2
if command -v pm2 &> /dev/null; then
    log_info "使用PM2启动应用..."
    pm2 start deploy/ecosystem.config.js
    pm2 save
    pm2 startup
fi

# 方式2: 使用Docker
if [ -f "deploy/docker-compose.yml" ] && command -v docker &> /dev/null; then
    log_info "使用Docker启动应用..."
    docker-compose -f deploy/docker-compose.yml up -d
fi

# 重载Nginx
log_info "重载Nginx配置..."
nginx -t && nginx -s reload

# 健康检查
log_info "执行健康检查..."
sleep 10

HEALTH_URL="http://localhost:3000/health"
if command -v curl &> /dev/null; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)
    if [ "$HTTP_STATUS" = "200" ]; then
        log_success "应用启动成功，健康检查通过"
    else
        log_warning "健康检查失败，HTTP状态码: $HTTP_STATUS"
    fi
else
    log_warning "curl命令不可用，跳过健康检查"
fi

# 清理旧备份
log_info "清理旧备份..."
find $BACKUP_DIR -name "chadao_*.tar.gz" -mtime +7 -delete

# 显示服务状态
log_info "服务状态:"

if command -v pm2 &> /dev/null; then
    echo "PM2状态:"
    pm2 status
fi

if command -v docker &> /dev/null; then
    echo "Docker容器状态:"
    docker-compose -f deploy/docker-compose.yml ps
fi

# 系统资源使用情况
log_info "系统资源使用情况:"
echo "CPU使用率: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%\*/\1%/")"
echo "内存使用: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "磁盘使用: $(df -h / | awk 'NR==2 {print $3 "/" $2 "/" $5}')"

# 部署完成
log_success "部署完成！"
log_info "项目地址: https://your-domain.com"
log_info "备份位置: $BACKUP_DIR/chadao_$DATE.tar.gz"

# 监控建议
echo ""
log_info "监控建议:"
echo "1. 定期检查应用状态: pm2 status"
echo "2. 查看应用日志: pm2 logs chadao"
echo "3. 监控系统资源: top, df -h"
echo "4. 检查Nginx日志: tail -f /var/log/nginx/access.log"
echo "5. 设置监控告警: 建议配置邮件或短信告警"

exit 0
