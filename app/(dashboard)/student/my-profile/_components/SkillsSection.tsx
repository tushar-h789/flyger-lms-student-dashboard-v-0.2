"use client";

import React, { useState } from "react";
import { Award, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SkillItem = { id: number; name: string };

type Props = {
  skills: SkillItem[];
  onAdd: (skill: SkillItem) => void;
  onDelete: (id: number) => void;
};

export function SkillsSection({ skills, onAdd, onDelete }: Props) {
  const [newSkill, setNewSkill] = useState("");

  const handleAdd = () => {
    if (newSkill.trim()) {
      onAdd({ id: Date.now(), name: newSkill.trim() });
      setNewSkill("");
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition">
      <h2 className="text-lg sm:text-xl md:text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Award className="text-green-600 shrink-0" size={20} />
        <span className="wrap-break-word">Skills</span>
      </h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="w-full sm:flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a skill"
        />
        <Button
          variant="customButton"
          onClick={handleAdd}
          // className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full sm:w-auto text-sm sm:text-base"
        >
          <Plus size={18} />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="max-w-full px-3 sm:px-4 py-2 bg-linear-to-r from-sky-500 to-blue-800 text-white rounded-full flex items-center gap-2 hover:shadow-lg transition"
          >
            <span className="wrap-break-word text-sm sm:text-base">
              {skill.name}
            </span>
            <button
              onClick={() => onDelete(skill.id)}
              className="hover:bg-white/20 rounded-full p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
