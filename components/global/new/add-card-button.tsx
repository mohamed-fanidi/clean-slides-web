"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
type Props = {
  onAddCard: () => void
}

const AddCardButton = ({ onAddCard }: Props) => {
  const [showGap, setShowGap] = useState(false)
  return (
    <div
      onMouseEnter={() => setShowGap(true)}
      onMouseLeave={() => setShowGap(false)}
      className="relative w-full overflow-hidden"
    >
      {showGap && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-[40%] bg-primary"></div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-full bg-primary p-0 hover:bg-primary"
            onClick={onAddCard}
            aria-label="Add new card"
          >
            <Plus className="h-4 w-4 text-black" />
          </Button>
          <div className="h-px w-[40%] bg-primary" />
        </div>
      )}
    </div>
  )
}

export default AddCardButton
