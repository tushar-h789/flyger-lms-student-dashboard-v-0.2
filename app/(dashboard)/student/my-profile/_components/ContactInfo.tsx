"use client";

import React from "react";
import { Edit2, Mail, Phone, MapPin, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ContactData = {
  email: string;
  phone: string;
  location: string;
};

type Props = {
  contact: ContactData;
  isEditing: boolean;
  editData: ContactData;
  setEditData: (data: ContactData) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ContactInfo({
  contact,
  onEdit,
  isEditing,
  onSave,
  onCancel,
  editData,
  setEditData,
}: Props) {
  console.log("contact", contact);
  if (isEditing) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
        <div className="flex flex-nowrap items-center justify-between gap-2 mb-4">
          <h2 className="flex-1 min-w-0 truncate text-xl sm:text-2xl font-bold text-gray-800">
            Contact Information
          </h2>
          <div className="hidden" />
        </div>
        <div className="space-y-3">
          <input
            type="email"
            value={editData.email}
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
            placeholder="Email"
          />
          <input
            type="tel"
            value={editData.phone}
            onChange={(e) =>
              setEditData({ ...editData, phone: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
            placeholder="Phone"
          />
          <input
            type="text"
            value={editData.location}
            onChange={(e) =>
              setEditData({ ...editData, location: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
            placeholder="Location"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="customButton"
              onClick={onSave}
              // className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full sm:w-auto text-sm sm:text-base"
            >
              <Save size={18} />
            </Button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition w-full sm:w-auto text-sm sm:text-base cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition">
      <div className="flex flex-nowrap items-center justify-between gap-2 mb-4">
        <h2 className="flex-1 min-w-0 truncate text-lg sm:text-xl md:text-xl font-bold text-gray-800">
          Contact Information
        </h2>
        <button
          onClick={onEdit}
          aria-label="Edit Contact Information"
          className="p-2 hover:bg-gray-100 rounded-lg transition shrink-0 cursor-pointer"
        >
          <Edit2 size={16} className="text-blue-600" />
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3 text-gray-700">
          <Mail className="text-blue-600 shrink-0" size={20} />
          <span className="flex-1 min-w-0 wrap-break-word text-sm sm:text-base">
            {contact?.email}
          </span>
        </div>
        {contact?.phone && (
          <div className="flex items-start gap-3 text-gray-700">
            <Phone className="text-blue-600 shrink-0" size={20} />
            <span className="flex-1 min-w-0 wrap-break-word text-sm sm:text-base">
              {contact?.phone}
            </span>
          </div>
        )}
        {contact?.location && (
          <div className="flex items-start gap-3 text-gray-700">
            <MapPin className="text-blue-600 shrink-0" size={20} />
            <span className="flex-1 min-w-0 wrap-break-word text-sm sm:text-base">
              {contact?.location}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
