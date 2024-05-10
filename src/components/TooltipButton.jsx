import React, { useState } from "react";
import { FaWpforms } from "react-icons/fa";

const TooltipButton = ({ items, navigate, message }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        className="focus:outline-none"
        onClick={() => {
          navigate(`assignment/${items._id}`);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FaWpforms size={24} className="text-blue-900 hover:text-blue-600" />
      </button>
      {showTooltip && (
        <div className="absolute z-10 bg-black text-white py-1 px-2 rounded-md text-sm bottom-full left-1/2 transform -translate-x-1/2">
          {message}
        </div>
      )}
    </div>
  );
};

export default TooltipButton;
