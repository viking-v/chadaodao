import Image from "next/image"

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/photo-2026-01-03-20-28-39.jpeg"
              alt="ChaDao Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-lg font-bold text-foreground">ChaDao</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            ChaDao 创业投资平台 - USDT (TRC-20) 结算 - 七级级差分润
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ChaDao. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
