'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface GitHubButtonProps {
  repoUrl: string;
  className?: string;
}

export function GitHubButton({ repoUrl, className }: GitHubButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-center justify-center rounded-xl border border-border bg-muted/50 hover:bg-muted transition-all text-foreground
  w-9 h-9 md:h-10 md:w-auto md:gap-2 md:px-4 ${className ?? ''}`}
    >
      <Star
        className={`w-4 h-4 transition-all duration-200 ${isHovered ? 'fill-white text-white' : ''}`}
      />
      {/* Text only on desktop */}
      <span className="hidden md:inline text-sm font-medium">GitHub</span>
    </a>
  );
}