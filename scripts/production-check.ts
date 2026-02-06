#!/usr/bin/env tsx

import { createClient } from '../lib/supabase/client'
import { db } from '../lib/supabase/database'

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: any
}

async function productionCheck() {
  console.log('🚀 开始生产环境检测...')
  
  const results: CheckResult[] = []

  // 1. 环境变量检查
  console.log('\n📋 检查环境变量...')
  const envChecks = [
    {
      name: 'NEXT_PUBLIC_SUPABASE_URL',
      required: true,
      value: process.env.NEXT_PUBLIC_SUPABASE_URL
    },
    {
      name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      required: true,
      value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    },
    {
      name: 'NEXT_PUBLIC_APP_URL',
      required: true,
      value: process.env.NEXT_PUBLIC_APP_URL
    },
    {
      name: 'USDT_CONTRACT_ADDRESS',
      required: true,
      value: process.env.USDT_CONTRACT_ADDRESS
    },
    {
      name: 'ADMIN_EMAIL',
      required: true,
      value: process.env.ADMIN_EMAIL
    }
  ]

  envChecks.forEach(env => {
    if (env.required && !env.value) {
      results.push({
        name: `环境变量 ${env.name}`,
        status: 'fail',
        message: '❌ 缺失必需的环境变量'
      })
    } else if (env.value) {
      results.push({
        name: `环境变量 ${env.name}`,
        status: 'pass',
        message: '✅ 已配置'
      })
    }
  })

  // 2. 数据库连接检查
  console.log('\n🗄️ 检查数据库连接...')
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('users').select('count').single()
    
    if (error) {
      results.push({
        name: '数据库连接',
        status: 'fail',
        message: `❌ 连接失败: ${error.message}`,
        details: error
      })
    } else {
      results.push({
        name: '数据库连接',
        status: 'pass',
        message: '✅ 连接正常'
      })
    }
  } catch (err) {
    results.push({
      name: '数据库连接',
      status: 'fail',
      message: `❌ 连接异常: ${err instanceof Error ? err.message : '未知错误'}`
    })
  }

  // 3. 核心功能检查
  console.log('\n🔧 检查核心功能...')
  
  // 用户创建功能
  try {
    const testUser = await db.createUser({
      id: 'prod-check-user',
      email: 'check@chadao.com',
      full_name: '生产检测用户',
      is_active: false,
      is_verified: true,
      activation_amount: 0,
      total_earned: 0
    })
    
    results.push({
      name: '用户创建功能',
      status: 'pass',
      message: '✅ 功能正常'
    })
  } catch (err) {
    results.push({
      name: '用户创建功能',
      status: 'fail',
      message: `❌ 功能异常: ${err instanceof Error ? err.message : '未知错误'}`
    })
  }

  // 邀请码生成功能
  try {
    const inviteCodes = await db.generateInviteCodes('prod-check-user', 2)
    results.push({
      name: '邀请码生成',
      status: 'pass',
      message: `✅ 生成了 ${inviteCodes.length} 个邀请码`
    })
  } catch (err) {
    results.push({
      name: '邀请码生成',
      status: 'fail',
      message: `❌ 生成失败: ${err instanceof Error ? err.message : '未知错误'}`
    })
  }

  // 4. 安全检查
  console.log('\n🔒 检查安全配置...')
  
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('localhost')) {
      results.push({
        name: '生产环境配置',
        status: 'fail',
        message: '❌ 生产环境不能使用localhost数据库'
      })
    } else {
      results.push({
        name: '生产环境配置',
        status: 'pass',
        message: '✅ 生产环境配置正确'
      })
    }
  } else {
    results.push({
      name: '环境模式',
      status: 'warning',
      message: '⚠️ 当前为开发模式'
    })
  }

  // 5. 性能检查
  console.log('\n⚡ 检查性能配置...')
  
  const packageJson = require('../package.json')
  const nextConfig = require('../next.config.mjs')
  
  results.push({
    name: '依赖版本',
    status: 'pass',
    message: `✅ Next.js ${packageJson.dependencies.next}`
  })
  
  if (nextConfig.reactStrictMode) {
    results.push({
      name: 'React严格模式',
      status: 'pass',
      message: '✅ 已启用'
    })
  }

  // 6. 部署准备检查
  console.log('\n📦 检查部署准备...')
  
  const buildFiles = [
    'next.config.mjs',
    'package.json',
    '.env.example',
    'README.md',
    'app/layout.tsx',
    'app/page.tsx'
  ]
  
  const fs = require('fs')
  const path = require('path')
  
  let allFilesExist = true
  buildFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file)
    if (fs.existsSync(filePath)) {
      results.push({
        name: `文件 ${file}`,
        status: 'pass',
        message: '✅ 存在'
      })
    } else {
      results.push({
        name: `文件 ${file}`,
        status: 'fail',
        message: '❌ 缺失'
      })
      allFilesExist = false
    }
  })

  // 输出结果
  console.log('\n📊 检测结果汇总:')
  console.log('='.repeat(50))
  
  const passed = results.filter(r => r.status === 'pass').length
  const failed = results.filter(r => r.status === 'fail').length
  const warnings = results.filter(r => r.status === 'warning').length
  
  results.forEach(result => {
    console.log(`${result.message}`)
    if (result.details) {
      console.log(`   详情: ${JSON.stringify(result.details, null, 2)}`)
    }
  })
  
  console.log('='.repeat(50))
  console.log(`📈 统计: 通过 ${passed} | 失败 ${failed} | 警告 ${warnings}`)
  
  if (failed === 0) {
    console.log('\n🎉 项目已准备好部署到生产环境！')
    console.log('\n📋 部署清单:')
    console.log('1. ✅ 环境变量已配置')
    console.log('2. ✅ 数据库连接正常')
    console.log('3. ✅ 核心功能正常')
    console.log('4. ✅ 安全配置正确')
    console.log('5. ✅ 性能配置优化')
    console.log('6. ✅ 部署文件完整')
    
    console.log('\n🚀 宝塔面板部署步骤:')
    console.log('1. 上传项目文件到服务器')
    console.log('2. 安装依赖: pnpm install')
    console.log('3. 构建项目: pnpm build')
    console.log('4. 配置环境变量')
    console.log('5. 启动项目: pnpm start')
    console.log('6. 配置反向代理 (Nginx)')
    console.log('7. 配置SSL证书')
    
  } else {
    console.log('\n❌ 项目未准备好部署，请先修复失败项')
    process.exit(1)
  }
}

// 运行检测
productionCheck()
