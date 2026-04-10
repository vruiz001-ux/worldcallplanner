import { DateTime } from 'luxon';

export function getNow(timezone: string): DateTime {
  return DateTime.now().setZone(timezone);
}

export function convertTime(
  _sourceTimezone: string,
  targetTimezone: string,
  dateTime: DateTime
): DateTime {
  return dateTime.setZone(targetTimezone);
}

export function getTimezoneAbbreviation(timezone: string): string {
  return DateTime.now().setZone(timezone).toFormat('ZZZZ');
}

export function getUtcOffset(timezone: string): string {
  return DateTime.now().setZone(timezone).toFormat('ZZ');
}

export type TimeOfDay = 'business' | 'evening' | 'night' | 'early-morning';

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 8 && hour < 18) return 'business';
  if (hour >= 18 && hour < 22) return 'evening';
  if (hour >= 22 || hour < 5) return 'night';
  return 'early-morning';
}

export function getTimeOfDayLabel(tod: TimeOfDay): string {
  switch (tod) {
    case 'business': return 'Business hours';
    case 'evening': return 'Evening';
    case 'night': return 'Night time';
    case 'early-morning': return 'Early morning';
  }
}

export function getTimeOfDayColor(tod: TimeOfDay): string {
  switch (tod) {
    case 'business': return 'text-emerald-500';
    case 'evening': return 'text-amber-500';
    case 'night': return 'text-indigo-400';
    case 'early-morning': return 'text-sky-400';
  }
}

export function getTimeOfDayBg(tod: TimeOfDay): string {
  switch (tod) {
    case 'business': return 'bg-emerald-500/10';
    case 'evening': return 'bg-amber-500/10';
    case 'night': return 'bg-indigo-500/10';
    case 'early-morning': return 'bg-sky-500/10';
  }
}

export function getDayDifference(base: DateTime, target: DateTime): string {
  const baseDateStr = base.toFormat('yyyy-MM-dd');
  const targetDateStr = target.toFormat('yyyy-MM-dd');

  if (baseDateStr === targetDateStr) return 'Same day';

  const baseDate = DateTime.fromFormat(baseDateStr, 'yyyy-MM-dd');
  const targetDate = DateTime.fromFormat(targetDateStr, 'yyyy-MM-dd');
  const diff = targetDate.diff(baseDate, 'days').days;

  if (diff === 1) return 'Next day';
  if (diff === -1) return 'Previous day';
  if (diff > 0) return `+${diff} days`;
  return `${diff} days`;
}

export function formatTime12(dt: DateTime): string {
  return dt.toFormat('hh:mm a');
}

export function formatTime24(dt: DateTime): string {
  return dt.toFormat('HH:mm');
}

export function formatDate(dt: DateTime): string {
  return dt.toFormat('ccc, dd LLL yyyy');
}

export function createDateTime(
  date: string,
  time: string,
  timezone: string
): DateTime {
  return DateTime.fromFormat(`${date} ${time}`, 'yyyy-MM-dd HH:mm', { zone: timezone });
}
