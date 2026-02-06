import React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/shell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // 检查是否为管理员（简化版本，使用邮箱判断）
  if (user.email !== 'admin@chadao.com') {
    redirect("/dashboard")
  }

  // 创建虚拟管理员对象
  const adminMember = {
    id: user.id,
    email: user.email!,
    display_name: '管理员',
    is_admin: true
  }

  return <AdminShell member={adminMember}>{children}</AdminShell>
}
