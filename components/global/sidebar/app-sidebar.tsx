"use client"

import { Sidebar, SidebarContent } from "@/components/ui/sidebar"

import RecentOpen from "@/components/global/sidebar/recent-open"
import { NavFooter } from "@/components/global/sidebar/nav-footer"
import { NavHeader } from "@/components/global/sidebar/nav-header"
import { NavMain } from "@/components/global/sidebar/nav-main"
import Link from "next/link"
import { AddCircle } from "@solar-icons/react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { data } from "@/lib/constants"
import { Project, User } from "@prisma/client"
import { useRouter } from "next/navigation"

const AppSidebar = ({
  recentProjects,
  user,
  hasUpgraded = false,
  ...props
}: {
  recentProjects: Project[]
  user: User
  hasUpgraded?: boolean
} & React.ComponentProps<typeof Sidebar>) => {
  const router = useRouter()
  return (
    <Sidebar {...props}>
      <NavHeader user={user} />
      <SidebarContent>
        <Button
          onClick={() => router.push('/new')}
          className={cn(buttonVariants(), "m-2 rounded-md")}
        >
          <AddCircle className="size-4" weight="Bold" />
          Create New Slide
        </Button>
        <NavMain items={data.navMain} />

        <RecentOpen recentProjects={recentProjects} />
      </SidebarContent>
      <NavFooter prismaUser={user} />
    </Sidebar>
  )
}

export default AppSidebar
