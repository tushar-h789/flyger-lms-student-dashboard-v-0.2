"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Plus,
  Save,
  X,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type EducationItem = {
  id: number;
  degree: string;
  institution: string;
  year: string;
  gpa: string;
};

type Props = {
  education: EducationItem[];
  onAdd: (edu: EducationItem) => void;
  onEdit: (id: number, data: Omit<EducationItem, "id">) => void;
  onDelete: (id: number) => void;
};

export function EducationSection({
  education,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<EducationItem, "id">>({
    degree: "",
    institution: "",
    year: "",
    gpa: "",
  });

  const handleSave = () => {
    if (editingId) {
      onEdit(editingId, formData);
      setEditingId(null);
    } else {
      onAdd({ ...formData, id: Date.now() });
      setIsAdding(false);
    }
    setFormData({ degree: "", institution: "", year: "", gpa: "" });
  };

  const handleEdit = (edu: EducationItem) => {
    setEditingId(edu.id);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year,
      gpa: edu.gpa,
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition">
      <div className="flex flex-nowrap items-center justify-between gap-2 mb-6">
        <h2 className="flex-1 min-w-0 truncate text-lg sm:text-xl md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <GraduationCap className="text-blue-600 shrink-0" />
          <span>Education</span>
        </h2>
        <Button
          variant="customButton"
          onClick={() => setIsAdding(true)}
          // className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition w-auto text-sm sm:text-base shrink-0 cursor-pointer"
        >
          <Plus size={18} /> <span className="hidden sm:inline">Add</span>
        </Button>
      </div>

      {(isAdding || editingId) && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg space-y-3">
          <input
            type="text"
            value={formData.degree}
            onChange={(e) =>
              setFormData({ ...formData, degree: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
            placeholder="Degree (e.g., B.Sc in Computer Science)"
          />
          <input
            type="text"
            value={formData.institution}
            onChange={(e) =>
              setFormData({ ...formData, institution: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
            placeholder="Institution Name"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
              placeholder="Year (e.g., 2020-2024)"
            />
            <input
              type="text"
              value={formData.gpa}
              onChange={(e) =>
                setFormData({ ...formData, gpa: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
              placeholder="GPA/CGPA"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="customButton"
              onClick={handleSave}
              // className="px-4 py-2  text-white rounded-lg bg-linear-to-r from-sky-500 to-blue-800 hover:bg-linear-to-l hover:from-blue-800 hover:to-sky-500  hover:bg-blue-800 transition w-full sm:w-auto text-sm sm:text-base cursor-pointer"
            >
              <Save size={18} />
            </Button>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ degree: "", institution: "", year: "", gpa: "" });
              }}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition w-full sm:w-auto text-sm sm:text-base cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="p-4 border-l-4 border-blue-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-nowrap items-center justify-between gap-2">
                <h3 className="flex-1 min-w-0 truncate text-lg sm:text-xl font-semibold text-gray-800 wrap-break-word">
                  {edu.degree}
                </h3>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                  >
                    <Edit2 size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => onDelete(edu.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 wrap-break-word text-sm sm:text-base">
                {edu.institution}
              </p>
              <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={16} /> {edu.year}
                </span>
                <span className="font-medium text-blue-600">
                  GPA: {edu.gpa}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
