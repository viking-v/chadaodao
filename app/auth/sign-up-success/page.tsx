import Link from "next/link"
import Image from "next/image"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="mb-6 inline-flex items-center gap-3">
          <Image
            src="/images/photo-2026-01-03-20-28-39.jpeg"
            alt="ChaDao Logo"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <span className="text-2xl font-bold text-foreground">ChaDao</span>
        </Link>
        <div className="mt-6 rounded-xl border border-border bg-card p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-card-foreground">
            注册成功
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            请检查您的邮箱并点击确认链接以激活您的账户。确认后即可登录并支付
            $300 USDT 激活费用。
          </p>
          <Link
            href="/auth/login"
            className="inline-flex rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            前往登录
          </Link>
        </div>
      </div>
    </div>
  )
}
