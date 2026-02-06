# ChaDao 创业投资平台

## 📋 项目简介

ChaDao 是一个基于七级级差分润模式的创业投资平台，采用 USDT (TRC-20) 结算，助力创业者实现梦想。

### 🌟 核心特性

- **七级分润系统**: 20%-15%-12%-10%-8%-6%-5% 级差分润
- **USDT 结算**: 支持 TRC-20 网络的 USDT 充值和提现
- **邀请码体系**: 每位会员获得 5 个专属邀请码
- **透明资金池**: 创业资金池30%、慈善基金3%、分润池57%、平台留存10%
- **自动化对账**: 月度结算，次月初发放

### 🛠 技术栈

- **前端**: Next.js 16.1.6 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes + Supabase
- **数据库**: Supabase PostgreSQL
- **UI组件**: Radix UI + shadcn/ui
- **认证**: Supabase Auth

## 🚀 快速开始

### 1. 环境准备

```bash
# 安装依赖
pnpm install

# 复制环境变量文件
cp .env.example .env.local
```

### 2. 配置环境变量

编辑 `.env.local` 文件：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ChaDao

# USDT Configuration
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

# Admin Configuration
ADMIN_EMAIL=admin@chadao.com
```

### 3. 数据库设置

```bash
# 运行数据库脚本
# 在 Supabase Dashboard 中执行 supabase/schema.sql
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 查看应用

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── auth/              # 认证页面
│   ├── dashboard/         # 用户面板
│   ├── admin/             # 管理后台
│   └── api/               # API路由
├── components/            # React组件
│   ├── landing/           # 首页组件
│   ├── dashboard/         # 面板组件
│   ├── admin/             # 管理后台组件
│   └── ui/               # UI组件库
├── lib/                  # 工具库
│   ├── supabase/         # 数据库操作
│   └── services/         # 业务逻辑
├── scripts/              # 脚本文件
├── supabase/            # 数据库脚本
└── public/              # 静态资源
```

## 👤 用户角色

### 普通用户
- 注册账户（需要邀请码）
- 激活账户（$300 USDT）
- 邀请团队成员
- 查看佣金收益
- 提现申请

### 管理员
- 查看平台数据
- 审核激活申请
- 管理邀请码
- 处理佣金发放
- 用户管理

## 💰 分润模式

### 七级级差分润
- **一级**: 20%
- **二级**: 15%
- **三级**: 12%
- **四级**: 10%
- **五级**: 8%
- **六级**: 6%
- **七级**: 5%

### 资金池分配
- **创业资金池**: 30%
- **慈善基金**: 3%
- **分润池**: 57%
- **平台留存**: 10%

## 🎯 业务流程

1. **注册**: 使用邀请码注册账户
2. **激活**: 支付 $300 USDT 激活账户
3. **邀请**: 获得专属邀请码，邀请团队成员
4. **收益**: 团队成员激活后自动计算佣金
5. **结算**: 月度结算，次月初发放 USDT

## 🔧 开发指南

### Mock 模式

项目支持 Mock 模式，无需配置 Supabase 即可运行：

```typescript
// 自动检测 Mock 模式
const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo.supabase.co')
```

### API 端点

- `POST /api/auth/validate-invite` - 验证邀请码
- `POST /api/activation` - 处理账户激活
- `POST /api/admin/generate-invites` - 生成邀请码（管理员）

### 数据库表结构

- `users` - 用户信息
- `invite_codes` - 邀请码
- `team_relations` - 团队关系
- `commissions` - 佣金记录
- `transactions` - 交易记录
- `withdrawals` - 提现记录
- `fund_pools` - 资金池

## 🚀 部署

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 环境变量配置

在 Vercel Dashboard 中配置环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
ADMIN_EMAIL=admin@chadao.com
```

## 📞 联系支持

- 邮箱: support@chadao.com
- 文档: [项目文档](https://docs.chadao.com)

## 📄 许可证

本项目仅供学习和研究使用。

---

**注意**: 本项目仅作为技术演示，实际运营前请确保符合当地法律法规。
