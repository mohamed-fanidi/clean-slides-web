type ContentBlock = {
  type?: string
  content?: any
  placeholder?: string
  children?: any
}

type Theme = {
  fontFamily?: string
  fontColor?: string
  accentColor?: string
  slideBackgroundColor?: string
}

type Slide = {
  content?: any
}

async function fetchBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Fetch failed for: ${url}`)
    const blob = await res.blob()
    const reader = new FileReader()
    return await new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const result = reader.result as string
        resolve(result.startsWith("data:") ? result : null)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (e) {
    console.warn("Failed image fetch:", url, e)
    return null
  }
}

function extractContentBlocks(content: any): ContentBlock[] {
  if (!content) return []
  if (Array.isArray(content)) return content.flatMap(extractContentBlocks)
  if (typeof content === "object") {
    const nested = extractContentBlocks(content.content || content.children)
    return [content, ...nested]
  }
  return []
}

export async function exportSlidesToPptx(
  slides: Slide[],
  currentTheme: Theme | undefined,
  projectTitle: string
): Promise<void> {
  const pptxgen = (await import("pptxgenjs")).default
  const pres = new pptxgen()

  const theme = {
    fontFamily: currentTheme?.fontFamily?.replace(/['"]+/g, "") || "Arial",
    fontColor: currentTheme?.fontColor || "#000000",
    accentColor: currentTheme?.accentColor || "#0ea5e9",
    slideBackgroundColor: currentTheme?.slideBackgroundColor || "#ffffff",
  }

  const validHex = /^#([A-Fa-f0-9]{6})$/
  const slideBg = validHex.test(theme.slideBackgroundColor)
    ? theme.slideBackgroundColor
    : "#ffffff"

  for (const slide of slides) {
    const s = pres.addSlide()
    s.background = { fill: slideBg }

    const blocks = extractContentBlocks(slide.content)
    let y = 0.5

    if (blocks.length === 0) {
      s.addText("Empty Slide", {
        x: 0.5,
        y,
        w: 9,
        fontSize: 24,
        fontFace: theme.fontFamily,
        color: theme.accentColor,
        bold: true,
      })
      continue
    }

    for (const block of blocks) {
      const text = block.content || block.placeholder || ""

      if (block.type === "heading1") {
        s.addText(text, {
          x: 0.5,
          y,
          w: 9,
          fontSize: 28,
          bold: true,
          fontFace: theme.fontFamily,
          color: theme.fontColor,
        })
        y += 1
      }

      if (block.type === "heading2") {
        s.addText(text, {
          x: 0.5,
          y,
          w: 9,
          fontSize: 24,
          bold: true,
          fontFace: theme.fontFamily,
          color: theme.accentColor,
        })
        y += 0.8
      }

      if (block.type === "paragraph") {
        s.addText(text, {
          x: 0.5,
          y,
          w: 9,
          fontSize: 20,
          fontFace: theme.fontFamily,
          color: theme.fontColor,
        })
        y += 1
      }

      if (
        block.type === "image" &&
        typeof block.content === "string" &&
        block.content.startsWith("http")
      ) {
        const base64 = await fetchBase64(block.content)
        if (base64) {
          s.addImage({ x: 0.5, y, w: 6, h: 3.5, data: base64 })
          y += 4
        } else {
          console.warn("Skipped image:", block.content)
        }
      }
    }
  }

  await pres.writeFile({
    fileName: `${projectTitle}.pptx`,
  })
}
