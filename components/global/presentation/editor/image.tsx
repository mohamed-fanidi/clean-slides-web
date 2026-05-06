import Image from 'next/image'
import UploadImage from './upload-image'
import { UploadCloud } from 'lucide-react'

type Props = {
  src: string
  alt: string
  className?: string
  isPreview?: boolean
  isSidebar?: boolean
  contentId: string
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void
  isEditable?: boolean
}

const CustomImage = ({
  src,
  alt,
  className,
  isEditable = true,
  isPreview = false,
  isSidebar = false,
  onContentChange,
  contentId
}: Props) => {
  const width = isSidebar ? 240 : isPreview ? 400 : 800
  const height = isSidebar ? 140 : isPreview ? 300 : 500

  return (
    <div
      className={`relative group w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] ${className}`}
    >
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        className="object-contain w-full h-auto"
        style={{
          maxHeight: isSidebar ? '140px' : '400px',
          borderRadius: '0.5rem'
        }}
      />

      {!isPreview && isEditable && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm opacity-0 
          group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <div className="text-center">
            <UploadCloud className="mx-auto text-white mb-2 w-7 h-7" />
            <UploadImage contentId={contentId} onContentChange={onContentChange} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomImage
