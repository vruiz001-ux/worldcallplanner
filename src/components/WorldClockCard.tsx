import { DateTime } from 'luxon';
import { AnalogClock } from './AnalogClock';
import { TimezoneSelect } from './TimezoneSelect';
import {
  getTimezoneAbbreviation,
  getUtcOffset,
  getTimeOfDay,
  getTimeOfDayLabel,
  getTimeOfDayColor,
  getTimeOfDayBg,
  formatTime12,
  formatTime24,
  formatDate,
} from '../utils/timeUtils';
import { getCityById } from '../data/timezones';

interface WorldClockCardProps {
  cityId: string;
  dateTime: DateTime;
  onCityChange: (cityId: string) => void;
  excludeCityIds: string[];
  use24h: boolean;
  isBase?: boolean;
  onSetBase?: () => void;
  isDark: boolean;
}

export function WorldClockCard({
  cityId,
  dateTime,
  onCityChange,
  excludeCityIds,
  use24h,
  isBase = false,
  onSetBase,
  isDark,
}: WorldClockCardProps) {
  const city = getCityById(cityId);
  if (!city) return null;

  const tz = city.timezone;
  const localDt = dateTime.setZone(tz);
  const tod = getTimeOfDay(localDt.hour);
  const abbr = getTimezoneAbbreviation(tz);
  const offset = getUtcOffset(tz);

  return (
    <div
      className={`relative rounded-2xl border p-4 flex flex-col items-center gap-3 transition-all ${
        isBase
          ? 'border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-400/30'
          : 'border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'
      } bg-white dark:bg-slate-800`}
    >
      {isBase && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-500 text-white text-[10px] font-semibold rounded-full uppercase tracking-wider">
          Base
        </div>
      )}

      <TimezoneSelect
        selectedCityId={cityId}
        onChange={onCityChange}
        excludeIds={excludeCityIds}
      />

      <AnalogClock
        hours={localDt.hour}
        minutes={localDt.minute}
        seconds={localDt.second}
        size={130}
        isDark={isDark}
      />

      <div className="text-center">
        <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tabular-nums tracking-tight">
          {use24h ? formatTime24(localDt) : formatTime12(localDt)}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {formatDate(localDt)}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-mono">{abbr}</span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="text-slate-400 font-mono">UTC{offset}</span>
      </div>

      <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTimeOfDayBg(tod)} ${getTimeOfDayColor(tod)}`}>
        {getTimeOfDayLabel(tod)}
      </div>

      <div className="text-center">
        <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {city.emoji} {city.city}
        </div>
        <div className="text-[10px] text-slate-400">{city.country}</div>
      </div>

      {!isBase && onSetBase && (
        <button
          onClick={onSetBase}
          className="text-[10px] text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
        >
          Set as base
        </button>
      )}
    </div>
  );
}
