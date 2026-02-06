import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase/database'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // 检查用户是否已在数据库中
      let user = await db.getUserByEmail(data.user.email!)
      
      if (!user) {
        // 创建新用户记录
        const metadata = data.user.user_metadata
        const inviteCode = metadata?.invite_code
        
        user = await db.createUser({
          id: data.user.id,
          email: data.user.email!,
          full_name: metadata?.display_name || '',
          is_active: false, // 需要激活
          is_verified: true,
          activation_amount: 0,
          total_earned: 0
        })

        console.log('✅ 新用户创建成功:', user?.email)

        // 如果有邀请码，处理团队关系
        if (inviteCode && user) {
          try {
            const inviteData = await db.getInviteCode(inviteCode)
            if (inviteData) {
              // 使用邀请码
              await db.useInviteCode(inviteCode, user.id)
              
              // 创建团队关系
              await db.createTeamRelation(inviteData.user_id, user.id, 1)
              
              console.log('✅ 团队关系创建成功')
            }
          } catch (error) {
            console.error('处理邀请码错误:', error)
          }
        }

        // 为新用户生成邀请码
        if (user) {
          await db.generateInviteCodes(user.id, 5)
          console.log('✅ 邀请码生成成功')
        }
      }
    }

    const forwardedHost = request.headers.get("x-forwarded-host")
    const isLocalEnv = process.env.NODE_ENV === "development"
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`)
    }
    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
