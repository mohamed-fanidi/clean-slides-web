import { getRecentProjects } from "@/actions/project"
import { onAuthenticateUser } from "@/actions/user"
import Header from "@/components/global/dashboard/header"
import AppSidebar from "@/components/global/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import React from "react"

type Props = { children: React.ReactNode }

export default async function Layout({ children }: Props) {
  const recentProjects = await getRecentProjects()

  const checkUser = await onAuthenticateUser()
  if (!checkUser.user) redirect("/sign-in")

  return (
    <SidebarProvider>
      <AppSidebar
        user={checkUser.user}
        recentProjects={recentProjects.data || []}
      />
      <SidebarInset>
          <Header user={checkUser.user}/>
          {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
