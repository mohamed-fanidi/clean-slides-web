'use client'
import { useSlideStore } from '@/store/use-slide-store'
import React from 'react'
import { cn } from '@/lib/utils'

interface BlockQuoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  children: React.ReactNode
  className?: string
  isSidebar?: boolean
}

const BlockQuote = ({
  children,
  className,
  isSidebar = false,
  ...props
}: BlockQuoteProps) => {
  const { currentTheme } = useSlideStore()

  return (
    <blockquote
      className={cn(
        'rounded-xl border-l-4 italic transition-shadow duration-300',
        'text-gray-700 dark:text-gray-300',
        'bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.05)]',
        'hover:shadow-md',
        isSidebar
          ? 'text-[0.78rem] px-3 py-2 my-2 leading-snug'
          : 'text-[1rem] sm:text-[1.05rem] px-6 py-4 my-4 leading-relaxed',
        className
      )}
      style={{ borderLeftColor: currentTheme.accentColor }}
      {...props}
    >
      {children}
    </blockquote>
  )
}

export default BlockQuote
