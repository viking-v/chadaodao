"use client"

import React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function TestAuthPage() {
  const [email, setEmail] = useState("test@chadao.com")
  const [password, setPassword] = useState("password123")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function testLogin() {
    setLoading(true)
    setResult(null)

    try {
      const supabase = createClient()
      console.log('🔐 测试登录:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 登录结果:', { data, error })

      setResult({
        success: !error,
        user: data.user,
        error: error?.message,
        timestamp: new Date().toISOString()
      })

    } catch (err) {
      console.error('❌ 登录异常:', err)
      setResult({
        success: false,
        error: err instanceof Error ? err.message : '未知错误',
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  async function testSignup() {
    setLoading(true)
    setResult(null)

    try {
      const supabase = createClient()
      console.log('📝 测试注册:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: '测试用户'
          }
        }
      })

      console.log('📊 注册结果:', { data, error })

      setResult({
        success: !error,
        user: data.user,
        error: error?.message,
        timestamp: new Date().toISOString()
      })

    } catch (err) {
      console.error('❌ 注册异常:', err)
      setResult({
        success: false,
        error: err instanceof Error ? err.message : '未知错误',
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  async function testLogout() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setResult({
        success: true,
        message: '已退出登录',
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : '退出失败',
        timestamp: new Date().toISOString()
      })
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">认证系统测试</h1>
        <p className="text-muted-foreground">测试登录、注册等功能</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <h2 className="mb-4 text-lg font-semibold">测试表单</h2>
            
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={testLogin}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "测试中..." : "测试登录"}
                </button>
                
                <button
                  onClick={testSignup}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
                >
                  {loading ? "测试中..." : "测试注册"}
                </button>
                
                <button
                  onClick={testLogout}
                  className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground hover:bg-muted/90"
                >
                  退出
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-2 text-sm font-semibold">预设账户</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>测试用户:</span>
                <code>test@chadao.com</code>
              </div>
              <div className="flex justify-between">
                <span>密码:</span>
                <code>password123</code>
              </div>
              <div className="flex justify-between">
                <span>管理员:</span>
                <code>admin@chadao.com</code>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <h2 className="mb-4 text-lg font-semibold">测试结果</h2>
            
            {result ? (
              <div className="space-y-3">
                <div className={`rounded-lg p-3 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                      {result.success ? '✅ 成功' : '❌ 失败'}
                    </span>
                  </div>
                  {result.error && (
                    <p className="text-sm text-red-600">{result.error}</p>
                  )}
                  {result.message && (
                    <p className="text-sm text-green-600">{result.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    时间: {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
                
                {result.user && (
                  <div className="rounded-lg bg-muted p-3">
                    <h4 className="mb-2 text-sm font-semibold">用户信息</h4>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(result.user, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                点击测试按钮查看结果
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-2 text-sm font-semibold">快速导航</h3>
            <div className="space-y-2">
              <a
                href="/auth/login"
                className="block rounded-lg border border-border p-2 text-sm hover:bg-muted"
              >
                📝 登录页面
              </a>
              <a
                href="/auth/sign-up"
                className="block rounded-lg border border-border p-2 text-sm hover:bg-muted"
              >
                📝 注册页面
              </a>
              <a
                href="/dashboard"
                className="block rounded-lg border border-border p-2 text-sm hover:bg-muted"
              >
                📊 用户面板
              </a>
              <a
                href="/admin"
                className="block rounded-lg border border-border p-2 text-sm hover:bg-muted"
              >
                🛠️ 管理后台
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
