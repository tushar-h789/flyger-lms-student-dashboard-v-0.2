"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Save,
  X,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type ExperienceItem = {
  id: number;
  title: string;
  company: string;
  duration: string;
  description: string;
};

type Props = {
  experience: ExperienceItem[];
  onAdd: (exp: ExperienceItem) => void;
  onEdit: (id: number, data: Omit<ExperienceItem, "id">) => void;
  onDelete: (id: number) => void;
};

export function ExperienceSection({
  experience,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<ExperienceItem, "id">>({
    title: "",
    company: "",
    duration: "",
    description: "",
  });

  const handleSave = () => {
    if (editingId) {
      onEdit(editingId, formData);
      setEditingId(null);
    } else {
      onAdd({ ...formData, id: Date.now() });
      setIsAdding(false);
    }
    setFormData({ title: "", company: "", duration: "", description: "" });
  };

  const handleEdit = (exp: ExperienceItem) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      company: exp.company,
      duration: exp.duration,
      description: exp.description,
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition">
      <div className="flex flex-nowrap items-center justify-between gap-2 mb-6">
        <h2 className="flex-1 min-w-0 truncate text-lg sm:text-xl md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <Briefcase className="text-purple-600 shrink-0" />
          <span>Experience</span>
        </h2>
        <Button
          variant="customButton"
          onClick={() => setIsAdding(true)}
          // className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 transition w-full sm:w-auto"
        >
          <Plus size={18} /> <span className="hidden sm:inline">Add</span>
        </Button>
      </div>

      {(isAdding || editingId) && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg space-y-3">
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Job Title"
          />
          <input
            type="text"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Company Name"
          />
          <input
            type="text"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Duration (e.g., Jan 2023 - Present)"
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            placeholder="Job Description"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="customButton"
              onClick={handleSave}
              // className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full sm:w-auto"
            >
              <Save size={18} />
            </Button>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({
                  title: "",
                  company: "",
                  duration: "",
                  description: "",
                });
              }}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition w-full sm:w-auto cursor-pointer text-sm sm:text-base"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {experience.map((exp) => (
          <div
            key={exp.id}
            className="p-4 border-l-4 border-purple-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-nowrap items-center justify-between gap-2">
                <h3 className="flex-1 min-w-0 truncate text-lg sm:text-xl font-semibold text-gray-800">
                  {exp.title}
                </h3>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 hover:bg-purple-100 rounded-lg transition cursor-pointer"
                  >
                    <Edit2 size={16} className="text-purple-600" />
                  </button>
                  <button
                    onClick={() => onDelete(exp.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
              <p className="text-purple-600 font-medium wrap-break-word text-sm sm:text-base">
                {exp.company}
              </p>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <Calendar size={16} /> {exp.duration}
              </p>
              <p className="text-gray-600 mt-2 wrap-break-word text-sm sm:text-base">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
