# ChaDao 宝塔面板部署指南

## 🚀 部署前准备

### 1. 服务器要求
- **操作系统**: Linux (推荐 Ubuntu 20.04+)
- **内存**: 最低 2GB，推荐 4GB+
- **存储**: 最低 20GB SSD
- **网络**: 稳定的互联网连接

### 2. 宝塔面板安装
```bash
# 安装宝塔面板
wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sudo bash install.sh

# 安装完成后访问面板
# 地址: http://服务器IP:8888
# 用户名: 默认随机生成
# 密码: 默认随机生成
```

### 3. 环境配置
在宝塔面板中安装：
- **Node.js**: 18.x 或更高版本
- **PM2**: 进程管理器
- **Nginx**: Web服务器
- **MySQL**: 8.0+ (如果需要本地数据库)

## 📦 项目部署

### 1. 上传项目文件
```bash
# 方法1: 使用宝塔文件管理器上传
# 将整个项目文件夹上传到 /www/wwwroot/chadao/

# 方法2: 使用Git克隆
cd /www/wwwroot/
git clone https://github.com/your-repo/chadao.git
```

### 2. 安装依赖
```bash
cd /www/wwwroot/chadao
npm install -g pnpm
pnpm install --production
```

### 3. 配置环境变量
```bash
# 复制生产环境配置
cp .env.production .env.local

# 编辑配置文件
nano .env.local
```

**重要配置项**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
ADMIN_EMAIL=admin@chadao.com
```

### 4. 构建项目
```bash
pnpm build
```

### 5. 配置PM2
创建PM2配置文件 `ecosystem.config.js`:
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
    }
  }]
}
```

启动应用：
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🌐 Nginx配置

### 1. 创建站点
在宝塔面板中：
1. 点击"网站"
2. 点击"添加站点"
3. 域名填写: `your-domain.com`
4. 根目录选择: `/www/wwwroot/chadao`
5. PHP版本选择: "纯静态"

### 2. 配置反向代理
编辑站点配置文件：
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL证书配置
    ssl_certificate /www/server/panel/vhost/cert/your-domain.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_prefer_server_ciphers off;
    
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
        
        # 处理大文件上传
        client_max_body_size 50M;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
```

## 🔒 SSL证书配置

### 1. 免费SSL证书
在宝塔面板中：
1. 点击"网站" → "你的域名"
2. 点击"设置" → "SSL"
3. 选择"Let's Encrypt"
4. 填写邮箱地址
5. 点击"申请"
6. 等待证书签发

### 2. 强制HTTPS
在站点配置中添加：
```nginx
# HTTP重定向到HTTPS
if ($scheme != "https") {
    return 301 https://$host$request_uri;
}
```

## 🔧 运维监控

### 1. PM2监控
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs chadao

# 重启应用
pm2 restart chadao

# 查看详细信息
pm2 show chadao
```

### 2. 系统监控
在宝塔面板中监控：
- CPU使用率
- 内存使用率
- 磁盘空间
- 网络流量
- 应用状态

## 🚨 故障排除

### 1. 常见问题

**应用无法启动**
```bash
# 检查Node.js版本
node --version

# 检查端口占用
netstat -tlnp | grep :3000

# 查看PM2日志
pm2 logs chadao --lines 50
```

**数据库连接失败**
```bash
# 检查环境变量
cat .env.local | grep SUPABASE

# 测试网络连接
curl -I https://your-project.supabase.co
```

**页面404错误**
```bash
# 检查Nginx配置
nginx -t

# 重载Nginx配置
nginx -s reload

# 检查文件权限
ls -la /www/wwwroot/chadao/
```

### 2. 性能优化

**启用Gzip压缩**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

**配置缓存**
```nginx
# 浏览器缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 📊 备份策略

### 1. 数据库备份
- Supabase自动备份
- 导出重要数据

### 2. 文件备份
```bash
# 创建备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backup/chadao_$DATE.tar.gz /www/wwwroot/chadao

# 设置定时备份
crontab -e
# 添加: 0 2 * * * /path/to/backup.sh
```

## 🎯 部署后检查清单

- [ ] 网站可以正常访问
- [ ] HTTPS证书有效
- [ ] 用户可以注册登录
- [ ] 邀请码功能正常
- [ ] Dashboard页面正常
- [ ] 管理后台可访问
- [ ] PM2进程稳定运行
- [ ] Nginx日志无错误
- [ ] SSL证书自动续期
- [ ] 备份策略已实施

## 📞 技术支持

如遇部署问题，请检查：
1. 宝塔面板日志
2. PM2应用日志
3. Nginx访问日志
4. 系统资源使用情况

---

**部署完成后，访问 https://your-domain.com 即可使用ChaDao平台！**
