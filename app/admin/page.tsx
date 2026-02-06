import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/supabase/database"
import { commissionService } from "@/lib/services/commission"

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  // 获取平台统计数据
  const [
    { count: totalUsers },
    { count: activeUsers },
    { count: pendingCommissions },
    { data: fundPools },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("commissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("fund_pools").select("*"),
  ])

  // 获取邀请码统计
  const { count: totalInviteCodes } = await supabase
    .from("invite_codes")
    .select("*", { count: "exact", head: true })
  
  const { count: usedInviteCodes } = await supabase
    .from("invite_codes")
    .select("*", { count: "exact", head: true })
    .eq("is_used", true)

  const totalFundBalance = (fundPools || []).reduce(
    (sum: number, p: { total_amount: number }) => sum + Number(p.total_amount),
    0
  )

  const stats = [
    { label: "总用户数", value: totalUsers ?? 0, color: "text-primary" },
    { label: "活跃用户", value: activeUsers ?? 0, color: "text-chart-4" },
    { label: "待付佣金", value: pendingCommissions ?? 0, color: "text-secondary" },
    {
      label: "资金池总额",
      value: `$${totalFundBalance.toLocaleString()}`,
      color: "text-accent",
    },
  ]

  const inviteStats = [
    { label: "总邀请码", value: totalInviteCodes ?? 0, color: "text-primary" },
    { label: "已使用", value: usedInviteCodes ?? 0, color: "text-chart-4" },
    { label: "可用邀请码", value: (totalInviteCodes ?? 0) - (usedInviteCodes ?? 0), color: "text-secondary" },
    {
      label: "使用率",
      value: `${totalInviteCodes ? Math.round((usedInviteCodes! / totalInviteCodes!) * 100) : 0}%`,
      color: "text-accent",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ChaDao 管理后台</h1>
        <p className="text-sm text-muted-foreground">平台运营数据概览与管理</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">邀请码统计</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {inviteStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">资金池详情</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(fundPools || []).map(
            (pool: {
              id: string
              name: string
              percentage: number
              total_amount: number
            }) => (
              <Card key={pool.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span className="text-card-foreground">{pool.name}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {pool.percentage}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-card-foreground">
                    ${Number(pool.total_amount).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a 
              href="/admin/users" 
              className="block rounded-lg border border-border p-3 hover:bg-muted transition-colors"
            >
              <div className="font-medium">用户管理</div>
              <div className="text-sm text-muted-foreground">查看和管理平台用户</div>
            </a>
            <a 
              href="/admin/deposits" 
              className="block rounded-lg border border-border p-3 hover:bg-muted transition-colors"
            >
              <div className="font-medium">入金审核</div>
              <div className="text-sm text-muted-foreground">审核用户激活申请</div>
            </a>
            <a 
              href="/admin/commissions" 
              className="block rounded-lg border border-border p-3 hover:bg-muted transition-colors"
            >
              <div className="font-medium">佣金管理</div>
              <div className="text-sm text-muted-foreground">处理佣金发放</div>
            </a>
            <a 
              href="/admin/invites" 
              className="block rounded-lg border border-border p-3 hover:bg-muted transition-colors"
            >
              <div className="font-medium">邀请码管理</div>
              <div className="text-sm text-muted-foreground">生成和管理邀请码</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>系统信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">平台版本</span>
              <span className="font-medium">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">分润模式</span>
              <span className="font-medium">七级级差</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">激活金额</span>
              <span className="font-medium">$300 USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">结算方式</span>
              <span className="font-medium">USDT (TRC-20)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">运行状态</span>
              <span className="font-medium text-green-600">正常</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
