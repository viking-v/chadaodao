import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-secondary" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              USDT (TRC-20) 结算
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              创业投资
              <span className="text-primary">新起点</span>
              <br />
              七级分润助力梦想
            </h1>
            <p className="mb-8 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
              ChaDao 创业投资平台，以透明的七级级差分润模式，$300
              即可激活账户，USDT实时结算，为您的创业之路保驾护航。
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              <Link
                href="/auth/sign-up"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 sm:w-auto"
              >
                立即加入
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-8 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
              >
                了解详情
              </a>
            </div>
            <div className="mt-10 flex items-center justify-center gap-8 md:justify-start">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">$300</p>
                <p className="text-xs text-muted-foreground">激活费用</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">7 级</p>
                <p className="text-xs text-muted-foreground">分润层级</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">57%</p>
                <p className="text-xs text-muted-foreground">分润池比例</p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-primary/5" />
              <Image
                src="/images/photo-2026-01-03-20-28-39.jpeg"
                alt="ChaDao - 创业投资平台"
                width={400}
                height={400}
                className="relative rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
