"use client"

import React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function TestLoginPage() {
  const [email, setEmail] = useState("test@chadao.com")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      console.log('🔐 开始登录...', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 登录结果:', { data, error })

      if (error) {
        console.error('❌ 登录失败:', error)
        setError(error.message)
        setLoading(false)
        return
      }

      console.log('✅ 登录成功:', data.user)
      
      // 等待一下再跳转
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
      
    } catch (err) {
      console.error('❌ 登录异常:', err)
      setError('登录过程中发生错误')
      setLoading(false)
    }
  }

  async function handleQuickLogin() {
    setEmail("test@chadao.com")
    setPassword("password123")
    
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement
      form?.requestSubmit()
    }, 100)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
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
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            测试登录
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            使用测试账户登录系统
          </p>
        </div>

        <form id="login-form" onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              邮箱地址
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@chadao.com"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "登录中..." : "登录"}
            </button>
            
            <button
              type="button"
              onClick={handleQuickLogin}
              className="rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90"
            >
              快速登录
            </button>
          </div>
        </form>

        <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground">测试账户信息</h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>邮箱: test@chadao.com</div>
            <div>密码: password123</div>
            <div>状态: 未激活</div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          还没有账户？{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium text-primary hover:underline"
          >
            立即注册
          </Link>
        </p>
      </div>
    </div>
  )
}
