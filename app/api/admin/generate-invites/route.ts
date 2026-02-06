import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/supabase/database'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    // 检查是否为管理员
    if (user.email !== 'admin@chadao.com') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { userId, count } = await request.json()

    if (!userId || !count || count < 1 || count > 20) {
      return NextResponse.json(
        { error: '参数无效' },
        { status: 400 }
      )
    }

    // 生成邀请码
    const inviteCodes = await db.generateInviteCodes(userId, count)

    return NextResponse.json({
      success: true,
      message: `成功生成 ${count} 个邀请码`,
      codes: inviteCodes
    })
  } catch (error) {
    console.error('生成邀请码错误:', error)
    return NextResponse.json(
      { error: '生成失败' },
      { status: 500 }
    )
  }
}
