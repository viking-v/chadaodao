"use client"

import React from "react"

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          简单测试页面
        </h1>
        <p className="text-muted-foreground mb-4">
          测试基本渲染是否正常
        </p>
        
        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <h2 className="text-lg font-semibold mb-2">表单测试</h2>
            <form className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">邮箱</label>
                <input
                  type="email"
                  placeholder="test@example.com"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">密码</label>
                <input
                  type="password"
                  placeholder="•••••"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
              >
                提交
              </button>
            </form>
          </div>
          
          <div className="rounded-lg border border-border p-4">
            <h2 className="text-lg font-semibold mb-2">状态测试</h2>
            <div className="space-y-2 text-sm">
              <div>✅ 渲染正常</div>
              <div>✅ 样式加载</div>
              <div>✅ 交互可用</div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border p-4">
            <h2 className="text-lg font-semibold mb-2">导航测试</h2>
            <div className="space-y-2">
              <a
                href="/auth/login"
                className="block rounded-lg border border-border p-2 text-sm hover:bg-muted"
              >
                📝 登录页面
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
    </div>
  )
}
