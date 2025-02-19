"use client";
import * as React from "react";

interface ProgressProps {
  value: number;
  max?: number;
}

export function Progress({ value, max = 100 }: ProgressProps) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}
