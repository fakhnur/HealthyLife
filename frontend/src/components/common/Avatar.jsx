import React, { useState } from 'react';
import { initialsOf } from '../../utils/format';

// Image avatar with an initials fallback (no third-party placeholder photos).
export const Avatar = ({ src, name, className = 'w-9 h-9 text-[12px]' }) => {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name || ''}
        onError={() => setFailed(true)}
        className={`rounded-full object-cover border border-[#E5E7EB] shrink-0 ${className}`}
      />
    );
  }
  return (
    <div
      className={`rounded-full bg-[#E6F7F5] text-[#15877F] font-bold flex items-center justify-center shrink-0 ${className}`}
    >
      {initialsOf(name)}
    </div>
  );
};
