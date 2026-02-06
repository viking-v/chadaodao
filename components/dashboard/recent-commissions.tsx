import { Commission } from "@/lib/supabase/database"

interface ExtendedCommission extends Commission {
  from_member?: {
    display_name: string | null
    email: string
  } | null
}

export function RecentCommissions({
  commissions,
}: {
  commissions: Commission[]
}) {
  if (commissions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">
          最近佣金
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-muted-foreground/50"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          <p className="text-sm text-muted-foreground">暂无佣金记录</p>
          <p className="mt-1 text-xs text-muted-foreground">
            邀请朋友加入后即可获取佣金
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">
        最近佣金
      </h3>
      <div className="space-y-3">
        {commissions.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
          >
            <div>
              <p className="text-sm font-medium text-card-foreground">
                {(c as any).from_member?.display_name ||
                  (c as any).from_member?.email?.split("@")[0] ||
                  `用户${c.source_user_id?.slice(0, 8)}`}
              </p>
              <p className="text-xs text-muted-foreground">
                第{c.level}级 &middot; {c.percentage}% &middot;{" "}
                {new Date(c.created_at).toLocaleDateString("zh-CN")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">
                +${Number(c.amount).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {c.status === "paid"
                  ? "已发放"
                  : c.status === "approved"
                    ? "已批准"
                    : "待发放"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
