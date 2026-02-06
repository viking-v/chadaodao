# 🚀 ChaDao 项目部署指南

## 📋 部署前检查清单

### ✅ 项目状态
- [x] 代码完整性检查通过
- [x] 核心功能正常
- [x] Mock模式可用
- [x] 登录系统正常
- [x] Dashboard可用
- [x] 管理后台完整

### ✅ 文件准备
- [x] 生产环境配置文件
- [x] Docker配置
- [x] Nginx配置
- [x] 自动部署脚本
- [x] 宝塔面板部署指南

## 🎯 部署方案

### 方案1: 宝塔面板部署 (推荐)

#### 📦 宝塔面板安装
```bash
# 安装宝塔面板
wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sudo bash install.sh

# 访问面板: http://服务器IP:8888
```

#### 🚀 部署步骤
1. **上传项目文件**到 `/www/wwwroot/chadao/`
2. **安装Node.js 18.x+** 在宝塔软件商店
3. **安装PM2** 进程管理器
4. **配置环境变量**:
   ```bash
   cd /www/wwwroot/chadao
   cp .env.production .env.local
   # 编辑 .env.local 填入实际配置
   ```
5. **安装依赖**:
   ```bash
   pnpm install --production
   ```
6. **构建项目**:
   ```bash
   pnpm build
   ```
7. **配置PM2**:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```
8. **配置Nginx反向代理**

详细指南: [宝塔面板部署指南](deploy/baota-deploy.md)

### 方案2: Docker部署

#### 🐳 快速部署
```bash
# 构建镜像
docker build -t chadao .

# 运行容器
docker-compose -f deploy/docker-compose.yml up -d
```

### 方案3: 传统服务器部署

#### 📋 手动部署
```bash
# 1. 克隆项目
git clone <repository-url>
cd chadao

# 2. 安装依赖
npm install -g pnpm
pnpm install --production

# 3. 配置环境
cp .env.production .env.local
# 编辑配置文件

# 4. 构建项目
pnpm build

# 5. 启动服务
pm2 start ecosystem.config.js
```

## ⚙️ 环境配置

### 🔑 必需环境变量
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

### 🗄️ 数据库设置
1. **创建Supabase项目**
2. **运行SQL脚本**: `supabase/schema.sql`
3. **配置Row Level Security**
4. **设置认证规则**

## 🔒 安全配置

### 🛡️ SSL证书
- 使用Let's Encrypt免费证书
- 强制HTTPS重定向
- 配置HSTS头

### 🔥 防火墙设置
```bash
# 开放必要端口
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### 📊 监控设置
- **应用监控**: PM2监控
- **服务器监控**: 宝塔监控
- **日志监控**: Nginx访问日志
- **性能监控**: CPU、内存、磁盘

## 🚨 故障排除

### 常见问题及解决方案

#### 1. 应用无法启动
```bash
# 检查Node.js版本
node --version

# 检查端口占用
netstat -tlnp | grep :3000

# 查看PM2日志
pm2 logs chadao --lines 50
```

#### 2. 数据库连接失败
- 检查Supabase配置
- 验证网络连接
- 检查API密钥

#### 3. 页面404错误
- 检查Nginx配置
- 验证文件权限
- 检查路由配置

#### 4. 静态资源加载失败
- 检查构建输出
- 验证CDN配置
- 清除浏览器缓存

## 📈 性能优化

### ⚡ 前端优化
- 启用Gzip压缩
- 配置浏览器缓存
- 使用CDN加速
- 优化图片资源

### 🗄️ 数据库优化
- 使用连接池
- 添加适当索引
- 定期清理日志
- 配置备份策略

## 🔄 CI/CD部署

### GitHub Actions配置
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: pnpm install --production
      - run: pnpm build
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /www/wwwroot/chadao
            pm2 restart chadao
```

## 📞 技术支持

### 📧 调试工具
- **浏览器开发者工具**
- **PM2监控面板**: `pm2 monit`
- **Nginx状态**: `nginx -t`
- **系统日志**: `journalctl -u nginx`

### 📚 文档资源
- [Next.js部署文档](https://nextjs.org/docs/deployment)
- [PM2文档](https://pm2.keymetrics.io/docs/)
- [Nginx配置指南](https://nginx.org/en/docs/)

## 🎯 部署后验证

### ✅ 功能测试清单
- [ ] 主页正常加载
- [ ] 用户注册功能
- [ ] 用户登录功能
- [ ] 邀请码验证
- [ ] Dashboard显示
- [ ] 管理后台访问
- [ ] 响应式设计
- [ ] SSL证书有效
- [ ] 性能指标正常

### 🔍 监控指标
- **响应时间**: < 2秒
- **可用性**: > 99.9%
- **错误率**: < 0.1%
- **CPU使用率**: < 80%
- **内存使用率**: < 85%

## 📋 维护计划

### 🗓️ 定期维护
- **每日**: 检查应用状态
- **每周**: 清理日志文件
- **每月**: 更新依赖包
- **每季度**: 安全审计

### 🔄 备份策略
- **数据库**: 每日自动备份
- **文件**: 每周完整备份
- **配置**: 版本控制管理
- **恢复**: 定期测试恢复

---

## 🎉 部署完成

项目已完全准备好生产环境部署！选择适合的部署方案，按照指南操作即可。

**推荐**: 使用宝塔面板部署，操作简单，管理方便。

**快速**: 使用Docker部署，一键启动，环境隔离。

**灵活**: 使用传统部署，完全控制，自定义配置。

部署完成后访问: https://your-domain.com
