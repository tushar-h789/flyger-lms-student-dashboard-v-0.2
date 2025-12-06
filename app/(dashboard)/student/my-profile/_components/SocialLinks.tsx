"use client";

import React, { useState } from "react";
import {
  Edit2,
  Save,
  X,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type SocialLinksData = {
  github?: string;
  linkedin?: string;
  website?: string;
};

type Props = {
  links: SocialLinksData;
  onUpdate: (links: SocialLinksData) => void;
};

export function SocialLinks({ links, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [editLinks, setEditLinks] = useState<SocialLinksData>(links);

  const handleSave = () => {
    onUpdate(editLinks);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition">
      <div className="flex flex-nowrap items-center justify-between gap-2 mb-4">
        <h2 className="flex-1 min-w-0 truncate text-lg sm:text-xl md:text-xl font-bold text-gray-800">
          Social Links
        </h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            aria-label="Edit Social Links"
            className="p-2 hover:bg-gray-100 rounded-lg transition shrink-0 cursor-pointer"
          >
            <Edit2 size={16} className="text-blue-600" />
          </button>
        )}
      </div>
      {editing ? (
        <div className="space-y-3">
          <input
            type="url"
            value={editLinks.github || ""}
            onChange={(e) =>
              setEditLinks({ ...editLinks, github: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
            placeholder="GitHub URL"
          />
          <input
            type="url"
            value={editLinks.linkedin || ""}
            onChange={(e) =>
              setEditLinks({ ...editLinks, linkedin: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
            placeholder="LinkedIn URL"
          />
          <input
            type="url"
            value={editLinks.website || ""}
            onChange={(e) =>
              setEditLinks({ ...editLinks, website: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 "
            placeholder="Website URL"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="customButton"
              onClick={handleSave}
              // className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full sm:w-auto text-sm sm:text-base"
            >
              <Save size={18} />
            </Button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition w-full sm:w-auto text-sm sm:text-base cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {links.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
            >
              <Github size={20} className="shrink-0" />
              <span className="flex-1 min-w-0 wrap-break-word text-sm sm:text-base">
                GitHub
              </span>
              <ExternalLink size={16} className="ml-3 shrink-0" />
            </a>
          )}
          {links.linkedin && (
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
            >
              <Linkedin size={20} className="shrink-0" />
              <span className="flex-1 min-w-0 wrap-break-word text-sm sm:text-base">
                LinkedIn
              </span>
              <ExternalLink size={16} className="ml-3 shrink-0" />
            </a>
          )}
          {links.website && (
            <a
              href={links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
            >
              <Globe size={20} className="shrink-0" />
              <span className="flex-1 min-w-0 wrap-break-word text-sm sm:text-base">
                Portfolio
              </span>
              <ExternalLink size={16} className="ml-3 shrink-0" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
