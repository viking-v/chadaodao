#!/usr/bin/env tsx

import { createClient } from '../lib/supabase/client'
import { db } from '../lib/supabase/database'

async function createTestUser() {
  try {
    console.log('🚀 开始创建测试用户...')
    
    // 创建测试用户
    const testUser = await db.createUser({
      id: 'test-user-id',
      email: 'test@chadao.com',
      full_name: '测试用户',
      is_active: false,
      is_verified: true,
      activation_amount: 0,
      total_earned: 0
    })
    
    console.log('✅ 测试用户创建成功:', testUser.email)
    
    // 为测试用户生成邀请码
    const inviteCodes = await db.generateInviteCodes('test-user-id', 5)
    console.log('✅ 邀请码生成成功:')
    inviteCodes.forEach((code, index) => {
      console.log(`   ${index + 1}. ${code.code}`)
    })
    
    console.log('\n🎉 测试用户创建完成!')
    console.log('📋 测试用户信息:')
    console.log('   邮箱: test@chadao.com')
    console.log('   密码: password123')
    console.log('   邀请码数量: 5个')
    
  } catch (error) {
    console.error('❌ 创建测试用户失败:', error)
    process.exit(1)
  }
}

// 运行脚本
createTestUser()
