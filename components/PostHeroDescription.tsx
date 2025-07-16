"use client";
import React, { useState } from "react";

const PostHeroDescription: React.FC<{ description: string }> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="text-md font-sans uppercase text-[#2F2C2C]">
      <p className={isExpanded ? "line-clamp-none" : "line-clamp-2"}>{description}</p>
      <button
        className="mt-2 text-[#EC7A5B] font-mono uppercase text-sm hover:underline transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
};

export default PostHeroDescription;