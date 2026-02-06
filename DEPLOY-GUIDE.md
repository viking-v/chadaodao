# 🚀 ChaDao Git远程部署指南

## 📋 部署方式概览

### 方式1: Git + SSH自动部署 (推荐)
### 方式2: GitHub Actions自动部署
### 方式3: 手动Git部署

---

## 🔧 方式1: Git + SSH自动部署

### 📋 前置要求
1. **宝塔面板已安装**
2. **SSH密钥已配置**
3. **Git仓库已创建**
4. **PM2已安装**

### 🛠️ 部署步骤

#### 1. 创建Git仓库
```bash
# 在GitHub/GitLab创建仓库
git remote add origin https://github.com/your-username/chadao.git
```

#### 2. 配置SSH免密登录
```bash
# 在本地生成SSH密钥
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 复制公钥到服务器
ssh-copy-id ~/.ssh/id_rsa.pub root@your-server.com

# 测试SSH连接
ssh root@your-server.com
```

#### 3. 使用自动部署脚本
```bash
# 赋予执行权限
chmod +x deploy/git-deploy.sh

# 执行部署
./deploy/git-deploy.sh your-server.com root /www/wwwroot/chadao https://github.com/your-username/chadao.git main
```

### 📝 脚本参数说明
```bash
./deploy/git-deploy.sh [服务器地址] [用户名] [项目路径] [仓库地址] [分支名]

# 示例
./deploy/git-deploy.sh server.com root /www/wwwroot/chadao https://github.com/user/chadao.git main
```

---

## 🤖 方式2: GitHub Actions自动部署

### 📋 配置步骤

#### 1. 创建GitHub Secrets
在GitHub仓库设置中添加以下Secrets：
- `HOST`: 服务器IP或域名
- `USERNAME`: 服务器用户名
- `SSH_KEY`: SSH私钥内容

#### 2. 启用Actions
```bash
# 复制Actions配置文件
cp deploy/github-actions.yml .github/workflows/deploy.yml

# 提交到仓库
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment"
git push origin main
```

#### 3. 监控部署
访问GitHub仓库的Actions标签页查看部署状态

---

## 🔨 方式3: 手动Git部署

### 📋 服务器端配置

#### 1. 安装Git
```bash
# 在宝塔面板中安装Git
# 或手动安装
yum install git -y  # CentOS
apt install git -y   # Ubuntu
```

#### 2. 克隆项目
```bash
# 进入项目目录
cd /www/wwwroot

# 克隆仓库
git clone https://github.com/your-username/chadao.git

# 进入项目目录
cd chadao
```

#### 3. 配置环境
```bash
# 复制环境配置
cp .env.production .env.local

# 编辑配置文件
nano .env.local
```

#### 4. 构建和启动
```bash
# 安装依赖
npm install -g pnpm
pnpm install --production

# 构建项目
pnpm build

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 🔑 环境配置

### 📝 .env.production配置
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

### 🗄️ 数据库配置
1. **创建Supabase项目**
2. **运行SQL脚本**: `supabase/schema.sql`
3. **配置RLS策略**
4. **设置认证规则**

---

## 🛠️ 宝塔面板配置

### 🌐 Nginx配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL证书
    ssl_certificate /www/server/panel/vhost/cert/your-domain.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/your-domain.com/privkey.pem;
    
    # 反向代理
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
    }
}
```

### 🔧 PM2配置
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

---

## 📊 部署验证

### ✅ 检查清单
- [ ] 网站可正常访问
- [ ] HTTPS证书有效
- [ ] 用户可注册登录
- [ ] 邀请码功能正常
- [ ] Dashboard显示正常
- [ ] 管理后台可访问
- [ ] PM2进程稳定运行
- [ ] Nginx日志无错误

### 🔍 测试步骤
1. **访问主页**: https://your-domain.com
2. **用户注册**: 测试邀请码验证
3. **用户登录**: 使用测试账户登录
4. **Dashboard**: 查看用户数据
5. **管理后台**: 测试管理功能

---

## 🚨 故障排除

### 常见问题

#### 1. Git连接失败
```bash
# 检查SSH密钥
ssh -T git@github.com

# 检查网络连接
ping github.com
```

#### 2. 构建失败
```bash
# 检查Node.js版本
node --version

# 清理缓存
rm -rf .next node_modules
pnpm install
pnpm build
```

#### 3. 应用启动失败
```bash
# 检查PM2状态
pm2 status

# 查看错误日志
pm2 logs chadao --lines 50

# 重启应用
pm2 restart chadao
```

#### 4. Nginx配置错误
```bash
# 测试Nginx配置
nginx -t

# 重载配置
nginx -s reload

# 查看错误日志
tail -f /var/log/nginx/error.log
```

---

## 📞 技术支持

### 📚 相关文档
- [Git部署指南](https://git-scm.com/book)
- [PM2文档](https://pm2.keymetrics.io/docs/)
- [宝塔面板文档](https://www.bt.cn/bbs/)
- [Nginx配置](https://nginx.org/en/docs/)

### 🆘 获取帮助
1. 查看部署日志
2. 检查服务器状态
3. 验证网络连接
4. 测试应用功能

---

## 🎉 部署完成！

**选择适合的部署方式，按照指南操作即可完成ChaDao平台的远程部署！**

### 🚀 推荐流程
1. **使用方式1**: Git + SSH自动部署
2. **配置环境变量**: 更新生产配置
3. **测试功能**: 验证所有功能正常
4. **监控运行**: 设置告警和监控

**部署成功后，用户即可访问您的ChaDao创业投资平台！** 🎯
