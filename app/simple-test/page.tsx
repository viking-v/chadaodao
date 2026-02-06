"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SimpleTestPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const simulateLogin = () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@chadao.com',
      full_name: '测试用户'
    }
    
    setUser(mockUser)
    localStorage.setItem('mockUser', JSON.stringify(mockUser))
    console.log('✅ 模拟登录成功:', mockUser)
  }

  const goToDashboard = () => {
    console.log('🚀 跳转到dashboard')
    router.push('/dashboard')
  }

  const checkStorage = () => {
    const stored = localStorage.getItem('mockUser')
    console.log('📦 存储的用户:', stored)
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }

  React.useEffect(() => {
    checkStorage()
  }, [])

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">🧪 简单测试页面</h1>
        <p className="text-muted-foreground">测试基本功能</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border p-4">
          <h2 className="mb-4 text-lg font-semibold">当前状态</h2>
          
          {user ? (
            <div className="space-y-2">
              <div className="text-sm">
                <strong>用户ID:</strong> {user.id}
              </div>
              <div className="text-sm">
                <strong>邮箱:</strong> {user.email}
              </div>
              <div className="text-sm">
                <strong>姓名:</strong> {user.full_name}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">未登录</p>
          )}
        </div>

        <div className="rounded-lg border border-border p-4">
          <h2 className="mb-4 text-lg font-semibold">测试操作</h2>
          
          <div className="space-y-2">
            <button
              onClick={simulateLogin}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              模拟登录
            </button>
            
            <button
              onClick={goToDashboard}
              className="w-full rounded-lg bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:bg-secondary/90"
            >
              跳转到Dashboard
            </button>
            
            <button
              onClick={checkStorage}
              className="w-full rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground hover:bg-muted/90"
            >
              检查存储
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border p-4">
          <h2 className="mb-4 text-lg font-semibold">快速链接</h2>
          
          <div className="space-y-2">
            <a
              href="/debug-login"
              className="block rounded-lg border border-border p-2 text-sm hover:bg-muted"
            >
              🔍 登录调试页面
            </a>
            <a
              href="/auth/login"
              className="block rounded-lg border border-border p-2 text-sm hover:bg-muted"
            >
              📝 正常登录页面
            </a>
            <a
              href="/dashboard"
              className="block rounded-lg border border-border p-2 text-sm hover:bg-muted"
            >
              📊 Dashboard
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
  )
}
