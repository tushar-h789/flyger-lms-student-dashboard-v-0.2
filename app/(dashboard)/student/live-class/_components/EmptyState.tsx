"use client";

import { Video } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Class Selected
      </h3>
      <p className="text-gray-500">
        Select a class from the list to view details and join the session.
      </p>
    </div>
  );
}
