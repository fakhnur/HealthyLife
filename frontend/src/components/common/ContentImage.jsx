import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

// Cover image that degrades to a branded placeholder instead of a broken-image icon.
export const ContentImage = ({ src, alt, className = '' }) => {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-gradient-to-br from-[#E2F9F7] to-[#EDF3F2] flex items-center justify-center text-[#27C5B8] ${className}`}
      >
        <Leaf size={32} />
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={className} />;
};
