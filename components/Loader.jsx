"use client";
import { useEffect, useRef, useState } from "react";

const Loader = ({ audioLevel }) => {
  return (
    <div className="flex gap-1 h-10 items-end">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="w-2 bg-purple-500 rounded-full transition-all duration-100"
          style={{
            height: `${Math.max(5, audioLevel * (index + 1) * 3)}px`,
          }}
        />
      ))}
    </div>
  );
};

export default Loader;
