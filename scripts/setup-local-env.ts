#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

console.log('🔧 配置本地环境变量...')

// 检查.env.local是否存在
const envPath = path.join(__dirname, '..', '.env.local')

if (!fs.existsSync(envPath)) {
  console.log('📝 创建.env.local文件...')
  
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key'}

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ChaDao

# USDT Configuration
USDT_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

# Admin Configuration
ADMIN_EMAIL=admin@chadao.com
`

  fs.writeFileSync(envPath, envContent)
  console.log('✅ .env.local文件创建成功')
} else {
  console.log('✅ .env.local文件已存在')
}

// 显示当前配置
const currentEnv = fs.readFileSync(envPath, 'utf8')
console.log('\n📋 当前环境变量配置:')
console.log('================================')
console.log(currentEnv)
console.log('================================')

// 检查Supabase配置
const supabaseUrl = currentEnv.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]
const supabaseKey = currentEnv.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]

if (!supabaseUrl || supabaseUrl.includes('your-project')) {
  console.log('⚠️ 请在.env.local中配置正确的Supabase URL')
  console.log('   格式: https://your-project.supabase.co')
}

if (!supabaseKey || supabaseKey.includes('your_supabase_anon_key')) {
  console.log('⚠️ 请在.env.local中配置正确的Supabase匿名密钥')
}

console.log('\n🚀 配置完成后，运行以下命令启动应用:')
console.log('   pnpm build')
console.log('   pnpm start')
