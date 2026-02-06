import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { InviteCodeCard } from "@/components/dashboard/invite-code-card"
import { RecentCommissions } from "@/components/dashboard/recent-commissions"
import { db } from "@/lib/supabase/database"
import { commissionService } from "@/lib/services/commission"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log('❌ Dashboard: 未找到用户，重定向到登录页')
    redirect("/auth/login")
  }

  console.log('✅ Dashboard: 用户已登录', { id: user.id, email: user.email })

  // 获取用户信息
  let userData = await db.getUserById(user.id)
  
  // 如果在Mock模式下找不到用户，创建一个默认用户
  if (!userData && process.env.NODE_ENV === 'development') {
    console.log('🔧 Dashboard: Mock模式下创建默认用户')
    userData = {
      id: user.id,
      email: user.email!,
      full_name: '测试用户',
      is_active: false,
      is_verified: true,
      activation_amount: 0,
      total_earned: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
  
  if (!userData) {
    console.log('❌ Dashboard: 用户数据不存在，重定向到登录页')
    redirect("/auth/login")
  }

  console.log('✅ Dashboard: 用户数据获取成功', userData.email)

  // 获取团队统计
  const teamStats = await commissionService.getUserTeamStats(user.id)
  
  // 获取佣金统计
  const commissionStats = await commissionService.getUserCommissionStats(user.id)

  // 获取邀请码
  const inviteCodes = await db.getUserInviteCodes(user.id)
  const unusedCodes = inviteCodes.filter(code => !code.is_used)

  // 获取最近佣金
  const recentCommissions = await db.getUserCommissions(user.id).then(commissions => 
    commissions.slice(0, 5)
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          欢迎回来，{userData.full_name || userData.email.split("@")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          {userData.is_active ? "您的账户已激活" : "请入金 $300 USDT 以激活账户"}
        </p>
      </div>

      <OverviewCards
        walletBalance={userData.total_earned}
        totalEarned={userData.total_earned}
        directReferrals={teamStats.directReferrals}
        status={userData.is_active ? "active" : "inactive"}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <InviteCodeCard 
          inviteCodes={unusedCodes} 
          maxInvites={5} 
          usedInvites={teamStats.directReferrals} 
        />
        <RecentCommissions commissions={recentCommissions} />
      </div>
    </div>
  )
}
