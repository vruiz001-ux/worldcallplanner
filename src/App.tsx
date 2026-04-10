import { useState, useEffect, useCallback } from 'react';
import { DateTime } from 'luxon';
import { Header } from './components/Header';
import { WorldClockCard } from './components/WorldClockCard';
import { CallPlanner } from './components/CallPlanner';
import { MeetingOverlap } from './components/MeetingOverlap';
import { DEFAULT_CITY_IDS, getCityById } from './data/timezones';
import { useLocalStorage } from './hooks/useLocalStorage';
import { formatTime12, formatTime24, formatDate, convertTime } from './utils/timeUtils';

// Validate stored city IDs — reset if they don't match current data
function validateCityIds(ids: unknown): string[] {
  if (!Array.isArray(ids) || ids.length !== 7) return DEFAULT_CITY_IDS;
  const valid = ids.every(id => typeof id === 'string' && getCityById(id));
  return valid ? ids : DEFAULT_CITY_IDS;
}

export default function App() {
  const [rawCityIds, setRawCityIds] = useLocalStorage<string[]>('wcp-cities-v2', DEFAULT_CITY_IDS);
  const cityIds = validateCityIds(rawCityIds);
  const setCityIds = setRawCityIds;
  const [baseCityIndex, setBaseCityIndex] = useLocalStorage<number>('wcp-base', 0);
  const [isDark, setIsDark] = useLocalStorage<boolean>('wcp-dark', false);
  const [use24h, setUse24h] = useLocalStorage<boolean>('wcp-24h', false);

  const now = DateTime.now();
  const roundedMin = now.minute < 30 ? '00' : '30';
  const [planDate, setPlanDate] = useState(now.toFormat('yyyy-MM-dd'));
  const [planTime, setPlanTime] = useState(`${now.toFormat('HH')}:${roundedMin}`);
  const [tick, setTick] = useState(0);

  // Live clock tick every second
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Apply dark class to html
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const currentTime = DateTime.now();
  void tick; // use tick to force re-render

  const handleCityChange = useCallback((index: number, newCityId: string) => {
    setCityIds(prev => {
      const next = [...prev];
      next[index] = newCityId;
      return next;
    });
  }, [setCityIds]);

  const handleReset = useCallback(() => {
    setCityIds(DEFAULT_CITY_IDS);
    setBaseCityIndex(0);
    const n = DateTime.now();
    setPlanDate(n.toFormat('yyyy-MM-dd'));
    setPlanTime(n.toFormat('HH:mm'));
  }, [setCityIds, setBaseCityIndex]);

  const handleCopy = useCallback(() => {
    const baseCity = getCityById(cityIds[baseCityIndex]);
    if (!baseCity) return;

    const baseDt = DateTime.fromFormat(`${planDate} ${planTime}`, 'yyyy-MM-dd HH:mm', {
      zone: baseCity.timezone,
    });
    if (!baseDt.isValid) return;

    const fmt = use24h ? formatTime24 : formatTime12;
    const lines = cityIds.map((id, idx) => {
      const city = getCityById(id);
      if (!city) return '';
      const local = convertTime(baseCity.timezone, city.timezone, baseDt);
      const marker = idx === baseCityIndex ? ' (BASE)' : '';
      return `${city.city}: ${fmt(local)} — ${formatDate(local)}${marker}`;
    });

    const text = `World Call Planner\n${'─'.repeat(30)}\n${lines.join('\n')}`;
    navigator.clipboard.writeText(text);
  }, [cityIds, baseCityIndex, planDate, planTime, use24h]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Header
          isDark={isDark}
          onThemeToggle={() => setIsDark(d => !d)}
          use24h={use24h}
          onTimeFormatToggle={() => setUse24h(v => !v)}
          onReset={handleReset}
        />

        {/* Clock grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
          {cityIds.map((id, idx) => (
            <WorldClockCard
              key={`${idx}-${id}`}
              cityId={id}
              dateTime={currentTime}
              onCityChange={newId => handleCityChange(idx, newId)}
              use24h={use24h}
              isBase={idx === baseCityIndex}
              onSetBase={() => setBaseCityIndex(idx)}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Call Planner + Meeting Overlap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CallPlanner
            cityIds={cityIds}
            baseCityIndex={baseCityIndex}
            onBaseChange={setBaseCityIndex}
            planDate={planDate}
            planTime={planTime}
            onPlanDateChange={setPlanDate}
            onPlanTimeChange={setPlanTime}
            use24h={use24h}
            onCopy={handleCopy}
          />
          <MeetingOverlap
            cityIds={cityIds}
            planDate={planDate}
            planTime={planTime}
            baseCityIndex={baseCityIndex}
          />
        </div>

        <footer className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500">
          World Call Planner — Accurate timezone conversion powered by IANA database
        </footer>
      </div>
    </div>
  );
}
