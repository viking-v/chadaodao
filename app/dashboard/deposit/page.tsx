"use client"

import React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import useSWR from "swr"

async function fetchMember() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: member } = await supabase
    .from("members")
    .select("id, status, wallet_balance")
    .eq("id", user.id)
    .single()

  const { data: deposits } = await supabase
    .from("deposits")
    .select("*")
    .eq("member_id", user.id)
    .order("created_at", { ascending: false })

  return { member, deposits }
}

export default function DepositPage() {
  const { data, mutate } = useSWR("deposit-data", fetchMember)
  const [txHash, setTxHash] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmitDeposit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("请先登录")
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from("deposits").insert({
      member_id: user.id,
      amount: 300,
      currency: "USDT",
      tx_hash: txHash.trim() || null,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTxHash("")
    setLoading(false)
    mutate()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">入金激活</h1>
        <p className="text-sm text-muted-foreground">
          支付 $300 USDT (TRC-20) 激活您的账户
        </p>
      </div>

      {data?.member?.status === "active" ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
          <h3 className="text-lg font-semibold text-primary">
            您的账户已激活
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            无需再次入金
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-card-foreground">
              付款信息
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">金额</p>
                <p className="text-lg font-bold text-card-foreground">$300 USDT</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">网络</p>
                <p className="text-sm font-medium text-card-foreground">
                  TRC-20 (TRON)
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  请转账至以下地址后提交交易哈希
                </p>
                <p className="mt-1 break-all font-mono text-xs text-card-foreground">
                  平台 USDT 收款地址将由管理员设置
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-card-foreground">
              提交入金
            </h3>

            {success && (
              <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
                入金申请已提交，请等待管理员确认。
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitDeposit} className="space-y-4">
              <div>
                <label
                  htmlFor="txHash"
                  className="mb-1.5 block text-sm font-medium text-card-foreground"
                >
                  交易哈希 (TxHash)
                </label>
                <input
                  id="txHash"
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="输入 TRON 交易哈希"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "提交中..." : "提交入金申请"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Deposit History */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            入金记录
          </h3>
        </div>
        {!data?.deposits || data.deposits.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            暂无入金记录
          </div>
        ) : (
          <div className="divide-y divide-border">
            {data.deposits.map((deposit: { id: string; amount: number; tx_hash: string | null; status: string; created_at: string }) => (
              <div
                key={deposit.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    ${Number(deposit.amount).toFixed(2)} USDT
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {deposit.tx_hash
                      ? `TxHash: ${deposit.tx_hash.slice(0, 16)}...`
                      : "无交易哈希"}{" "}
                    &middot;{" "}
                    {new Date(deposit.created_at).toLocaleDateString("zh-CN")}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    deposit.status === "confirmed"
                      ? "bg-primary/10 text-primary"
                      : deposit.status === "rejected"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-accent/20 text-accent-foreground"
                  }`}
                >
                  {deposit.status === "confirmed"
                    ? "已确认"
                    : deposit.status === "rejected"
                      ? "已拒绝"
                      : "审核中"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
