import React from 'react';

/* Deterministic decorative QR pattern (demo stand-in for a real QR code) */
const QrPattern = ({ seed, size = 168, className = 'fill-stone-900' }) => {
  const modules = 21;
  const cell = size / modules;
  const hash = (x, y) => {
    let h = 0;
    const s = `${seed}:${x}:${y}`;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h) % 100 < 48;
  };
  const inFinder = (x, y) =>
    (x < 7 && y < 7) || (x >= modules - 7 && y < 7) || (x < 7 && y >= modules - 7);

  const cells = [];
  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      if (!inFinder(x, y) && hash(x, y)) {
        cells.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} />);
      }
    }
  }

  const Finder = ({ ox, oy }) => (
    <g>
      <rect x={ox * cell} y={oy * cell} width={cell * 7} height={cell * 7} />
      <rect x={(ox + 1) * cell} y={(oy + 1) * cell} width={cell * 5} height={cell * 5} fill="white" />
      <rect x={(ox + 2) * cell} y={(oy + 2) * cell} width={cell * 3} height={cell * 3} />
    </g>
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      {cells}
      <Finder ox={0} oy={0} />
      <Finder ox={modules - 7} oy={0} />
      <Finder ox={0} oy={modules - 7} />
    </svg>
  );
};

export default QrPattern;
