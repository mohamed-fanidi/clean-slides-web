"use client"
import { Button } from "@/components/ui/button"
import { new_page_options } from "@/lib/constants"
import { ArrowLeft } from "@solar-icons/react"
import { X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function page() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <main className="flex flex-col gap-8">
        <h1 className="text-4xl tracking-tighter">
          <span className="dark:text-chart-24ereeewee text-primary">
            {" "}
            {/*FIXME: WHAT is that className?*/}
            Let's create
          </span>{" "}
          <span className="">your best presentation</span>
        </h1>

        <div className="absolute top-0 right-0 p-10">
          <Button
            asChild
            variant="outline"
            className="size-10 rounded-full shadow"
            size="icon-lg"
          >
            <Link href="/dashboard">
              <X strokeWidth={1} className="size-6" />
            </Link>
          </Button>
        </div>

        <div className="flex gap-4">
          {new_page_options.map((option) => {
            const isSelected = selectedOption === option.type

            return (
              <button
                key={option.type}
                onClick={() => setSelectedOption(option.type)}
                className={`group flex w-44 cursor-pointer flex-col items-center rounded-xl border p-4 text-center transition-all ${
                  isSelected
                    ? "border-primary bg-secondary shadow dark:bg-secondary/60"
                    : "bg-transparent hover:bg-secondary dark:hover:bg-secondary/40"
                }`}
              >
                <img
                  src={option.img}
                  className="h-24 w-auto transition-transform duration-300 group-hover:-translate-y-2"
                />

                <h3 className="my-1 font-semibold">{option.title}</h3>

                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex justify-between gap-3">
          <Button asChild variant="secondary">
            <Link href="/home">
              <ArrowLeft weight="Linear" />
              Back to Home
            </Link>
          </Button>
          <Button disabled={!selectedOption}>
            {selectedOption ? (
              <Link
                href={
                  selectedOption === "template"
                    ? "/template"
                    : `/new/${selectedOption}`
                }
                className="flex items-center gap-1"
              >
                Continue
                <ArrowLeft weight="Linear" className="-rotate-180" />
              </Link>
            ) : (
              <span className="flex items-center gap-1">
                Continue
                <ArrowLeft weight="Linear" className="-rotate-180" />
              </span>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
