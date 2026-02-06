#!/usr/bin/env tsx

import { createClient } from '../lib/supabase/client'
import { db } from '../lib/supabase/database'

async function generateFirstInvite() {
  try {
    console.log('🚀 开始生成首个邀请码...')
    
    // 创建首个管理员用户
    const adminUser = await db.createUser({
      id: 'admin-user-id',
      email: 'admin@chadao.com',
      full_name: 'ChaDao Admin',
      is_active: true,
      is_verified: true,
      activation_amount: 0,
      total_earned: 0
    })
    
    console.log('✅ 管理员用户创建成功:', adminUser.email)
    
    // 为管理员生成邀请码
    const inviteCodes = await db.generateInviteCodes('admin-user-id', 10)
    console.log('✅ 邀请码生成成功:')
    inviteCodes.forEach((code, index) => {
      console.log(`   ${index + 1}. ${code.code}`)
    })
    
    // 创建激活记录（模拟管理员已激活）
    await db.createTransaction({
      user_id: 'admin-user-id',
      type: 'activation',
      amount: 300,
      status: 'completed'
    })
    
    console.log('✅ 激活记录创建成功')
    console.log('\n🎉 首个邀请码生成完成!')
    console.log('📋 管理员信息:')
    console.log('   邮箱: admin@chadao.com')
    console.log('   密码: (请在Supabase中设置)')
    console.log('   邀请码数量: 10个')
    
  } catch (error) {
    console.error('❌ 生成邀请码失败:', error)
    process.exit(1)
  }
}

// 运行脚本
generateFirstInvite()
