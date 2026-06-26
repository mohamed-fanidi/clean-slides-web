import { HeroHeader } from "@/components/global/landing/header"
import { Button } from "@/components/ui/button"
import { ChevronRight, CirclePlay } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <HeroHeader />
      <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 py-28">
        <h1 className="text-center text-5xl leading-14 font-medium tracking-tighter capitalize">
          Build stunning presentations
          <br />
          <span className="text-muted-foreground">with AI precision</span>
        </h1>

        <p className="max-w-lg text-center text-sm text-muted-foreground">
          Design pitch decks, reports, and brand guidelines in seconds
          effortlessly, beautifully, and tailored to your creative goals with
          AI.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button asChild className="">
            <Link href="/dashboard">
              <span className="text-nowrap">Get Started</span>
              <ChevronRight className="opacity-50" />
            </Link>
          </Button>
          <Button key={2} asChild variant="outline" className="">
            <Link href="#link">
              <CirclePlay className="fill-primary/25 stroke-primary" />
              <span className="text-nowrap">Watch video</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
