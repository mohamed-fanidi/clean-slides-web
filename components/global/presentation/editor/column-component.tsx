'use client'

import { MasterRecursiveComponent } from './master-recursive-component'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { ContentItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  content: ContentItem[]
  className?: string
  isPreview?: boolean
  isSidebar?: boolean
  slideId: string
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void
  isEditable?: boolean
}

const createDefaultColumns = (count: number): ContentItem[] => {
  return Array(count)
    .fill(null)
    .map(() => ({
      id: uuidv4(),
      type: 'paragraph' as const,
      name: 'Paragraph',
      content: '',
      placeholder: 'Start typing ...'
    }))
}

const ColumnComponent = ({
  content,
  className,
  isEditable = true,
  isPreview = false,
  isSidebar = false,
  onContentChange,
  slideId
}: Props) => {
  const [columns, setColumns] = useState<ContentItem[]>([])

  useEffect(() => {
    if (content.length === 0) {
      setColumns(createDefaultColumns(2))
    } else {
      setColumns(content)
    }
  }, [content])

  return (
    <div className="relative w-full h-full">
      <ResizablePanelGroup
        orientation="horizontal"
        className={cn(
          'h-full w-full rounded-lg overflow-hidden border border-muted shadow-sm',
          !isEditable && 'border-none!',
          isSidebar && 'text-[0.6rem] gap-1',
          className
        )}
      >
        {columns.map((item, index) => (
          <React.Fragment key={item.id}>
            <ResizablePanel minSize={20} defaultSize={100 / columns.length}>
              <div
                className={cn(
                  'h-full w-full overflow-auto bg-white/70 dark:bg-neutral-900/70',
                  isSidebar ? 'p-1' : 'p-4',
                  item.className
                )}
              >
                <MasterRecursiveComponent
                  content={item}
                  isPreview={isPreview}
                  isSidebar={isSidebar}
                  onContentChange={onContentChange}
                  slideId={slideId}
                  isEditable={isEditable}
                />
              </div>
            </ResizablePanel>

            {index < columns.length - 1 && isEditable && (
              <ResizableHandle withHandle={!isPreview} />
            )}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  )
}

export default ColumnComponent
