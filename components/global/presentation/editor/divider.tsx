import { cn } from "@/lib/utils"
import { useSlideStore } from "@/store/use-slide-store"

type Props = {
  className?: string
  isSidebar?: boolean
}

const Divider = ({ className = "", isSidebar = false }: Props) => {
  const { currentTheme } = useSlideStore()

  return (
    <hr
      aria-hidden="true"
      className={cn(
        "rounded-full border-0 transition-all duration-300 ease-in-out",
        isSidebar ? "my-2 min-h-[1.5px]" : "my-6 h-0.5",
        "hover:scale-[1.01]",
        className
      )}
      style={{
        backgroundColor: currentTheme.accentColor || "#999",
        opacity: 0.8,
      }}
    />
  )
}

export default Divider
