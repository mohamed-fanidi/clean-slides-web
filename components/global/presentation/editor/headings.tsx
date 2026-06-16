"use client"

import { cn } from "@/lib/utils"
import { useSlideStore } from "@/store/use-slide-store"
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react"

interface HeadingProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  styles?: React.CSSProperties
  isPreview?: boolean
  isSidebar?: boolean
}

const createHeading = (displayName: string, defaultClassName: string) => {
  const Heading = forwardRef<HTMLTextAreaElement, HeadingProps>(
    (
      {
        styles,
        isPreview = false,
        isSidebar = false,
        className,
        onChange,
        value,
        ...props
      },
      ref
    ) => {
      const textareaRef = useRef<HTMLTextAreaElement>(null)
      const { currentTheme } = useSlideStore()

      // Local state — only syncs to store on blur
      const [localValue, setLocalValue] = useState((value as string) ?? "")

      // Keep in sync if parent value changes (e.g. slide switch)
      useEffect(() => {
        setLocalValue((value as string) ?? "")
      }, [value])

      useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement)

      useEffect(() => {
        const textarea = textareaRef.current
        if (textarea && !isPreview) {
          textarea.style.height = "0"
          textarea.style.height = `${textarea.scrollHeight}px`
        }
      }, [localValue, isPreview])

      const editableClassName = !isPreview
        ? "hover:ring-1 focus:ring-2 ring-blue-300 transition-all duration-200"
        : ""

      const sidebarOverrides = isSidebar
        ? "text-sm font-semibold leading-snug px-[4px]"
        : defaultClassName

      return (
        <textarea
          ref={textareaRef}
          readOnly={isPreview}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)} // local only, no store update
          onBlur={(e) => onChange?.(e)} // push to store only on blur
          className={cn(
            "w-full resize-none overflow-hidden bg-transparent placeholder:text-gray-400 focus:outline-none",
            "transition-all duration-200",
            sidebarOverrides,
            editableClassName,
            className
          )}
          style={{
            padding: isSidebar ? "0.2rem 0.4rem" : "0",
            margin: 0,
            boxSizing: "content-box",
            minHeight: "1.4em",
            lineHeight: isSidebar ? "1.25em" : "1.4em",
            color: currentTheme.fontColor + "DD",
            ...styles,
          }}
          {...props}
        />
      )
    }
  )

  Heading.displayName = displayName
  return Heading
}

const Heading1 = createHeading("Heading1", "text-4xl leading-tight")
const Heading2 = createHeading("Heading2", "text-3xl leading-snug")
const Heading3 = createHeading("Heading3", "text-2xl leading-snug")
const Heading4 = createHeading("Heading4", "text-xl leading-snug")
const Title = createHeading("Title", "text-5xl leading-tight")

export { Heading1, Heading2, Heading3, Heading4, Title }
