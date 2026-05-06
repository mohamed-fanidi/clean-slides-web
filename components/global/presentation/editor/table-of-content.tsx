import { cn } from '@/lib/utils'
import { useSlideStore } from '@/store/use-slide-store'

type Props = {
  items: string[]
  onItemClick: (id: string) => void
  className?: string
  isSidebar?: boolean
}

const TableOfContent = ({ items, onItemClick, className, isSidebar = false }: Props) => {
  const { currentTheme } = useSlideStore()

  return (
    <nav
      className={cn(
        'space-y-2 rounded-xl shadow-md backdrop-blur bg-white/20 dark:bg-black/20 overflow-hidden',
        className,
        isSidebar
          ? 'p-2 space-y-1 text-xs leading-tight'
          : 'p-4 text-sm leading-relaxed'
      )}
      style={{ color: currentTheme.fontColor }}
    >
      {items?.length ? (
        items.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onItemClick(item)}
            className={cn(
              `cursor-pointer rounded-md transition-all duration-200 
              hover:scale-[1.02] hover:shadow-md 
              hover:bg-white/30 dark:hover:bg-white/10 active:scale-[0.98]`,
              isSidebar ? 'px-2 py-1 text-xs' : 'px-4 py-2'
            )}
            style={{
              backgroundColor: currentTheme.backgroundColor + '10',
              border: `1px solid ${currentTheme.accentColor}20`,
              fontFamily: currentTheme.fontFamily,
              color: currentTheme.fontColor,
              lineHeight: isSidebar ? '1.25rem' : '1.5rem',
            }}
          >
            {item || 'Untitled'}
          </div>
        ))
      ) : (
        <div className="italic opacity-60 text-center py-2 text-sm">
          No content found
        </div>
      )}
    </nav>
  )
}

export default TableOfContent
