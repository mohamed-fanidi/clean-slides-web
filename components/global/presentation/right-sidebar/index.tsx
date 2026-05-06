'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutTemplate, Type, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSlideStore } from '@/store/use-slide-store';
import { component } from '@/lib/constants';
import LayoutChooser from './tabs/layout-chooser';
import ThemeChooser from './tabs/theme-chooser';
import ComponentCard from './tabs/components-tab/component-preview';

type TabType = 'layout' | 'component' | 'theme' | null;

const EditorSidebar = () => {
  const { currentTheme } = useSlideStore();
  const [activeTab, setActiveTab] = useState<TabType>(null);

  const handleTabToggle = (tabName: TabType) => {
    setActiveTab((prev) => (prev === tabName ? null : tabName));
  };

  return (
    <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50">
      <div className="rounded-xl border shadow-lg p-3 bg-white dark:bg-zinc-900 flex flex-col items-center space-y-4">
        
        {/* Layout Button */}
        <Popover onOpenChange={(open) => handleTabToggle(open ? 'layout' : null)}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-10 w-10 rounded-full transition-all hover:bg-accent hover:text-accent-foreground',
                activeTab === 'layout' && 'ring-2 ring-blue-500'
              )}
            >
              <LayoutTemplate className="h-5 w-5" />
              <span className="sr-only">Choose Layout</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="center"
            className="w-[90vw] max-w-120 p-0"
          >
            <LayoutChooser />
          </PopoverContent>
        </Popover>

        {/* Components Button */}
        <Popover onOpenChange={(open) => handleTabToggle(open ? 'component' : null)}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-10 w-10 rounded-full transition-all hover:bg-accent hover:text-accent-foreground',
                activeTab === 'component' && 'ring-2 ring-blue-500'
              )}
            >
              <Type className="h-5 w-5" />
              <span className="sr-only">Add Components</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="center"
            className="w-[90vw] max-w-120 p-0"
            style={{
              backgroundColor: currentTheme.backgroundColor,
              color: currentTheme.fontColor,
            }}
          >
            <ScrollArea className="h-100">
              <div className="p-5 flex flex-col space-y-6">
                {component.map((group, idx) => (
                  <div className="space-y-2" key={idx}>
                    <h3 className="text-sm font-medium text-muted-foreground px-1">
                      {group.name}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {group.components.map((item) => (
                        <ComponentCard key={item.componentType} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Theme Button */}
        <Popover onOpenChange={(open) => handleTabToggle(open ? 'theme' : null)}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-10 w-10 rounded-full transition-all hover:bg-accent hover:text-accent-foreground',
                activeTab === 'theme' && 'ring-2 ring-blue-500'
              )}
            >
              <Palette className="h-5 w-5" />
              <span className="sr-only">Theme Chooser</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" align="center" className="w-[90vw] max-w-[320px]">
            <ThemeChooser />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default EditorSidebar;
