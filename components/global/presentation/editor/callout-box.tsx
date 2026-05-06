import { cn } from '@/lib/utils'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info
} from 'lucide-react'
import React from 'react'

type Props = {
  type: 'success' | 'warning' | 'info' | 'question' | 'caution'
  children: React.ReactNode
  className?: string
  isSidebar?: boolean
}

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  question: HelpCircle,
  caution: AlertCircle
}

const CalloutBox = ({
  type,
  children,
  className,
  isSidebar = false
}: Props) => {
  const Icon = icons[type]

  const colors = {
    success: {
      bg: 'bg-green-100',
      border: 'border-green-500',
      text: 'text-green-800'
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-500',
      text: 'text-yellow-800'
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-blue-500',
      text: 'text-blue-800'
    },
    question: {
      bg: 'bg-purple-100',
      border: 'border-purple-500',
      text: 'text-purple-800'
    },
    caution: {
      bg: 'bg-red-100',
      border: 'border-red-500',
      text: 'text-red-800'
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border-l-4 flex items-start shadow-sm transition-transform duration-200 hover:scale-[1.01] gap-3',
        colors[type].bg,
        colors[type].border,
        colors[type].text,
        isSidebar
          ? 'text-[0.72rem] p-2 gap-2 leading-snug'
          : 'p-4 text-[0.92rem] sm:text-base leading-relaxed',
        className
      )}
    >
      <Icon
        className={cn(
          'shrink-0 opacity-80',
          isSidebar ? 'h-4 w-4 mt-0.5' : 'h-5 w-5 mt-1'
        )}
      />
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default CalloutBox
