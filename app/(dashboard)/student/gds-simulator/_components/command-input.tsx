"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { CommandParser } from "@/lib/gds/command-parser";
import { CommandResult, Flight } from "@/lib/types/gds.type";

interface CommandInputProps {
  onCommandSubmit: (result: CommandResult) => void;
  selectedCommand: string;
  availableFlights?: Flight[];
}

export function CommandInput({
  onCommandSubmit,
  selectedCommand,
  availableFlights = [],
}: CommandInputProps) {
  const [command, setCommand] = useState("");

  useEffect(() => {
    if (selectedCommand) {
      setCommand(selectedCommand);
    }
  }, [selectedCommand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const result = CommandParser.parse(command, availableFlights);
    onCommandSubmit(result);
    setCommand("");
  };

  return (
    <div className="bg-slate-800 p-3 sm:p-4 border-b border-slate-700 shadow-lg">
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
        <div className="flex-1 relative min-w-0">
          <Input
            // TODO: click copy button then value will be copied to the input
            // value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="TYPE COMMAND HERE"
            className="w-full bg-slate-700 border-slate-600 text-slate-100 font-mono uppercase placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
        <Button
          type="submit"
          variant="customButton"
          // className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 font-medium shadow-sm shrink-0"
        >
          <Send className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}
