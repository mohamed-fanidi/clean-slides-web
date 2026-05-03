import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const timeAgo = (timeStamp: string) => {
  const now = new Date()
  const diffInSeconds = Math.floor(
    (now.getTime() - new Date(timeStamp).getTime()) / 1000
  )

  const intervals = [
    { label: "year", value: 60 * 60 * 24 * 365 },
    { label: "month", value: 60 * 60 * 24 * 30 },
    { label: "days", value: 60 * 60 * 24 },
    { label: "hours", value: 60 * 60 },
    { label: "mins", value: 60 },
    { label: "sec", value: 1 },
  ]

  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i]
    const count = Math.floor(diffInSeconds / interval.value)

    if (count >= 1) {
      return `${count} ${interval.label} ago `
    }
  }
  return "Just now"
}

export const getSlideTitle = (slide: any): string => {
  try {
    const content = slide?.content?.content
    if (!Array.isArray(content)) return "Untitled Slide"

    for (const block of content) {
      if (block?.type === "title" && typeof block.content === "string") {
        return block.content || "Untitled Slide"
      }

      if (block?.type === "column" && Array.isArray(block.content)) {
        for (const inner of block.content) {
          if (inner?.type === "title" && typeof inner.content === "string") {
            return inner.content || "Untitled Slide"
          }
        }
      }
    }

    return "Untitled Slide"
  } catch {
    return "Untitled Slide"
  }
}
