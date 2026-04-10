import { DateTime } from 'luxon';
import { getCityById, type CityTimezone } from '../data/timezones';
import {
  convertTime,
  getDayDifference,
  getTimeOfDay,
  getTimeOfDayColor,
  getTimeOfDayBg,
  formatTime12,
  formatTime24,
  formatDate,
} from '../utils/timeUtils';

// Generate 30-min time slots for the dropdown
const TIME_SLOTS: { value: string; label12: string; label24: string }[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of [0, 30]) {
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const value = `${hh}:${mm}`;
    const label24 = value;
    const period = h < 12 ? 'AM' : 'PM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const label12 = `${h12}:${mm} ${period}`;
    TIME_SLOTS.push({ value, label12, label24 });
  }
}

interface CallPlannerProps {
  cityIds: string[];
  baseCityIndex: number;
  onBaseChange: (index: number) => void;
  planDate: string;
  planTime: string;
  onPlanDateChange: (date: string) => void;
  onPlanTimeChange: (time: string) => void;
  use24h: boolean;
  onCopy: () => void;
}

export function CallPlanner({
  cityIds,
  baseCityIndex,
  onBaseChange,
  planDate,
  planTime,
  onPlanDateChange,
  onPlanTimeChange,
  use24h,
  onCopy,
}: CallPlannerProps) {
  const baseCity = getCityById(cityIds[baseCityIndex]);
  if (!baseCity) return null;

  const baseDt = DateTime.fromFormat(`${planDate} ${planTime}`, 'yyyy-MM-dd HH:mm', {
    zone: baseCity.timezone,
  });
  const isValid = baseDt.isValid;

  const conversions = cityIds
    .map((id, idx) => {
      if (idx === baseCityIndex) return null;
      const city = getCityById(id);
      if (!city) return null;
      const converted = convertTime(baseCity.timezone, city.timezone, baseDt);
      return { city, converted, idx };
    })
    .filter(Boolean) as { city: CityTimezone; converted: DateTime; idx: number }[];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Call Planning
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Set a time in your base location to see it everywhere
          </p>
        </div>
        <button
          onClick={onCopy}
          className="px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
        >
          Copy summary
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
            Base location
          </label>
          <select
            value={baseCityIndex}
            onChange={e => onBaseChange(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-400"
          >
            {cityIds.map((id, idx) => {
              const c = getCityById(id);
              return (
                <option key={id} value={idx}>
                  {c?.city} ({c?.region})
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
            Date
          </label>
          <input
            type="date"
            value={planDate}
            onChange={e => onPlanDateChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
            Meeting time
          </label>
          <select
            value={planTime}
            onChange={e => onPlanTimeChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-400"
          >
            {TIME_SLOTS.map(slot => (
              <option key={slot.value} value={slot.value}>
                {use24h ? slot.label24 : slot.label12}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isValid && (
        <div className="space-y-1.5">
          {/* Base city */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {baseCity.city}
              </div>
              <div className="text-[10px] text-slate-400">{baseCity.region}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 tabular-nums">
                {use24h ? formatTime24(baseDt) : formatTime12(baseDt)}
              </div>
              <div className="text-[10px] text-slate-400">{formatDate(baseDt)}</div>
            </div>
            <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-1.5 py-0.5 rounded">
              BASE
            </span>
          </div>

          {/* Converted cities */}
          {conversions.map(({ city, converted }) => {
            const tod = getTimeOfDay(converted.hour);
            const dayDiff = getDayDifference(baseDt, converted);
            return (
              <div
                key={city.id}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {city.city}
                  </div>
                  <div className="text-[10px] text-slate-400">{city.region}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 tabular-nums">
                    {use24h ? formatTime24(converted) : formatTime12(converted)}
                  </div>
                  <div className="text-[10px] text-slate-400">{formatDate(converted)}</div>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${getTimeOfDayBg(tod)} ${getTimeOfDayColor(tod)}`}>
                    {tod === 'business' ? 'OK' : tod === 'evening' ? 'Late' : 'Sleep'}
                  </span>
                  {dayDiff !== 'Same day' && (
                    <span className="text-[9px] font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {dayDiff}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
