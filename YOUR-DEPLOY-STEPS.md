# 🚀 您的ChaDao部署操作步骤

## 📋 您的当前信息
- **服务器IP**: 45.77.171.220
- **项目路径**: /www/wwwroot/vo.gthmjjh.com
- **域名**: vo.gthmjjh.com

---

## 🎯 第一步：准备Git仓库

### 📋 1.1 创建GitHub仓库
1. **访问**: https://github.com
2. **登录**: 您的GitHub账户
3. **创建仓库**:
   - Repository name: `chadao`
   - Description: `ChaDao创业投资平台`
   - Visibility: `Public`
4. **点击**: Create repository

### 📋 1.2 连接远程仓库
```bash
# 在项目目录执行 (替换YOUR_USERNAME为您的GitHub用户名)
git remote set-url origin https://github.com/YOUR_USERNAME/chadao.git

# 验证连接
git remote -v

# 推送代码
git push -u origin main
```

---

## 🎯 第二步：准备服务器环境

### 📋 2.1 SSH连接服务器
```bash
# 连接到您的服务器
ssh root@45.77.171.220
```

### 📋 2.2 安装宝塔面板 (如果未安装)
```bash
# Ubuntu/Debian系统
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh

# CentOS系统
wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sudo bash install.sh
```

### 📋 2.3 安装必要工具
```bash
# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2
npm install -g pm2

# 安装Git (如果未安装)
sudo apt update
sudo apt install git -y

# 验证安装
node --version
npm --version
pm2 --version
git --version
```

---

## 🎯 第三步：配置宝塔面板

### 📋 3.1 登录宝塔面板
1. **访问**: `http://45.77.171.220:8888`
2. **输入**: 安装时提供的用户名和密码
3. **完成**: 绑定手机号或邮箱 (可选)

### 📋 3.2 安装运行环境
在宝塔面板中安装：
1. **软件商店** → **运行环境**
2. **搜索并安装**:
   - Nginx 1.20+
   - Node.js 18.x (如果未通过命令行安装)
   - PM2 Manager (可选)

### 📋 3.3 创建网站
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

### 📋 3.4 配置SSL证书
1. **网站** → **设置** → **SSL**
2. **选择**: Let's Encrypt
3. **填写域名**: vo.gthmjjh.com
4. **申请证书**
5. **开启**: 强制HTTPS

---

## 🎯 第四步：配置SSH免密登录

### 📋 4.1 本地生成SSH密钥
```bash
# 在本地电脑执行
ssh-keygen -t ed25519 -C "your-email@example.com"

# 启动SSH代理
eval "$(ssh-agent -s)"

# 添加私钥到代理
ssh-add ~/.ssh/id_ed25519

# 复制公钥
cat ~/.ssh/id_ed25519.pub
```

### 📋 4.2 服务器添加SSH密钥
```bash
# SSH连接服务器
ssh root@45.77.171.220

# 添加公钥到authorized_keys
echo "YOUR_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 测试SSH连接
ssh root@45.77.171.220
```

---

## 🎯 第五步：执行自动部署

### 📋 5.1 准备部署命令
根据您的信息，部署命令应该是：
```bash
./deploy/baota-git-deploy.sh 45.77.171.220 root /www/wwwroot/vo.gthmjjh.com https://github.com/YOUR_USERNAME/chadao.git main vo.gthmjjh.com
```

### 📋 5.2 执行部署
```bash
# 在项目目录执行
./deploy/baota-git-deploy.sh 45.77.171.220 root /www/wwwroot/vo.gthmjjh.com https://github.com/YOUR_USERNAME/chadao.git main vo.gthmjjh.com
```

### 📋 5.3 部署过程监控
脚本会自动执行以下操作：
- ✅ 推送代码到远程仓库
- ✅ 连接服务器
- ✅ 拉取最新代码
- ✅ 安装依赖
- ✅ 构建项目
- ✅ 配置环境变量
- ✅ 设置权限
- ✅ 启动PM2应用
- ✅ 重载Nginx

---

## 🎯 第六步：验证部署

### ✅ 验证清单
- [ ] 网站正常访问: https://vo.gthmjjh.com
- [ ] HTTPS证书有效
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] Dashboard显示正常
- [ ] 管理后台可访问: https://vo.gthmjjh.com/admin

### 🔍 验证命令
```bash
# SSH连接服务器
ssh root@45.77.171.220

# 检查PM2状态
pm2 status

# 查看应用日志
pm2 logs chadao

# 测试本地访问
curl http://127.0.0.1:3000
```

---

## 🚨 如果遇到问题

### ❌ SSH连接失败
```bash
# 检查SSH密钥
ssh -v root@45.77.171.220

# 重新添加密钥
ssh-copy-id ~/.ssh/id_ed25519.pub root@45.77.171.220
```

### ❌ Git推送失败
```bash
# 检查远程仓库地址
git remote -v

# 重新设置远程地址
git remote set-url origin https://github.com/YOUR_USERNAME/chadao.git
```

### ❌ 宝塔面板问题
1. 检查面板是否正常运行
2. 确认防火墙设置
3. 验证域名解析

---

## 🎯 现在开始操作

### 📋 立即执行的步骤
1. **创建GitHub仓库**: https://github.com/new
2. **连接远程仓库**: `git remote set-url origin ...`
3. **准备服务器环境**: SSH连接并安装工具
4. **配置宝塔面板**: 创建网站和SSL
5. **执行自动部署**: 运行部署脚本

### 📞 需要帮助？
- **详细指南**: `BAOTA-GIT-DEPLOY.md`
- **分步指南**: `BAOTA-DEPLOY-STEP-BY-STEP.md`
- **部署脚本**: `deploy/baota-git-deploy.sh`

---

## 🎉 部署完成后

### 🚀 访问地址
- **网站**: https://vo.gthmjjh.com
- **管理后台**: https://vo.gthmjjh.com/admin
- **宝塔面板**: http://45.77.171.220:8888

### 🔄 日常更新
```bash
# 修改代码后
git add .
git commit -m "更新描述"
./deploy/baota-git-deploy.sh 45.77.171.220 root /www/wwwroot/vo.gthmjjh.com https://github.com/YOUR_USERNAME/chadao.git main vo.gthmjjh.com
```

**现在您可以从第一步开始操作了！** 🎯
