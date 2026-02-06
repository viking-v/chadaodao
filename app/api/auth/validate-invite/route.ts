import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase/database'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "邀请码不能为空" }, { status: 400 })
    }

    const inviteCode = await db.getInviteCode(code.toUpperCase())

    if (!inviteCode) {
      return NextResponse.json({ error: "邀请码无效或已被使用" }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      inviter_id: inviteCode.user_id,
    })
  } catch (error) {
    console.error('验证邀请码错误:', error)
    return NextResponse.json({ error: "验证失败" }, { status: 500 })
  }
}
