import React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!member) {
    redirect("/auth/login")
  }

  return <DashboardShell member={member}>{children}</DashboardShell>
}
