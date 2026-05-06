'use client'

import { cn } from '@/lib/utils'
import { useSlideStore } from '@/store/use-slide-store'
import React, { useEffect, useRef, useImperativeHandle } from 'react'

interface ParagraphProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  styles?: React.CSSProperties
  isPreview?: boolean
  isSidebar?: boolean
}

const Paragraph = React.forwardRef<HTMLTextAreaElement, ParagraphProps>(
  ({ className, styles, isPreview = false, isSidebar = false, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const { currentTheme } = useSlideStore()

    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLTextAreaElement)

    useEffect(() => {
      const textarea = internalRef.current
      if (textarea && !isPreview) {
        const adjustHeight = () => {
          textarea.style.height = 'auto'
          textarea.style.height = `${textarea.scrollHeight}px`
        }
        textarea.addEventListener('input', adjustHeight)
        adjustHeight()
        return () => textarea.removeEventListener('input', adjustHeight)
      }
    }, [isPreview])

    const sidebarOverrides = isSidebar
      ? 'text-[0.85rem] leading-tight font-normal px-[6px] py-[4px]'
      : 'text-base sm:text-[1.05rem] leading-relaxed'

    const focusRing = !isPreview
      ? `hover:shadow-[0_0_0_2px_rgba(0,0,0,0.1)] 
         focus:ring-2 focus:ring-offset-2 
         focus:ring-[${currentTheme.accentColor}] 
         ring-offset-1 focus:outline-none rounded-md px-1 py-1`
      : ''

    return (
      <textarea
        ref={internalRef}
        className={cn(
          'w-full bg-transparent resize-none overflow-hidden transition-all duration-200',
          sidebarOverrides,
          focusRing,
          className
        )}
        style={{
          padding: isSidebar && isPreview ? '0.2rem 0.4rem' : '0.25rem 0.5rem',
          margin: 0,
          color: currentTheme.fontColor,
          boxSizing: 'content-box',
          lineHeight: isSidebar ? '1.25em' : '1.6em',
          minHeight: isSidebar ? '1.2em' : '2.2em',
          ...styles,
        }}
        readOnly={isPreview}
        {...props}
      />
    )
  }
)

Paragraph.displayName = 'Paragraph'
export default Paragraph
