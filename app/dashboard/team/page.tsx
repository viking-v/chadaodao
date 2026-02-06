import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function TeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Get direct referrals (level 1)
  const { data: directTeam } = await supabase
    .from("members")
    .select("id, email, display_name, status, created_at, direct_referrals")
    .eq("invited_by", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">我的团队</h1>
        <p className="text-sm text-muted-foreground">
          管理您的直推成员和团队结构
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">直推成员</p>
          <p className="mt-1 text-2xl font-bold text-card-foreground">
            {directTeam?.length || 0}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">已激活</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {directTeam?.filter((m) => m.status === "active").length || 0}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">待激活</p>
          <p className="mt-1 text-2xl font-bold text-secondary">
            {directTeam?.filter((m) => m.status === "pending").length || 0}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            直推成员列表
          </h3>
        </div>
        {!directTeam || directTeam.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-muted-foreground/50"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            <p className="text-sm text-muted-foreground">暂无团队成员</p>
            <p className="mt-1 text-xs text-muted-foreground">
              分享邀请码邀请好友加入
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {directTeam.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {(member.display_name || member.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {member.display_name || member.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    下线 {member.direct_referrals || 0} 人
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      member.status === "active"
                        ? "bg-primary/10 text-primary"
                        : member.status === "frozen"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-accent/20 text-accent-foreground"
                    }`}
                  >
                    {member.status === "active"
                      ? "已激活"
                      : member.status === "frozen"
                        ? "已冻结"
                        : "待激活"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
