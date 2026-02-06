import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { commissionService } from '@/lib/services/commission'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '用户未登录' },
        { status: 401 }
      )
    }

    const { amount } = await request.json()

    if (!amount || amount < 300) {
      return NextResponse.json(
        { error: '激活金额至少为 $300' },
        { status: 400 }
      )
    }

    // 处理激活佣金分配
    const result = await commissionService.processActivationCommission(user.id, amount)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '账户激活成功，佣金分配完成'
      })
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('激活账户错误:', error)
    return NextResponse.json(
      { error: '激活失败' },
      { status: 500 }
    )
  }
}
