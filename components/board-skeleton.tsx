// src/components/BoardSkeleton.tsx
import React from "react";

const columnTitles = ["Applied", "Interviewing", "Offer", "Rejected"];

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {columnTitles.map((t) => (
        <div key={t} className="w-64 bg-gray-50 animate-pulse rounded-lg shadow-sm">
          <div className="h-12 mb-4 bg-gray-100 rounded animate-pulse" />
          <div className="space-y-4 pb-4">
            <div className="h-40" />
            <div className="h-40" />
          </div>
        </div>
      ))}
    </div>
  );
}
