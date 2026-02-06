#!/usr/bin/env tsx

import { createClient } from '../lib/supabase/client'
import { db } from '../lib/supabase/database'

async function setupAuth() {
  try {
    console.log('🚀 开始设置认证系统...')
    
    // 创建管理员用户
    const adminUser = await db.createUser({
      id: 'admin-user-id',
      email: 'admin@chadao.com',
      full_name: '系统管理员',
      is_active: true,
      is_verified: true,
      activation_amount: 0,
      total_earned: 0
    })
    
    console.log('✅ 管理员用户创建成功:', adminUser.email)
    
    // 为管理员生成邀请码
    const adminInviteCodes = await db.generateInviteCodes('admin-user-id', 10)
    console.log('✅ 管理员邀请码生成成功:')
    adminInviteCodes.forEach((code, index) => {
      console.log(`   ${index + 1}. ${code.code}`)
    })
    
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
    const testInviteCodes = await db.generateInviteCodes('test-user-id', 5)
    console.log('✅ 测试用户邀请码生成成功:')
    testInviteCodes.forEach((code, index) => {
      console.log(`   ${index + 1}. ${code.code}`)
    })
    
    console.log('\n🎉 认证系统设置完成!')
    console.log('📋 账户信息:')
    console.log('   管理员: admin@chadao.com')
    console.log('   测试用户: test@chadao.com')
    console.log('   密码: password123')
    console.log('\n🔑 可用邀请码:')
    console.log('   管理员邀请码: DEMO1234, DEMO5678')
    console.log('   测试用户邀请码: TEST1111, TEST2222')
    
  } catch (error) {
    console.error('❌ 设置失败:', error)
    process.exit(1)
  }
}

// 运行脚本
setupAuth()
