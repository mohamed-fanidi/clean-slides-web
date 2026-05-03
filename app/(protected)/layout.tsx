export const dynamic = "force-dynamic"

import { onAuthenticateUser } from "@/actions/user"
import { redirect } from "next/navigation"
import React from "react"

type Props = { children: React.ReactNode }

export default async function Layout(props: Props) {
  const auth = await onAuthenticateUser()
  if (!auth.user) redirect("/sign-in")
  return <div className="min-h-screen w-full">{props.children}</div>
}
