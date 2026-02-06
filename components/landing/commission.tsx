const commissionLevels = [
  { level: "一级", rate: "20%", example: "$60.00", highlight: true },
  { level: "二级", rate: "8%", example: "$24.00", highlight: false },
  { level: "三级", rate: "8%", example: "$24.00", highlight: false },
  { level: "四级", rate: "6%", example: "$18.00", highlight: false },
  { level: "五级", rate: "5%", example: "$15.00", highlight: false },
  { level: "六级", rate: "5%", example: "$15.00", highlight: false },
  { level: "七级", rate: "5%", example: "$15.00", highlight: false },
]

const fundPools = [
  { name: "分润池", percentage: "57%", amount: "$171", color: "bg-primary" },
  { name: "创业资金池", percentage: "30%", amount: "$90", color: "bg-secondary" },
  { name: "平台留存", percentage: "10%", amount: "$30", color: "bg-accent" },
  {
    name: "慈善基金池",
    percentage: "3%",
    amount: "$9",
    color: "bg-chart-4",
  },
]

export function CommissionSection() {
  return (
    <section id="commission" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            分润方案
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            基于 $300 入金金额，每笔入金按以下比例分配至各资金池与分润层级。
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Commission Levels Table */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6 text-xl font-semibold text-card-foreground">
              七级分润费率
            </h3>
            <div className="space-y-3">
              {commissionLevels.map((item) => (
                <div
                  key={item.level}
                  className={`flex items-center justify-between rounded-lg p-3 ${
                    item.highlight
                      ? "border border-primary/20 bg-primary/5"
                      : "bg-muted/50"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      item.highlight
                        ? "text-primary"
                        : "text-card-foreground"
                    }`}
                  >
                    {item.level}
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-semibold text-card-foreground">
                      {item.rate}
                    </span>
                    <span className="min-w-[80px] text-right text-sm text-muted-foreground">
                      {item.example}
                    </span>
                  </div>
                </div>
              ))}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/10 p-3">
                <span className="text-sm font-bold text-primary">
                  总计
                </span>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-primary">57%</span>
                  <span className="min-w-[80px] text-right text-sm font-bold text-primary">
                    $171.00
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Fund Pools */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6 text-xl font-semibold text-card-foreground">
              资金池分配（每笔 $300）
            </h3>
            <div className="mb-8 space-y-4">
              {fundPools.map((pool) => (
                <div key={pool.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">
                      {pool.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {pool.percentage} ({pool.amount})
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${pool.color} transition-all`}
                      style={{
                        width: pool.percentage,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                所有资金流向透明可查，月度对账报告自动生成，支持 CSV/Excel
                导出。不足七级的佣金将分配给顶层账户（兜底机制）。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
