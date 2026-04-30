import React from 'react';

const TitleBar = ({ path = '/' }) => {
  return (
    <div className="relative h-[18px] border-b border-current titlebar-stripes">
      <div className="absolute left-[5px] top-[3px] w-[10px] h-[10px] border border-current bg-[color:var(--bg)]" />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 font-pixel text-[9px]"
        style={{ background: 'var(--bg)' }}
      >
        ryo.miyata — {path}
      </div>
    </div>
  );
};

export default TitleBar;
