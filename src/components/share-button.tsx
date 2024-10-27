import React from "react";
import { FaShareAlt } from "react-icons/fa";

export function Share() {
  return (
    <div id="share-button">
      <button id="share-button-inside"
        className="  w-[90px] h-[50px] bg-[#008074] shadow-lg border-2 border-[#008074] rounded-xl flex items-center justify-center z-20 text-white"
        >
        <FaShareAlt
          className="mr-1 w-4 h-4"
          style={{
            color: "white", // Outline color
            fill: "transparent", // Remove fill
            strokeWidth: 30, // Adjust the thickness of the outline
          }}
        />

        <span>Share</span>
      </button>
    </div>
  );
}
