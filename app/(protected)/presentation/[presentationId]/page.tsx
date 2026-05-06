'use client';

import { getProjectById } from '@/actions/project';
import { themes } from '@/lib/constants';
import { useSlideStore } from '@/store/use-slide-store';
import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dynamic from 'next/dynamic';


const Navbar = dynamic(() => import('@/components/global/presentation/navbar/navbar'), { ssr: false });

import LayoutPreview from '@/components/global/presentation/left-sidebar/layout-preview'
import Editor from '@/components/global/presentation/editor/editor';
import EditorSidebar from '@/components/global/presentation/right-sidebar';



const Page = () => {
  const { setSlides, setProject, currentTheme, setCurrentTheme } = useSlideStore();
  const { setTheme } = useTheme();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProjectById(params.presentationId as string);

        if (res.status !== 200 || !res.data) {
          toast.error('Error', { description: 'Unable to fetch project' });
          redirect('/dashboard');
        }

        const foundTheme = themes.find((theme) => theme.name === res.data.themeName);
        const finalTheme = foundTheme || themes[0];

        setCurrentTheme(finalTheme);
        setTheme(finalTheme.type === 'dark' ? 'dark' : 'light');
        setProject(res.data);
        setSlides(JSON.parse(JSON.stringify(res.data.slides)));
      } catch (error) {
        toast.error('Error', {
          description: 'An unexpected error occurred',
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: currentTheme.backgroundColor,
          fontFamily: currentTheme.fontFamily,
        }}
      >
        <Navbar presentationId={params.presentationId as string} />

        {/* Main Layout */}
        <div className="flex-1 flex pt-20 overflow-hidden">
          <LayoutPreview />

          {/* Editor Area - responsive margin */}
          <div className="flex-1 px-4 sm:ml-80 sm:pr-16">
            <Editor isEditable={true} />
          </div>

          {/* Right Sidebar (optional) */}
          <EditorSidebar />
        </div>
      </div>
    </DndProvider>
  );
};

export default Page;
