"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function DebugLoginPage() {
  const [email, setEmail] = useState("test@chadao.com")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(`[${timestamp}] ${message}`)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setLogs([])

    addLog("🔐 开始登录流程")
    addLog(`📧 邮箱: ${email}`)
    addLog(`🔑 密码: ${password.replace(/./g, '*')}`)

    try {
      addLog("🔗 创建Supabase客户端...")
      const supabase = createClient()
      
      addLog("📤 发送登录请求...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      addLog(`📊 登录响应: ${JSON.stringify({ 
        hasUser: !!data.user, 
        userEmail: data.user?.email,
        userId: data.user?.id,
        error: error?.message 
      }, null, 2)}`)

      if (error) {
        addLog(`❌ 登录失败: ${error.message}`)
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        addLog(`✅ 登录成功: ${data.user.email}`)
        addLog(`🆔 用户ID: ${data.user.id}`)
        
        addLog("⏳ 准备跳转到Dashboard...")
        setTimeout(() => {
          addLog("🚀 开始跳转...")
          router.push("/dashboard")
        }, 1000)
      } else {
        addLog("⚠️ 未获取到用户信息")
        setError("登录失败：未获取到用户信息")
        setLoading(false)
      }
    } catch (err) {
      addLog(`💥 登录异常: ${err instanceof Error ? err.message : '未知错误'}`)
      setError("登录过程中发生错误")
      setLoading(false)
    }
  }

  const testDirectAPI = async () => {
    addLog("🧪 测试直接API调用...")
    try {
      const response = await fetch('/api/auth/validate-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: 'TEST123' })
      })
      const result = await response.json()
      addLog(`📡 API响应: ${JSON.stringify(result)}`)
    } catch (err) {
      addLog(`❌ API测试失败: ${err instanceof Error ? err.message : '未知错误'}`)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 登录表单 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">🔐 登录测试</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading ? "登录中..." : "登录"}
              </button>
            </form>

            <div className="mt-4 space-y-2">
              <button
                onClick={testDirectAPI}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
              >
                🧪 测试API连接
              </button>
              
              <button
                onClick={() => {
                  setEmail("test@chadao.com")
                  setPassword("password123")
                }}
                className="w-full rounded-lg border border-gray-300 bg-blue-50 px-4 py-2 text-sm"
              >
                🔄 重置测试账户
              </button>
            </div>
          </div>

          {/* 日志面板 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">📋 调试日志</h2>
              <button
                onClick={() => setLogs([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                清除日志
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto bg-gray-900 text-green-400 p-4 rounded font-mono text-xs">
              {logs.length === 0 ? (
                <div className="text-gray-500">等待操作...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="text-sm font-semibold mb-2">📊 系统信息</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <div>当前时间: {new Date().toLocaleString()}</div>
                <div>用户代理: {typeof window !== 'undefined' ? navigator.userAgent : 'Server'}</div>
                <div>页面URL: {typeof window !== 'undefined' ? window.location.href : 'Server'}</div>
                <div>环境模式: {process.env.NODE_ENV || 'unknown'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
