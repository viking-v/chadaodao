import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function CommissionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: commissions } = await supabase
    .from("commissions")
    .select(
      "*, from_member:members!commissions_from_member_id_fkey(display_name, email)"
    )
    .eq("member_id", user.id)
    .order("created_at", { ascending: false })

  const totalPending =
    commissions
      ?.filter((c) => c.status === "pending")
      .reduce((sum, c) => sum + Number(c.amount), 0) || 0
  const totalPaid =
    commissions
      ?.filter((c) => c.status === "paid")
      .reduce((sum, c) => sum + Number(c.amount), 0) || 0

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">佣金记录</h1>
        <p className="text-sm text-muted-foreground">
          查看您所有层级的佣金收入明细
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">总佣金</p>
          <p className="mt-1 text-2xl font-bold text-card-foreground">
            ${(totalPending + totalPaid).toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">待发放</p>
          <p className="mt-1 text-2xl font-bold text-secondary">
            ${totalPending.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">已发放</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            ${totalPaid.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            佣金明细
          </h3>
        </div>
        {!commissions || commissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-muted-foreground/50"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            <p className="text-sm text-muted-foreground">暂无佣金记录</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground">
                    来源
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground">
                    层级
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground">
                    费率
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground">
                    金额
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground">
                    状态
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground">
                    日期
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {commissions.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-3 text-sm text-card-foreground">
                      {c.from_member?.display_name ||
                        c.from_member?.email?.split("@")[0] ||
                        "未知"}
                    </td>
                    <td className="px-6 py-3 text-sm text-card-foreground">
                      第{c.level}级
                    </td>
                    <td className="px-6 py-3 text-sm text-card-foreground">
                      {c.rate}%
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-primary">
                      ${Number(c.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.status === "paid"
                            ? "bg-primary/10 text-primary"
                            : c.status === "cancelled"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-accent/20 text-accent-foreground"
                        }`}
                      >
                        {c.status === "paid"
                          ? "已发放"
                          : c.status === "cancelled"
                            ? "已取消"
                            : "待发放"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("zh-CN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
