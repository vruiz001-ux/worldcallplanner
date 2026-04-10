import { useMemo } from 'react';

interface AnalogClockProps {
  hours: number;
  minutes: number;
  seconds: number;
  size?: number;
  isDark?: boolean;
}

export function AnalogClock({ hours, minutes, seconds, size = 140, isDark = false }: AnalogClockProps) {
  const center = size / 2;
  const radius = size / 2 - 8;

  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  const hourHand = useMemo(() => {
    const len = radius * 0.5;
    const rad = ((hourAngle - 90) * Math.PI) / 180;
    return { x: center + len * Math.cos(rad), y: center + len * Math.sin(rad) };
  }, [hourAngle, center, radius]);

  const minuteHand = useMemo(() => {
    const len = radius * 0.7;
    const rad = ((minuteAngle - 90) * Math.PI) / 180;
    return { x: center + len * Math.cos(rad), y: center + len * Math.sin(rad) };
  }, [minuteAngle, center, radius]);

  const secondHand = useMemo(() => {
    const len = radius * 0.78;
    const rad = ((secondAngle - 90) * Math.PI) / 180;
    return { x: center + len * Math.cos(rad), y: center + len * Math.sin(rad) };
  }, [secondAngle, center, radius]);

  const hourMarkers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = ((i * 30 - 90) * Math.PI) / 180;
      const inner = radius - 8;
      const outer = radius - 2;
      return {
        x1: center + inner * Math.cos(angle),
        y1: center + inner * Math.sin(angle),
        x2: center + outer * Math.cos(angle),
        y2: center + outer * Math.sin(angle),
      };
    });
  }, [center, radius]);

  const minuteMarkers = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      if (i % 5 === 0) return null;
      const angle = ((i * 6 - 90) * Math.PI) / 180;
      const inner = radius - 4;
      const outer = radius - 2;
      return {
        x1: center + inner * Math.cos(angle),
        y1: center + inner * Math.sin(angle),
        x2: center + outer * Math.cos(angle),
        y2: center + outer * Math.sin(angle),
      };
    }).filter(Boolean);
  }, [center, radius]);

  const faceColor = isDark ? '#1e293b' : '#ffffff';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const markerColor = isDark ? '#94a3b8' : '#64748b';
  const hourColor = isDark ? '#f1f5f9' : '#1e293b';
  const minuteColor = isDark ? '#cbd5e1' : '#334155';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Face */}
      <circle cx={center} cy={center} r={radius} fill={faceColor} stroke={borderColor} strokeWidth="2" />

      {/* Minute markers */}
      {minuteMarkers.map((m, i) => (
        <line key={`m${i}`} x1={m!.x1} y1={m!.y1} x2={m!.x2} y2={m!.y2} stroke={markerColor} strokeWidth="0.5" strokeOpacity="0.4" />
      ))}

      {/* Hour markers */}
      {hourMarkers.map((m, i) => (
        <line key={`h${i}`} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} stroke={markerColor} strokeWidth="1.5" strokeLinecap="round" />
      ))}

      {/* Hour hand */}
      <line x1={center} y1={center} x2={hourHand.x} y2={hourHand.y} stroke={hourColor} strokeWidth="3" strokeLinecap="round" />

      {/* Minute hand */}
      <line x1={center} y1={center} x2={minuteHand.x} y2={minuteHand.y} stroke={minuteColor} strokeWidth="2" strokeLinecap="round" />

      {/* Second hand */}
      <line x1={center} y1={center} x2={secondHand.x} y2={secondHand.y} stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />

      {/* Center dot */}
      <circle cx={center} cy={center} r="3" fill="#ef4444" />
      <circle cx={center} cy={center} r="1.5" fill={faceColor} />
    </svg>
  );
}
