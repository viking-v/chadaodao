interface OverviewCardsProps {
  walletBalance: number
  totalEarned: number
  directReferrals: number
  status: string
}

export function OverviewCards({
  walletBalance,
  totalEarned,
  directReferrals,
  status,
}: OverviewCardsProps) {
  const cards = [
    {
      label: "钱包余额",
      value: `$${walletBalance.toFixed(2)}`,
      subtitle: "USDT",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg>
      ),
    },
    {
      label: "累计收益",
      value: `$${totalEarned.toFixed(2)}`,
      subtitle: "总佣金",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
      ),
    },
    {
      label: "直推人数",
      value: `${directReferrals}/5`,
      subtitle: "已邀请",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      ),
    },
    {
      label: "账户状态",
      value: status === "active" ? "已激活" : status === "frozen" ? "已冻结" : "待激活",
      subtitle: status === "active" ? "正常" : "需入金 $300",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
      ),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{card.label}</span>
            <div className="text-muted-foreground">{card.icon}</div>
          </div>
          <p className="text-2xl font-bold text-card-foreground">{card.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{card.subtitle}</p>
        </div>
      ))}
    </div>
  )
}
