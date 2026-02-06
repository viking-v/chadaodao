# 🚀 宝塔面板部署运行程序详细指南

## 📋 部署前准备

### 🔧 服务器要求
- **操作系统**: Linux (推荐Ubuntu 20.04+ / CentOS 7+)
- **内存**: 最低2GB，推荐4GB+
- **存储**: 最低20GB，推荐50GB+
- **网络**: 公网IP，开放80/443端口

### 🛠️ 宝塔面板安装
```bash
# Ubuntu/Debian安装
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh

# CentOS安装
wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sudo bash install.sh

# 安装完成后记录面板地址和账号密码
```

---

## 🎯 第一步：宝塔面板基础配置

### 📋 1.1 登录宝塔面板
1. **访问**: `http://服务器IP:8888`
2. **输入**: 安装时提供的用户名和密码
3. **绑定**: 手机号或邮箱（可选）

### 📋 1.2 安装运行环境
在宝塔面板中安装：
- **Nginx**: Web服务器
- **Node.js**: 18.x版本
- **PM2**: 进程管理器
- **Git**: 版本控制

#### 安装步骤：
1. **软件商店** → **运行环境**
2. **搜索并安装**：
   - Nginx 1.20+
   - Node.js 18.x
   - PM2 Manager

---

## 🎯 第二步：创建网站

### 📋 2.1 添加站点
1. **网站** → **添加站点**
2. **填写信息**：
   ```
   域名: your-domain.com (或IP地址)
   根目录: /www/wwwroot/chadao
   FTP: 不创建
   数据库: 不创建
   PHP版本: 纯静态
   ```
3. **点击**: 提交

### 📋 2.2 配置SSL证书
1. **网站** → **设置** → **SSL**
2. **选择**: Let's Encrypt (免费)
3. **填写域名**: your-domain.com
4. **申请**: 等待证书签发
5. **开启**: 强制HTTPS

---

## 🎯 第三步：部署Node.js应用

### 📋 3.1 上传项目文件
#### 方式1: Git克隆 (推荐)
```bash
# SSH连接到服务器
ssh root@your-server-ip

# 进入网站目录
cd /www/wwwroot/chadao

# 克隆项目 (替换为您的仓库地址)
git clone https://github.com/YOUR_USERNAME/chadao.git .

# 或者如果已存在，拉取最新代码
git pull origin main
```

#### 方式2: 文件上传
1. **宝塔面板** → **文件**
2. **进入**: `/www/wwwroot/chadao`
3. **上传**: 项目压缩包
4. **解压**: 右键解压文件

### 📋 3.2 安装依赖
```bash
# 进入项目目录
cd /www/wwwroot/chadao

# 安装pnpm (如果未安装)
npm install -g pnpm

# 安装项目依赖
pnpm install --production
```

### 📋 3.3 配置环境变量
```bash
# 复制环境配置文件
cp .env.production .env.local

# 编辑环境变量
nano .env.local
```

配置内容：
```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=ChaDao

# USDT配置
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

# 管理员配置
ADMIN_EMAIL=admin@chadao.com

# 环境模式
NODE_ENV=production
```

### 📋 3.4 构建项目
```bash
# 构建生产版本
pnpm build

# 检查构建结果
ls -la .next
```

---

## 🎯 第四步：配置PM2进程管理

### 📋 4.1 创建PM2配置文件
```bash
# 在项目根目录创建ecosystem.config.js
nano ecosystem.config.js
```

配置内容：
```javascript
module.exports = {
  apps: [{
    name: 'chadao',
    script: 'npm',
    args: 'start',
    cwd: '/www/wwwroot/chadao',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/www/wwwroot/chadao/logs/err.log',
    out_file: '/www/wwwroot/chadao/logs/out.log',
    log_file: '/www/wwwroot/chadao/logs/combined.log',
    time: true
  }]
}
```

### 📋 4.2 创建日志目录
```bash
# 创建日志目录
mkdir -p /www/wwwroot/chadao/logs

# 设置权限
chown -R www:www /www/wwwroot/chadao/logs
chmod -R 755 /www/wwwroot/chadao/logs
```

### 📋 4.3 启动应用
```bash
# 启动PM2应用
pm2 start ecosystem.config.js

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
```

### 📋 4.4 验证应用状态
```bash
# 查看PM2状态
pm2 status

# 查看应用日志
pm2 logs chadao

# 查看应用信息
pm2 show chadao
```

---

## 🎯 第五步：配置Nginx反向代理

### 📋 5.1 编辑Nginx配置
1. **网站** → **设置** → **配置文件**
2. **替换**为以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL证书配置
    ssl_certificate /www/server/panel/vhost/cert/your-domain.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 网站根目录
    root /www/wwwroot/chadao;
    index index.html index.htm;
    
    # 日志配置
    access_log /www/wwwlogs/your-domain.com.log;
    error_log /www/wwwlogs/your-domain.com.error.log;
    
    # 反向代理到Node.js应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://127.0.0.1:3000;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### 📋 5.2 测试和重载Nginx
```bash
# 测试Nginx配置
nginx -t

# 重载Nginx配置
nginx -s reload

# 重启Nginx服务
systemctl restart nginx
```

---

## 🎯 第六步：设置文件权限

### 📋 6.1 设置项目权限
```bash
# 设置项目目录权限
chown -R www:www /www/wwwroot/chadao
chmod -R 755 /www/wwwroot/chadao

# 设置可执行权限
chmod +x /www/wwwroot/chadao/node_modules/.bin/*
```

### 📋 6.2 设置日志权限
```bash
# 设置日志目录权限
chown -R www:www /www/wwwroot/chadao/logs
chmod -R 755 /www/wwwroot/chadao/logs
```

---

## 🎯 第七步：防火墙配置

### 📋 7.1 开放必要端口
```bash
# 开放HTTP端口
ufw allow 80/tcp

# 开放HTTPS端口
ufw allow 443/tcp

# 开放SSH端口
ufw allow 22/tcp

# 开放Node.js端口 (如果需要直接访问)
ufw allow 3000/tcp

# 启用防火墙
ufw enable
```

### 📋 7.2 宝塔面板端口配置
1. **安全** → **端口设置**
2. **开放**: 80, 443, 22端口
3. **关闭**: 不必要的端口

---

## 🎯 第八步：监控和维护

### 📋 8.1 设置监控
1. **软件商店** → **宝塔插件**
2. **安装**: 网站监控、系统监控
3. **配置**: 告警规则

### 📋 8.2 定期维护脚本
创建维护脚本：
```bash
# 创建维护脚本
nano /root/chadao-maintenance.sh
```

脚本内容：
```bash
#!/bin/bash
# ChaDao应用维护脚本

echo "开始维护任务..."

# 拉取最新代码
cd /www/wwwroot/chadao
git pull origin main

# 安装新依赖
pnpm install --production

# 重新构建
pnpm build

# 重启应用
pm2 restart chadao

# 清理日志
find /www/wwwroot/chadao/logs -name "*.log" -mtime +7 -delete

echo "维护任务完成"
```

设置定时任务：
```bash
# 编辑crontab
crontab -e

# 每天凌晨3点执行维护
0 3 * * * /root/chadao-maintenance.sh >> /var/log/chadao-maintenance.log 2>&1
```

---

## 🎯 第九步：测试验证

### 📋 9.1 功能测试清单
- [ ] 网站首页正常访问
- [ ] HTTPS证书有效
- [ ] 用户注册功能
- [ ] 用户登录功能
- [ ] 邀请码验证
- [ ] Dashboard显示
- [ ] 管理后台访问
- [ ] 移动端适配

### 📋 9.2 性能测试
```bash
# 检查应用状态
curl -I https://your-domain.com

# 检查响应时间
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com

# 压力测试 (可选)
ab -n 1000 -c 100 https://your-domain.com/
```

---

## 🚨 故障排除

### ❌ 常见问题及解决方案

#### 问题1: 应用无法启动
```bash
# 查看PM2状态
pm2 status

# 查看错误日志
pm2 logs chadao --lines 50

# 检查端口占用
netstat -tlnp | grep :3000
```

#### 问题2: Nginx 502错误
```bash
# 检查Nginx配置
nginx -t

# 查看Nginx错误日志
tail -f /var/log/nginx/error.log

# 检查应用是否运行
curl http://127.0.0.1:3000
```

#### 问题3: SSL证书问题
```bash
# 检查证书状态
certbot certificates

# 重新申请证书
certbot --nginx -d your-domain.com

# 手动续期
certbot renew
```

#### 问题4: 权限问题
```bash
# 重新设置权限
chown -R www:www /www/wwwroot/chadao
chmod -R 755 /www/wwwroot/chadao

# 检查SELinux状态
sestatus
# 如果开启，临时关闭
setenforce 0
```

---

## 🎉 部署完成！

### ✅ 验证清单
- [ ] 宝塔面板正常运行
- [ ] Node.js应用启动成功
- [ ] Nginx反向代理配置正确
- [ ] SSL证书有效
- [ ] 网站功能正常
- [ ] 监控告警设置

### 🚀 访问方式
- **网站地址**: https://your-domain.com
- **管理后台**: https://your-domain.com/admin
- **宝塔面板**: http://your-server-ip:8888

### 📞 技术支持
- **宝塔文档**: https://www.bt.cn/bbs/
- **PM2文档**: https://pm2.keymetrics.io/docs/
- **Nginx文档**: https://nginx.org/en/docs/

**ChaDao创业投资平台已成功部署到宝塔面板！** 🎯
