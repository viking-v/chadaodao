import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/supabase/database"

export default async function AdminInvitesPage() {
  const supabase = await createClient()

  // 获取所有邀请码
  const { data: inviteCodes } = await supabase
    .from("invite_codes")
    .select(`
      *,
      user:users(email, full_name),
      used_by_user:users(email, full_name)
    `)
    .order("created_at", { ascending: false })

  // 获取用户列表（用于生成邀请码）
  const { data: users } = await supabase
    .from("users")
    .select("id, email, full_name")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">邀请码管理</h1>
        <p className="text-sm text-muted-foreground">生成和管理平台邀请码</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>生成新邀请码</CardTitle>
          </CardHeader>
          <CardContent>
            <form action="/api/admin/generate-invites" method="POST" className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  选择用户
                </label>
                <select 
                  name="userId" 
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="">请选择用户</option>
                  {users?.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name || user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  生成数量
                </label>
                <input
                  type="number"
                  name="count"
                  min="1"
                  max="20"
                  defaultValue="5"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                生成邀请码
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>邀请码列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {inviteCodes && inviteCodes.length > 0 ? (
                inviteCodes.map((invite: any) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-1 text-sm font-mono">
                          {invite.code}
                        </code>
                        <Badge variant={invite.is_used ? "destructive" : "default"}>
                          {invite.is_used ? "已使用" : "可用"}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        持有者: {invite.user?.full_name || invite.user?.email}
                        {invite.is_used && (
                          <> • 使用者: {invite.used_by_user?.full_name || invite.used_by_user?.email}</>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        创建: {new Date(invite.created_at).toLocaleDateString("zh-CN")}
                        {invite.used_at && (
                          <> • 使用: {new Date(invite.used_at).toLocaleDateString("zh-CN")}</>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  暂无邀请码
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总邀请码
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {inviteCodes?.length || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              已使用
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-chart-4">
              {inviteCodes?.filter((c: any) => c.is_used).length || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              可用
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-secondary">
              {inviteCodes?.filter((c: any) => !c.is_used).length || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              使用率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">
              {inviteCodes?.length 
                ? Math.round((inviteCodes.filter((c: any) => c.is_used).length / inviteCodes.length) * 100)
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
