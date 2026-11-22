import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';

interface ResilientImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-contain',
  fallbackTitle,
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#86868B] p-4 text-center select-none"
        role="img"
        aria-label={alt}
      >
        <Smartphone className="w-8 h-8 mb-2 opacity-60" strokeWidth={1.5} />
        <span className="text-[11px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] line-clamp-2">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
};
