"use client"

import { useState } from "react"
import { InviteCode } from "@/lib/supabase/database"

interface InviteCodeCardProps {
  inviteCodes: InviteCode[]
  maxInvites: number
  usedInvites: number
}

export function InviteCodeCard({
  inviteCodes,
  maxInvites,
  usedInvites,
}: InviteCodeCardProps) {
  const [copied, setCopied] = useState(false)
  const [selectedCode, setSelectedCode] = useState(0)

  const currentCode = inviteCodes[selectedCode]?.code || ""

  function handleCopy() {
    navigator.clipboard.writeText(currentCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">
        我的邀请码
      </h3>
      
      {inviteCodes.length > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex-1 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-center">
              <span className="text-xl font-mono font-bold tracking-widest text-primary">
                {currentCode}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {copied ? "已复制" : "复制"}
            </button>
          </div>
          
          {inviteCodes.length > 1 && (
            <div className="mb-4 flex gap-2">
              {inviteCodes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCode(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    selectedCode === index ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mb-4 rounded-lg border border-muted bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">暂无可用邀请码</p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">已使用邀请</span>
        <span className="font-medium text-card-foreground">
          {usedInvites} / {maxInvites}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(usedInvites / maxInvites) * 100}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        分享此邀请码给您的朋友，每位新会员入金 $300 后您将获得佣金收益。
      </p>
    </div>
  )
}
