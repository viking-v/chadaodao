# 🚀 宝塔面板 Git 部署完整指南

## 🎯 为什么选择 Git 部署？

### ✅ 优势
- **零错误**: 避免手动操作失误
- **版本控制**: 完整的版本历史
- **回滚简单**: 快速回退到之前版本
- **自动化**: 一键部署，无需手动操作
- **备份自动**: 每次部署自动备份
- **团队协作**: 多人协作开发

---

## 📋 部署前准备

### 🔧 服务器环境要求
- **操作系统**: Ubuntu 20.04+ / CentOS 7+
- **宝塔面板**: 已安装 (7.7+)
- **Node.js**: 18.x+
- **PM2**: 进程管理器
- **Git**: 版本控制工具
- **Nginx**: Web服务器

### 🛠️ 安装必要工具
```bash
# SSH 连接服务器
ssh root@your-server-ip

# 安装 Node.js (如果未安装)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 安装 Git (如果未安装)
sudo apt update
sudo apt install git -y

# 验证安装
node --version
npm --version
pm2 --version
git --version
```

---

## 🎯 第一步：创建网站

### 📋 在宝塔面板创建站点
1. **登录宝塔面板**: `http://your-server-ip:8888`
2. **网站** → **添加站点**
3. **填写配置**:
   ```
   域名: your-domain.com
   根目录: /www/wwwroot/chadao
   FTP: 不创建
   数据库: 不创建
   PHP版本: 纯静态
   ```
4. **提交创建**

### 📋 配置 SSL 证书
1. **网站** → **设置** → **SSL**
2. **选择**: Let's Encrypt
3. **填写域名**: your-domain.com
4. **申请证书**
5. **开启强制 HTTPS**

---

## 🎯 第二步：配置 SSH 免密登录

### 📋 本地生成 SSH 密钥
```bash
# 在本地电脑执行
ssh-keygen -t ed25519 -C "your-email@example.com"

# 启动 SSH 代理
eval "$(ssh-agent -s)"

# 添加私钥到代理
ssh-add ~/.ssh/id_ed25519

# 复制公钥
cat ~/.ssh/id_ed25519.pub
```

### 📋 服务器添加 SSH 密钥
```bash
# SSH 连接服务器
ssh root@your-server-ip

# 创建 .ssh 目录
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 添加公钥到 authorized_keys
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 测试 SSH 连接
ssh root@your-server-ip
```

---

## 🎯 第三步：创建 Git 仓库

### 📋 创建 GitHub 仓库
1. **访问**: https://github.com
2. **登录**: 您的 GitHub 账户
3. **创建仓库**:
   ```
   Repository name: chadao
   Description: ChaDao 创业投资平台
   Visibility: Public
   ```
4. **点击**: Create repository

### 📋 本地连接远程仓库
```bash
# 在项目目录下执行
git remote add origin https://github.com/YOUR_USERNAME/chadao.git

# 推送代码
git push -u origin main
```

---

## 🎯 第四步：使用自动部署脚本

### 📋 部署脚本功能
我们的 `deploy/baota-git-deploy.sh` 脚本包含：
- ✅ **自动推送**: 推送最新代码到远程仓库
- ✅ **服务器连接**: SSH 自动连接服务器
- ✅ **代码更新**: Git 拉取最新代码
- ✅ **依赖安装**: 自动安装项目依赖
- ✅ **项目构建**: 自动构建生产版本
- ✅ **环境配置**: 自动配置环境变量
- ✅ **权限设置**: 自动设置文件权限
- ✅ **进程管理**: 自动重启 PM2 应用
- ✅ **服务重载**: 自动重载 Nginx
- ✅ **备份管理**: 自动备份和清理

### 📋 使用部署脚本
```bash
# 赋予执行权限
chmod +x deploy/baota-git-deploy.sh

# 执行部署 (替换为您的实际信息)
./deploy/baota-git-deploy.sh your-server.com root /www/wwwroot/chadao https://github.com/YOUR_USERNAME/chadao.git main your-domain.com
```

### 📋 脚本参数说明
```bash
./deploy/baota-git-deploy.sh [服务器地址] [用户名] [项目路径] [仓库地址] [分支名] [域名]

# 示例
./deploy/baota-git-deploy.sh server.com root /www/wwwroot/chadao https://github.com/user/chadao.git main chadao.com
```

---

## 🎯 第五步：服务器端配置

### 📋 创建 PM2 配置文件
在服务器上创建 `/www/wwwroot/chadao/ecosystem.config.js`:
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

### 📋 创建环境配置文件
在服务器上创建 `/www/wwwroot/chadao/.env.local`:
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=ChaDao

# USDT 配置
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

# 管理员配置
ADMIN_EMAIL=admin@chadao.com

# 环境模式
NODE_ENV=production
```

---

## 🎯 第六步：Nginx 配置

### 📋 配置反向代理
在宝塔面板：**网站** → **设置** → **配置文件**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL 证书配置
    ssl_certificate /www/server/panel/vhost/cert/your-domain.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/your-domain.com/privkey.pem;
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

---

## 🎯 第七步：首次部署

### 📋 执行首次部署
```bash
# 在本地项目目录执行
./deploy/baota-git-deploy.sh your-server.com root /www/wwwroot/chadao https://github.com/YOUR_USERNAME/chadao.git main your-domain.com
```

### 📋 部署过程监控
脚本执行时会显示详细日志：
```
==========================================
🚀 ChaDao 宝塔面板 Git 部署
==========================================
[INFO] 📋 部署配置:
   🖥️  服务器: your-server.com
   👤 用户: root
   📁 路径: /www/wwwroot/chadao
   🔗 仓库: https://github.com/YOUR_USERNAME/chadao.git
   🌿 分支: main
   🌐 域名: your-domain.com
==========================================
[STEP] 检查本地Git状态...
[SUCCESS] 本地更改已提交
[STEP] 推送代码到远程仓库...
[SUCCESS] 代码推送完成
[STEP] 连接服务器执行部署...
```

---

## 🎯 第八步：验证部署

### ✅ 部署验证清单
- [ ] 网站首页正常访问: https://your-domain.com
- [ ] HTTPS 证书有效
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] Dashboard 显示正常
- [ ] 管理后台可访问: https://your-domain.com/admin
- [ ] PM2 进程运行正常
- [ ] Nginx 配置正确

### 🔍 验证命令
```bash
# SSH 连接服务器
ssh root@your-server-ip

# 检查 PM2 状态
pm2 status

# 查看应用日志
pm2 logs chadao

# 检查端口占用
netstat -tlnp | grep :3000

# 测试本地访问
curl http://127.0.0.1:3000

# 检查 Nginx 状态
systemctl status nginx

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log
```

---

## 🔄 日常更新部署

### 📋 更新代码流程
```bash
# 1. 修改代码
# 2. 提交更改
git add .
git commit -m "更新功能描述"

# 3. 执行部署
./deploy/baota-git-deploy.sh your-server.com root /www/wwwroot/chadao https://github.com/YOUR_USERNAME/chadao.git main your-domain.com
```

### 📋 自动备份
每次部署会自动：
- 备份当前版本到 `/backup/chadao_YYYYMMDD_HHMMSS`
- 保留最近 5 个备份
- 自动清理旧备份

---

## 🚨 故障排除

### ❌ 常见问题解决

#### 问题 1: SSH 连接失败
```bash
# 检查 SSH 密钥
ssh -v root@your-server-ip

# 重新添加密钥
ssh-copy-id ~/.ssh/id_ed25519.pub root@your-server-ip
```

#### 问题 2: Git 推送失败
```bash
# 检查远程仓库地址
git remote -v

# 重新设置远程地址
git remote set-url origin https://github.com/YOUR_USERNAME/chadao.git

# 检查认证
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

#### 问题 3: PM2 应用启动失败
```bash
# 查看详细错误
pm2 logs chadao --lines 50

# 检查 Node.js 版本
node --version

# 手动启动测试
cd /www/wwwroot/chadao
npm start
```

#### 问题 4: Nginx 502 错误
```bash
# 测试 Nginx 配置
nginx -t

# 重载 Nginx
nginx -s reload

# 检查应用是否运行
curl http://127.0.0.1:3000
```

#### 问题 5: 构建失败
```bash
# 清理缓存
cd /www/wwwroot/chadao
rm -rf .next node_modules

# 重新安装
pnpm install --production
pnpm build
```

---

## 🎉 部署完成！

### ✅ 成功标志
- 🌐 网站正常访问
- 🔒 HTTPS 证书有效
- 👤 用户功能正常
- 📊 Dashboard 显示正常
- 🛠️ 管理后台可访问
- 🔄 自动部署正常

### 🚀 访问地址
- **网站**: https://your-domain.com
- **管理后台**: https://your-domain.com/admin
- **宝塔面板**: http://your-server-ip:8888

### 📞 技术支持
- **部署脚本**: `deploy/baota-git-deploy.sh`
- **详细指南**: `BAOTA-GIT-DEPLOY.md`
- **故障排除**: 查看常见问题部分

---

## 🎯 最佳实践

### 📋 部署建议
1. **使用 Git 部署**: 避免手动操作错误
2. **定期备份**: 自动备份重要数据
3. **监控告警**: 设置应用监控
4. **日志管理**: 定期清理日志文件
5. **安全更新**: 定期更新系统和依赖

### 🔄 开发流程
1. **本地开发**: 功能开发和测试
2. **代码提交**: Git 提交更改
3. **自动部署**: 使用部署脚本
4. **验证测试**: 确认功能正常
5. **监控运行**: 关注应用状态

**使用 Git 方式部署是最可靠的选择，完全避免手动操作错误！** 🎯
