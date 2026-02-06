import Link from "next/link"
import Image from "next/image"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/photo-2026-01-03-20-28-39.jpeg"
            alt="ChaDao Logo"
            width={44}
            height={44}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-foreground">ChaDao</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            平台优势
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            运作模式
          </a>
          <a
            href="#commission"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            分润方案
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            登录
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            立即注册
          </Link>
        </div>
      </div>
    </header>
  )
}
