import React from 'react';

const StatusBar = ({ left, center, right }) => {
  return (
    <div className="border-t border-current px-3 py-[6px] font-vt text-[13px] flex gap-[14px] opacity-65">
      {left && <span>{left}</span>}
      {center && <span>{center}</span>}
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
};

export default StatusBar;
