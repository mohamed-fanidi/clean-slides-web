'use client';

import { Button } from '@/components/ui/button';
import { useSlideStore } from '@/store/use-slide-store';
import { Home, Play, Share } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import PresentationMode from './presentation-mode';


type Props = {
  presentationId: string;
};

async function fetchBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
if (!res.ok) throw new Error(`Fetch failed for: ${url}`);
const blob = await res.blob();
    const reader = new FileReader();
    return await new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.startsWith('data:') ? result : null);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn('Failed image fetch:', url, e);
    return null;
  }
}

function extractContentBlocks(content: any): any[] {
  if (!content) return [];
  if (Array.isArray(content)) return content.flatMap(extractContentBlocks);
  if (typeof content === 'object') {
    const nested = extractContentBlocks(content.content || content.children);
    return [content, ...nested];
  }
  return [];
}

const Navbar = ({ presentationId }: Props) => {
  const { slides, currentTheme } = useSlideStore();
  const [isPresMode, setPresMode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/share/${presentationId}`);
    toast.success('Link Copied');
  };

  const handleDownload = async () => {
  const pptxgen = (await import('pptxgenjs')).default; // ✅ dynamic import
  const pres = new pptxgen();

  const theme = {
    fontFamily: currentTheme?.fontFamily?.replace(/['"]+/g, '') || 'Arial',
    fontColor: currentTheme?.fontColor || '#000000',
    accentColor: currentTheme?.accentColor || '#0ea5e9',
    slideBackgroundColor: currentTheme?.slideBackgroundColor || '#ffffff',
  };

  const validHex = /^#([A-Fa-f0-9]{6})$/;
  const slideBg = validHex.test(theme.slideBackgroundColor)
    ? theme.slideBackgroundColor
    : '#ffffff';

  for (const slide of slides) {
    const s = pres.addSlide();
    s.background = { fill: slideBg };

    const blocks = extractContentBlocks(slide.content);
    let y = 0.5;

    if (blocks.length === 0) {
      s.addText('Empty Slide', {
        x: 0.5,
        y,
        w: 9,
        fontSize: 24,
        fontFace: theme.fontFamily,
        color: theme.accentColor,
        bold: true,
      });
      continue;
    }

    for (const block of blocks) {
      const text = block.content || block.placeholder || '';

      if (block.type === 'heading1') {
        s.addText(text, {
          x: 0.5,
          y,
          w: 9,
          fontSize: 28,
          bold: true,
          fontFace: theme.fontFamily,
          color: theme.fontColor,
        });
        y += 1;
      }

      if (block.type === 'heading2') {
        s.addText(text, {
          x: 0.5,
          y,
          w: 9,
          fontSize: 24,
          bold: true,
          fontFace: theme.fontFamily,
          color: theme.accentColor,
        });
        y += 0.8;
      }

      if (block.type === 'paragraph') {
        s.addText(text, {
          x: 0.5,
          y,
          w: 9,
          fontSize: 20,
          fontFace: theme.fontFamily,
          color: theme.fontColor,
        });
        y += 1;
      }

      if (
        block.type === 'image' &&
        typeof block.content === 'string' &&
        block.content.startsWith('http')
      ) {
        const base64 = await fetchBase64(block.content);
        if (base64) {
          s.addImage({
            x: 0.5,
            y,
            w: 6,
            h: 3.5,
            data: base64,
          });
          y += 4;
        } else {
          console.warn('Skipped image:', block.content);
        }
      }
    }
  }

  await pres.writeFile({ fileName: 'Vivid_Presentation.pptx' });
};


  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 w-full h-20 flex justify-between items-center px-7 border-b"
      style={{
        backgroundColor: currentTheme?.navbarColor || currentTheme?.backgroundColor,
        color: currentTheme?.accentColor,
      }}
    >
      <Link href="/dashboard">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          style={{ backgroundColor: currentTheme?.backgroundColor }}
        >
          <Home />
          <span className="hidden sm:inline">Return Home</span>
        </Button>
      </Link>

      <Link href="/presentation/template-market" className="hidden sm:block text-lg font-semibold">
        Presentation Editor
      </Link>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          style={{ backgroundColor: currentTheme?.backgroundColor }}
          onClick={handleCopy}
        >
          <Share />
        </Button>

        <Button
          onClick={handleDownload}
          className="bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-md hover:scale-[1.03] transition-all duration-200"
        >
          Download PPT
        </Button>

        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={() => setPresMode(true)}
        >
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">Present</span>
        </Button>
      </div>

      {isPresMode && <PresentationMode onClose={() => setPresMode(false)} />}
    </nav>
  );
};

export default Navbar;
