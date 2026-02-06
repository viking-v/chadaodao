"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        router.push("/dashboard")
      } else {
        setError("登录失败")
        setLoading(false)
      }
    } catch (err) {
      setError("登录过程中发生错误")
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '448px' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Link href="/" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <Image
              src="/images/photo-2026-01-03-20-28-39.jpeg"
              alt="ChaDao Logo"
              width={48}
              height={48}
              style={{ borderRadius: '0.5rem' }}
            />
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>ChaDao</span>
          </Link>
          <h1 style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
            欢迎回来
          </h1>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            登录您的 ChaDao 账户
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{ borderRadius: '0.5rem', border: '1px solid #fecaca', backgroundColor: '#fef2f2', padding: '0.75rem', fontSize: '0.875rem', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.375rem' }}
            >
              邮箱地址
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                padding: '0.625rem 1rem',
                fontSize: '0.875rem',
                color: '#111827',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.375rem' }}
            >
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              required
              style={{
                width: '100%',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                padding: '0.625rem 1rem',
                fontSize: '0.875rem',
                color: '#111827',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              borderRadius: '0.5rem',
              backgroundColor: loading ? '#9ca3af' : '#1b5e5e',
              padding: '0.625rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none'
            }}
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            还没有账户？{" "}
            <Link
              href="/auth/sign-up"
              style={{ fontWeight: '500', color: '#1b5e5e', textDecoration: 'none' }}
            >
              立即注册
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '1.5rem', borderRadius: '0.5rem', backgroundColor: '#f9fafb', padding: '1rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>测试账户</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
            <div>邮箱: test@chadao.com</div>
            <div>密码: password123</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail("test@chadao.com")
              setPassword("password123")
            }}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              padding: '0.375rem 0.75rem',
              fontSize: '0.75rem',
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            填充测试账户
          </button>
        </div>
      </div>
    </div>
  )
}
