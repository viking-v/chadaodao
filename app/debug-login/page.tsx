"use client"

import React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DebugLoginPage() {
  const [email, setEmail] = useState("test@chadao.com")
  const [password, setPassword] = useState("password123")
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(`[${timestamp}] ${message}`)
  }

  async function handleLogin() {
    setLoading(true)
    setLogs([])
    
    try {
      addLog("🔐 开始登录流程")
      addLog(`📧 邮箱: ${email}`)
      
      const supabase = createClient()
      addLog("🔗 Supabase客户端创建成功")
      
      addLog("📤 发送登录请求...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      addLog(`📊 登录响应: ${JSON.stringify({ data: !!data.user, error: error?.message }, null, 2)}`)

      if (error) {
        addLog(`❌ 登录失败: ${error.message}`)
        return
      }

      if (data.user) {
        addLog(`✅ 登录成功: ${data.user.email}`)
        addLog(`🆔 用户ID: ${data.user.id}`)
        
        // 等待一下再跳转
        addLog("⏳ 准备跳转到dashboard...")
        setTimeout(() => {
          addLog("🚀 开始跳转...")
          router.push("/dashboard")
        }, 1000)
      } else {
        addLog("⚠️ 未获取到用户信息")
      }
      
    } catch (err) {
      addLog(`💥 异常: ${err instanceof Error ? err.message : '未知错误'}`)
      console.error('登录异常:', err)
    } finally {
      setLoading(false)
    }
  }

  async function checkSession() {
    try {
      addLog("🔍 检查当前会话...")
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()
      
      if (error) {
        addLog(`❌ 获取会话失败: ${error.message}`)
      } else if (data.user) {
        addLog(`✅ 当前用户: ${data.user.email}`)
      } else {
        addLog("⚠️ 无活跃会话")
      }
    } catch (err) {
      addLog(`💥 检查会话异常: ${err instanceof Error ? err.message : '未知错误'}`)
    }
  }

  async function testDirect() {
    try {
      addLog("🧪 直接测试dashboard访问...")
      router.push("/dashboard")
    } catch (err) {
      addLog(`💥 跳转异常: ${err instanceof Error ? err.message : '未知错误'}`)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">🔍 登录调试页面</h1>
        <p className="text-muted-foreground">诊断登录问题</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <h2 className="mb-4 text-lg font-semibold">登录表单</h2>
            
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
                  onClick={handleLogin}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "登录中..." : "登录"}
                </button>
                
                <button
                  onClick={checkSession}
                  className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground hover:bg-secondary/90"
                >
                  检查会话
                </button>
                
                <button
                  onClick={testDirect}
                  className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground hover:bg-muted/90"
                >
                  直接跳转
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-2 text-sm font-semibold">快速填充</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setEmail("test@chadao.com")
                  setPassword("password123")
                }}
                className="w-full rounded-lg border border-border p-2 text-sm hover:bg-muted text-left"
              >
                🧪 测试用户 (test@chadao.com)
              </button>
              <button
                onClick={() => {
                  setEmail("admin@chadao.com")
                  setPassword("password123")
                }}
                className="w-full rounded-lg border border-border p-2 text-sm hover:bg-muted text-left"
              >
                👑 管理员 (admin@chadao.com)
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <h2 className="mb-4 text-lg font-semibold">调试日志</h2>
            
            <div className="h-96 overflow-y-auto rounded-lg bg-muted p-3">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">点击登录按钮开始调试...</p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-xs font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {logs.length > 0 && (
              <button
                onClick={() => setLogs([])}
                className="mt-2 rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                清除日志
              </button>
            )}
          </div>

          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-2 text-sm font-semibold">环境信息</h3>
            <div className="space-y-1 text-xs">
              <div>Mock模式: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '❌' : '✅'}</div>
              <div>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || '未配置'}</div>
              <div>当前时间: {new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
