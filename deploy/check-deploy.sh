#!/bin/bash

# 部署后检查脚本

echo "🔍 ChaDao 部署后检查"
echo "=================================="

# 检查应用是否运行
echo "1. 检查应用状态..."
if pm2 list | grep -q "chadao.*online"; then
    echo "✅ 应用正在运行"
else
    echo "❌ 应用未运行"
    exit 1
fi

# 检查端口
echo "2. 检查端口状态..."
if netstat -tlnp | grep -q ":3000"; then
    echo "✅ 端口3000正在监听"
else
    echo "❌ 端口3000未监听"
fi

# 检查Nginx
echo "3. 检查Nginx状态..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx正在运行"
else
    echo "❌ Nginx未运行"
fi

# 检查网站访问
echo "4. 检查网站可访问性..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 网站本地访问正常"
else
    echo "❌ 网站本地访问异常 (HTTP $HTTP_CODE)"
fi

# 检查SSL证书
echo "5. 检查SSL证书..."
if [ -f "/etc/nginx/ssl/cert.pem" ]; then
    EXPIRY=$(openssl x509 -enddate -noout -in /etc/nginx/ssl/cert.pem | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
    CURRENT_EPOCH=$(date +%s)
    DAYS_LEFT=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))
    
    if [ $DAYS_LEFT -gt 30 ]; then
        echo "✅ SSL证书有效 (剩余${DAYS_LEFT}天)"
    else
        echo "⚠️ SSL证书即将过期 (剩余${DAYS_LEFT}天)"
    fi
else
    echo "⚠️ SSL证书未找到"
fi

# 检查磁盘空间
echo "6. 检查磁盘空间..."
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "${DISK_USAGE%.*}" -lt 80 ]; then
    echo "✅ 磁盘空间充足 (使用${DISK_USAGE})"
else
    echo "⚠️ 磁盘空间不足 (使用${DISK_USAGE})"
fi

# 检查内存使用
echo "7. 检查内存使用..."
MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ "${MEM_USAGE%.*}" -lt 85 ]; then
    echo "✅ 内存使用正常 (使用${MEM_USAGE}%)"
else
    echo "⚠️ 内存使用过高 (使用${MEM_USAGE}%)"
fi

echo "=================================="
echo "🎉 检查完成！"
