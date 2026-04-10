import { DateTime } from 'luxon';
import { AnalogClock } from './AnalogClock';
import { TimezoneSelect } from './TimezoneSelect';
import {
  getTimezoneAbbreviation,
  getTimeOfDay,
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
  use24h: boolean;
  isBase?: boolean;
  onSetBase?: () => void;
  isDark: boolean;
}

export function WorldClockCard({
  cityId,
  dateTime,
  onCityChange,
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

  return (
    <div
      className={`relative rounded-2xl border p-2 sm:p-3 flex flex-col items-center gap-1.5 sm:gap-2 transition-all ${
        isBase
          ? 'border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/10'
          : 'border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'
      } bg-white dark:bg-slate-800`}
    >
      {isBase && (
        <div className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-semibold rounded-full uppercase tracking-wider">
          Base
        </div>
      )}

      <TimezoneSelect selectedCityId={cityId} onChange={onCityChange} />

      <div className="w-[80px] h-[80px] sm:w-[110px] sm:h-[110px]">
        <AnalogClock
          hours={localDt.hour}
          minutes={localDt.minute}
          seconds={localDt.second}
          isDark={isDark}
        />
      </div>

      <div className="text-center">
        <div className="text-base sm:text-xl font-semibold text-slate-800 dark:text-slate-100 tabular-nums">
          {use24h ? formatTime24(localDt) : formatTime12(localDt)}
        </div>
        <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">{formatDate(localDt)}</div>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">{abbr}</span>
        <span className={`text-[8px] sm:text-[9px] font-medium px-1.5 py-0.5 rounded-full ${getTimeOfDayBg(tod)} ${getTimeOfDayColor(tod)}`}>
          {localDt.hour >= 8 && localDt.hour < 18 ? '●' : '○'} {tod === 'business' ? 'OK' : tod === 'evening' ? 'Late' : 'Sleep'}
        </span>
      </div>

      {!isBase && onSetBase && (
        <button
          onClick={onSetBase}
          className="text-[9px] text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors opacity-50 hover:opacity-100"
        >
          Set as base
        </button>
      )}
    </div>
  );
}
