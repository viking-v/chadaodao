import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function WalletPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: member } = await supabase
    .from("members")
    .select("wallet_balance, total_earned, usdt_address")
    .eq("id", user.id)
    .single()

  const { data: transactions } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("member_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">钱包</h1>
        <p className="text-sm text-muted-foreground">
          管理您的 USDT 钱包余额与交易记录
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <p className="text-sm text-primary">可用余额</p>
          <p className="mt-2 text-3xl font-bold text-primary">
            ${Number(member?.wallet_balance || 0).toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">USDT (TRC-20)</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">累计收入</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">
            ${Number(member?.total_earned || 0).toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">总佣金收入</p>
        </div>
      </div>

      {member?.usdt_address && (
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">USDT 提现地址 (TRC-20)</p>
          <p className="mt-1 break-all font-mono text-sm text-card-foreground">
            {member.usdt_address}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            交易记录
          </h3>
        </div>
        {!transactions || transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-muted-foreground/50"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg>
            <p className="text-sm text-muted-foreground">暂无交易记录</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {tx.type === "commission"
                      ? "佣金收入"
                      : tx.type === "withdrawal"
                        ? "提现"
                        : tx.type === "deposit"
                          ? "入金"
                          : "调整"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.description || "-"} &middot;{" "}
                    {new Date(tx.created_at).toLocaleDateString("zh-CN")}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      Number(tx.amount) >= 0 ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {Number(tx.amount) >= 0 ? "+" : ""}
                    ${Number(tx.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    余额 ${Number(tx.balance_after).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
