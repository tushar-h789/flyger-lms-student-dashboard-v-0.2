"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { commandsData } from "@/lib/gds/mock-data";
import { Copy, ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CommandSidebarProps {
  onCommandSelect: (command: string) => void;
}

export function CommandSidebar({ onCommandSelect }: CommandSidebarProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const handleCopy = (example: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(example);
    onCommandSelect(example);
  };

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="overflow-y-auto w-full lg:w-64 xl:w-80 bg-slate-800 lg:border-l border-slate-700 flex flex-col h-auto lg:h-screen max-h-[400px] lg:max-h-none">
      <div className="p-3 sm:p-4 bg-slate-800 border-b border-slate-700">
        <h2 className="text-sm sm:text-base font-semibold text-slate-100">
          Command Helper
        </h2>
        <p className="text-xs text-slate-400 mt-1">Click on commands to use</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {commandsData.map((cmd, index) => (
            <Collapsible
              key={index}
              open={openItems.includes(index)}
              onOpenChange={() => toggleItem(index)}
            >
              <div className="border-b border-slate-700">
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-2 sm:p-3 hover:bg-slate-700 transition-colors">
                    <div className="flex items-center gap-2 flex-1 text-left">
                      {openItems.includes(index) ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className="text-sm font-medium text-slate-100">
                        {cmd.title}
                      </span>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className=" px-2 sm:px-3 pb-2 sm:pb-3 bg-slate-900/50 space-y-2 text-wrap">
                    <div className="max-w-[280px] overflow-x-auto text-xs text-slate-300 leading-relaxed text-wrap">
                      {cmd.description}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">
                        Format:
                      </div>
                      <div className="max-w-[300px] overflow-x-auto text-wrap bg-slate-900 p-2 rounded border border-slate-700 font-mono text-xs text-slate-200 uppercase">
                        {cmd.format}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">
                        Example:
                      </div>
                      <div className="max-w-[280px] overflow-x-auto relative ">
                        <div className=" overflow-x-auto text-wrap bg-slate-950 p-2 pr-8 rounded border border-slate-700 font-mono text-xs text-green-400 whitespace-pre">
                          {cmd.example}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleCopy(cmd.example, e)}
                          className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-slate-700 text-slate-400 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
