import { DateTime } from 'luxon';
import { getCityById } from '../data/timezones';

interface MeetingOverlapProps {
  cityIds: string[];
  planDate: string;
  planTime: string;
  baseCityIndex: number;
}

export function MeetingOverlap({ cityIds, planDate, planTime, baseCityIndex }: MeetingOverlapProps) {
  const baseCity = getCityById(cityIds[baseCityIndex]);
  if (!baseCity) return null;

  const baseDt = DateTime.fromFormat(`${planDate} ${planTime}`, 'yyyy-MM-dd HH:mm', {
    zone: baseCity.timezone,
  });
  if (!baseDt.isValid) return null;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const cityData = cityIds.map(id => {
    const city = getCityById(id)!;
    const localNow = baseDt.setZone(city.timezone);
    const startOfDay = localNow.startOf('day');
    return { city, startOfDay, offset: localNow.hour };
  });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-5">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
        Meeting Overlap
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        Green blocks = business hours (8 AM – 6 PM). Find the best time for all.
      </p>

      <div className="space-y-2 overflow-x-auto">
        {/* Hour labels */}
        <div className="flex items-center gap-0">
          <div className="w-24 shrink-0" />
          <div className="flex flex-1 min-w-0">
            {hours.filter((_, i) => i % 3 === 0).map(h => (
              <div key={h} className="flex-1 text-[9px] text-slate-400 text-center font-mono" style={{ minWidth: 0 }}>
                {String(h).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>

        {cityData.map(({ city, offset }) => {
          return (
            <div key={city.id} className="flex items-center gap-0">
              <div className="w-24 shrink-0 text-xs text-slate-600 dark:text-slate-300 truncate pr-2 font-medium">
                {city.emoji} {city.city}
              </div>
              <div className="flex flex-1 gap-px min-w-0">
                {hours.map(h => {
                  // Map this hour to local hour at destination
                  const localHour = (h + offset) % 24;
                  const isBusiness = localHour >= 8 && localHour < 18;
                  return (
                    <div
                      key={h}
                      className={`h-5 flex-1 rounded-sm transition-colors ${
                        isBusiness
                          ? 'bg-emerald-400/60 dark:bg-emerald-500/40'
                          : 'bg-slate-100 dark:bg-slate-700'
                      }`}
                      style={{ minWidth: 2 }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Best overlap indicator */}
        <BestOverlap cityIds={cityIds} baseDt={baseDt} />
      </div>
    </div>
  );
}

function BestOverlap({ cityIds, baseDt }: { cityIds: string[]; baseDt: DateTime }) {
  // Find the hour range where most cities have business hours
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const overlapCounts = hours.map(baseHour => {
    const testTime = baseDt.startOf('day').plus({ hours: baseHour });
    let count = 0;
    for (const id of cityIds) {
      const city = getCityById(id);
      if (!city) continue;
      const local = testTime.setZone(city.timezone);
      if (local.hour >= 8 && local.hour < 18) count++;
    }
    return { hour: baseHour, count };
  });

  const maxCount = Math.max(...overlapCounts.map(o => o.count));
  const bestHours = overlapCounts.filter(o => o.count === maxCount);

  if (bestHours.length === 0 || maxCount <= 1) return null;

  const startH = bestHours[0].hour;
  const endH = bestHours[bestHours.length - 1].hour + 1;
  const baseCity = getCityById(cityIds[0]);

  return (
    <div className="mt-3 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
      <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
        Best window: {String(startH).padStart(2, '0')}:00 – {String(endH).padStart(2, '0')}:00 ({baseCity?.city} time)
      </div>
      <div className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-0.5">
        {maxCount} of {cityIds.length} cities in business hours
      </div>
    </div>
  );
}
