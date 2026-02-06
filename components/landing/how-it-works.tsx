const steps = [
  {
    number: "01",
    title: "注册账户",
    description: "通过邀请码注册，填写基本信息，获取您的专属账户。",
  },
  {
    number: "02",
    title: "激活入金",
    description: "支付 $300 USDT 激活费用，正式成为平台会员，开启收益之旅。",
  },
  {
    number: "03",
    title: "邀请团队",
    description: "使用您的5个专属邀请码邀请伙伴加入，构建您的七级团队网络。",
  },
  {
    number: "04",
    title: "获取收益",
    description: "团队成员入金后自动计算佣金，月度对账，次月初 USDT 发放。",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            如何运作
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            四步开启您的创业投资之路，简单透明，轻松上手。
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 bg-border lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
