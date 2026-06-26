"use client"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { SearchIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { AddCircle, InboxOut } from "@solar-icons/react"
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useSearchStore } from "@/store/use-search-store"

type Props = {
  user: User
}

export default function Header({ user }: Props) {
  const { open } = useSidebar()
  const router = useRouter()
  const query = useSearchStore((state) => state.query)
  const setQuery = useSearchStore((state) => state.setQuery)

  return (
    <header className="flex items-center justify-between border-b p-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger className={`${open && "hidden"} size-8 bg-secondary`} />
        <InputGroup className="max-w-xs border-none bg-secondary!">
          <InputGroupInput
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="secondary">
          <InboxOut weight="Linear" size={64} />
          Import
        </Button>
        <Button
          className="rounded-md"
          disabled={!user.subscription}
          onClick={() => router.push("/new")}
        >
          <AddCircle className="size-4" weight="Bold" />
          Create New Slide
        </Button>
      </div>
    </header>
  )
}
