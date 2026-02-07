# 🚀 宝塔面板 GitHub 安装配置指南

## 📋 安装 GitHub 相关工具

### 🔧 第一步：SSH 连接服务器
```bash
ssh root@45.77.171.220
```

### 📋 第二步：安装 Git
```bash
# Ubuntu/Debian 系统
sudo apt update
sudo apt install git -y

# CentOS/RHEL 系统
sudo yum update
sudo yum install git -y

# 验证安装
git --version
```

### 📋 第三步：安装 Node.js
```bash
# 使用 NodeSource 仓库安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 📋 第四步：安装 pnpm
```bash
# 安装 pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

### 📋 第五步：安装 PM2
```bash
# 安装 PM2
npm install -g pm2

# 验证安装
pm2 --version

# 设置 PM2 开机自启
pm2 startup
pm2 save
```

### 📋 第六步：配置 SSH 密钥
```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "server@45.77.171.220"

# 启动 SSH 代理
eval "$(ssh-agent -s)"

# 添加私钥到代理
ssh-add ~/.ssh/id_ed25519

# 查看公钥
cat ~/.ssh/id_ed25519.pub
```

### 📋 第七步：添加 SSH 密钥到 GitHub
1. **复制公钥内容**
2. **访问**: https://github.com/settings/keys
3. **点击**: "New SSH key"
4. **填写**:
   - Title: Baota Server (45.77.171.220)
   - Key: 粘贴公钥内容
5. **点击**: "Add SSH key"

### 📋 第八步：测试 SSH 连接
```bash
# 测试 SSH 连接到 GitHub
ssh -T git@github.com

# 应该显示: Hi viking-v! You've successfully authenticated...
```

---

## 🎯 宝塔面板配置

### 📋 安装宝塔面板 (如果未安装)
```bash
# Ubuntu/Debian 系统
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh

# CentOS 系统
wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sudo bash install.sh
```

### 📋 登录宝塔面板
1. **访问**: http://45.77.171.220:8888
2. **输入**: 安装时提供的用户名和密码
3. **完成**: 绑定手机号或邮箱

### 📋 安装运行环境
在宝塔面板中安装：
1. **软件商店** → **运行环境**
2. **搜索并安装**:
   - Nginx 1.20+
   - Node.js 18.x (如果未通过命令行安装)
   - PM2 Manager (可选)

---

## 🌐 创建网站

### 📋 添加站点
1. **网站** → **添加站点**
2. **填写信息**:
   ```
   域名: vo.gthmjjh.com
   根目录: /www/wwwroot/vo.gthmjjh.com
   FTP: 不创建
   数据库: 不创建
   PHP版本: 纯静态
   ```
3. **点击**: 提交

### 📋 配置 SSL 证书
1. **网站** → **设置** → **SSL**
2. **选择**: Let's Encrypt
3. **填写域名**: vo.gthmjjh.com
4. **申请证书**
5. **开启**: 强制 HTTPS

---

## 🚀 部署项目

### 📋 进入项目目录
```bash
cd /www/wwwroot/vo.gthmjjh.com
```

### 📋 克隆项目
```bash
# 克隆您的项目
git clone https://github.com/viking-v/chadaodao.git .

# 或者使用 SSH (推荐)
git clone git@github.com:viking-v/chadaodao.git .
```

### 📋 安装依赖
```bash
# 安装项目依赖
pnpm install --production
```

### 📋 配置环境变量
```bash
# 复制环境配置文件
cp .env.production .env.local

# 编辑环境变量
nano .env.local
```

配置内容：
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 应用配置
NEXT_PUBLIC_APP_URL=https://vo.gthmjjh.com
NEXT_PUBLIC_APP_NAME=ChaDao

# USDT 配置
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

# 管理员配置
ADMIN_EMAIL=admin@chadao.com

# 环境模式
NODE_ENV=production
```

### 📋 构建项目
```bash
# 构建生产版本
pnpm build
```

### 📋 创建 PM2 配置
```bash
# 创建 ecosystem.config.js
nano ecosystem.config.js
```

配置内容：
```javascript
module.exports = {
  apps: [{
    name: 'chadao',
    script: 'npm',
    args: 'start',
    cwd: '/www/wwwroot/vo.gthmjjh.com',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/www/wwwroot/vo.gthmjjh.com/logs/err.log',
    out_file: '/www/wwwroot/vo.gthmjjh.com/logs/out.log',
    log_file: '/www/wwwroot/vo.gthmjjh.com/logs/combined.log',
    time: true
  }]
}
```

### 📋 启动应用
```bash
# 创建日志目录
mkdir -p logs

# 启动 PM2 应用
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

---

## 🌐 配置 Nginx

### 📋 编辑 Nginx 配置
在宝塔面板：**网站** → **设置** → **配置文件**

```nginx
server {
    listen 80;
    server_name vo.gthmjjh.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vo.gthmjjh.com;
    
    # SSL 证书配置
    ssl_certificate /www/server/panel/vhost/cert/vo.gthmjjh.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/vo.gthmjjh.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 反向代理到 Node.js 应用
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
}
```

### 📋 重载 Nginx
```bash
# 测试 Nginx 配置
nginx -t

# 重载 Nginx 配置
nginx -s reload
```

---

## 🔧 设置文件权限

### 📋 设置项目权限
```bash
# 设置正确的文件权限
chown -R www:www /www/wwwroot/vo.gthmjjh.com
chmod -R 755 /www/wwwroot/vo.gthmjjh.com
```

---

## 🔍 验证部署

### ✅ 检查清单
- [ ] 网站正常访问: https://vo.gthmjjh.com
- [ ] HTTPS 证书有效
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] Dashboard 显示正常
- [ ] 管理后台可访问: https://vo.gthmjjh.com/admin

### 🔍 验证命令
```bash
# 检查 PM2 状态
pm2 status

# 查看应用日志
pm2 logs chadao

# 测试本地访问
curl http://127.0.0.1:3000

# 检查网站访问
curl -I https://vo.gthmjjh.com
```

---

## 🔄 更新部署

### 📋 拉取最新代码
```bash
cd /www/wwwroot/vo.gthmjjh.com

# 拉取最新代码
git pull origin main

# 安装新依赖
pnpm install --production

# 重新构建
pnpm build

# 重启应用
pm2 restart chadao
```

---

## 🚨 故障排除

### ❌ 常见问题

#### 问题1: Git 连接失败
```bash
# 检查 Git 版本
git --version

# 检查 SSH 密钥
ssh -T git@github.com

# 重新生成 SSH 密钥
ssh-keygen -t ed25519 -C "server@45.77.171.220"
```

#### 问题2: Node.js 版本问题
```bash
# 检查 Node.js 版本
node --version

# 如果版本过低，重新安装
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 问题3: PM2 启动失败
```bash
# 查看详细错误
pm2 logs chadao --lines 50

# 检查配置文件
cat ecosystem.config.js

# 手动启动测试
cd /www/wwwroot/vo.gthmjjh.com
npm start
```

#### 问题4: Nginx 502 错误
```bash
# 测试 Nginx 配置
nginx -t

# 检查应用是否运行
curl http://127.0.0.1:3000

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log
```

---

## 🎉 安装完成！

### ✅ 访问地址
- **网站**: https://vo.gthmjjh.com
- **管理后台**: https://vo.gthmjjh.com/admin
- **宝塔面板**: http://45.77.171.220:8888

### 📞 技术支持
- **GitHub文档**: https://docs.github.com
- **PM2文档**: https://pm2.keymetrics.io/docs/
- **宝塔文档**: https://www.bt.cn/bbs/

**按照这些命令，您就能在宝塔面板上成功安装和配置GitHub相关工具！** 🎯
