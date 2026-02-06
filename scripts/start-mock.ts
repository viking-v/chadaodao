#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

console.log('🚀 启动ChaDao Mock模式...')

// 创建Mock环境配置
const mockEnvPath = path.join(__dirname, '..', '.env.local')
const mockEnvContent = `# Mock模式配置 (无需Supabase)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ChaDao

# USDT Configuration
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

# Admin Configuration
ADMIN_EMAIL=admin@chadao.com
`

try {
  // 写入Mock配置
  fs.writeFileSync(mockEnvPath, mockEnvContent)
  console.log('✅ Mock环境配置已创建')

  // 清理旧的构建
  console.log('🧹 清理旧的构建文件...')
  try {
    execSync('rm -rf .next', { cwd: path.join(__dirname, '..') })
    console.log('✅ 旧构建文件已清理')
  } catch (err) {
    console.log('⚠️ 清理构建文件失败，继续...')
  }

  // 构建项目
  console.log('🔨 构建项目...')
  try {
    execSync('pnpm build', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    })
    console.log('✅ 项目构建成功')
  } catch (err) {
    console.error('❌ 项目构建失败')
    process.exit(1)
  }

  // 启动应用
  console.log('🚀 启动应用...')
  console.log('📱 访问地址: http://localhost:3000')
  console.log('🧪 测试账户: test@chadao.com / password123')
  console.log('🛑 按 Ctrl+C 停止应用')
  console.log('================================')

  // 启动开发服务器
  execSync('pnpm start', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  })

} catch (error) {
  console.error('❌ 启动失败:', error)
  process.exit(1)
}
