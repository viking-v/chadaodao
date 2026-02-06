# 🚀 ChaDao 快速部署指南

## 📋 部署前检查

### ✅ 当前状态
- 项目代码完整 ✓
- 构建成功 ✓  
- 所有依赖已安装 ✓
- 部署文件已准备 ✓

## 🎯 选择部署方式

### 方式1: 本地测试部署 (推荐先测试)
```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量
cp .env.example .env.local

# 3. 构建项目
pnpm build

# 4. 启动项目
pnpm start

# 5. 访问 http://localhost:3000
```

### 方式2: 宝塔面板部署 (生产环境)
```bash
# 1. 上传项目到服务器
# 2. 在宝塔面板中执行以下命令

cd /www/wwwroot/chadao
npm install -g pnpm
pnpm install --production
cp .env.production .env.local
# 编辑 .env.local 填入实际配置
pnpm build
pm2 start ecosystem.config.js
pm2 save
```

### 方式3: Docker部署
```bash
# 1. 构建镜像
docker build -t chadao .

# 2. 启动容器
docker-compose -f deploy/docker-compose.yml up -d
```

## 🔧 环境变量配置

### 开发环境 (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ChaDao
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
ADMIN_EMAIL=admin@chadao.com
```

### 生产环境 (.env.production)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=ChaDao
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
ADMIN_EMAIL=admin@chadao.com
NODE_ENV=production
```

## 🚀 一键部署脚本

### 本地部署
```bash
# 运行本地部署脚本
chmod +x deploy/local-deploy.sh
./deploy/local-deploy.sh
```

### 服务器部署
```bash
# 运行服务器部署脚本
chmod +x deploy/deploy.sh
./deploy/deploy.sh production
```

## 📊 部署验证

### 检查清单
- [ ] 应用启动成功
- [ ] 端口3000可访问
- [ ] 登录功能正常
- [ ] Dashboard显示正常
- [ ] 管理后台可访问

### 测试账户
- 邮箱: test@chadao.com
- 密码: password123

## 🛠️ 故障排除

### 常见问题
1. **端口被占用**: `lsof -ti:3000 | xargs kill -9`
2. **依赖安装失败**: `rm -rf node_modules && pnpm install`
3. **构建失败**: 检查Node.js版本 >= 18.x
4. **环境变量错误**: 检查.env.local文件

## 📞 获取帮助

### 查看详细文档
- `DEPLOYMENT.md` - 完整部署指南
- `deploy/baota-deploy.md` - 宝塔面板详细步骤

### 联系支持
- 查看项目README.md
- 检查控制台日志
- 验证环境配置

---

**选择适合的部署方式，按照步骤操作即可！**
