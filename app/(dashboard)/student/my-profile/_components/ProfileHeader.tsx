"use client";

import React from "react";
import { Edit2, Save, X } from "lucide-react";

export type ProfileData = {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
};

type Props = {
  profile: ProfileData;
  isEditing: boolean;
  editData: ProfileData;
  setEditData: (data: ProfileData) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ProfileHeader({
  profile,
  onEdit,
  isEditing,
  onSave,
  onCancel,
  editData,
  setEditData,
}: Props) {
  if (isEditing) {
    return (
      <div className="bg-linear-to-r from-sky-500 to-blue-800 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
          <div className="relative">
            <img
              src={
                editData.avatar ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(editData.name || "User")
              }
              alt="Profile"
              className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-xl"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg text-white font-bold text-lg sm:text-xl md:text-2xl border border-white/70 bg-transparent placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="Your Name"
            />
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg text-white text-base sm:text-lg border border-white/70 bg-transparent placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="Your Title"
            />
            <textarea
              value={editData.bio}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg text-white text-base sm:text-lg border border-white/70 bg-transparent placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              rows={3}
              placeholder="Bio"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={onSave}
                className="px-4 sm:px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center gap-2 transition w-full sm:w-auto text-sm sm:text-base"
              >
                <Save size={18} /> Save
              </button>
              <button
                onClick={onCancel}
                className="px-4 sm:px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center gap-2 transition w-full sm:w-auto text-sm sm:text-base"
              >
                <X size={18} /> Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-r from-sky-500 to-blue-800 rounded-xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 relative z-10">
        <img
          src={
            profile.avatar ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(profile.name || "User")
          }
          alt="Profile"
          className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-xl"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-nowrap items-center gap-2 sm:gap-3">
            <h1 className="flex-1 min-w-0 truncate text-xl sm:text-2xl font-semibold wrap-break-word">
              {profile.name}
            </h1>
            <button
              onClick={onEdit}
              aria-label="Edit Profile"
              className="px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 backdrop-blur transition text-sm sm:text-base shrink-0"
            >
              <Edit2 size={14} />
            </button>
          </div>
          <p className="text-base sm:text-base md:text-lg text-blue-100 mt-1 sm:mt-2 mb-2 sm:mb-3 wrap-break-word">
            {profile.title}
          </p>
          <p className="text-white/90 max-w-full md:max-w-2xl whitespace-pre-wrap wrap-break-word text-sm sm:text-base">
            {profile.bio}
          </p>
        </div>
      </div>
    </div>
  );
}
