import { useState, useRef, useEffect } from 'react';
import { CITIES, type CityTimezone } from '../data/timezones';

interface TimezoneSelectProps {
  selectedCityId: string;
  onChange: (cityId: string) => void;
  excludeIds?: string[];
}

export function TimezoneSelect({ selectedCityId, onChange, excludeIds = [] }: TimezoneSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = CITIES.find(c => c.id === selectedCityId);

  const filtered = CITIES.filter(c => {
    if (excludeIds.includes(c.id) && c.id !== selectedCityId) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.city.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.timezone.toLowerCase().includes(q);
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-blue-400 dark:hover:border-blue-400 transition-colors text-sm"
      >
        <span>{selected?.emoji}</span>
        <span className="truncate font-medium text-slate-800 dark:text-slate-200">
          {selected?.city}
        </span>
        <span className="ml-auto text-slate-400 text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 outline-none focus:border-blue-400 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.map(city => (
              <CityOption
                key={city.id}
                city={city}
                isSelected={city.id === selectedCityId}
                onSelect={() => {
                  onChange(city.id);
                  setIsOpen(false);
                  setSearch('');
                }}
              />
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-slate-400">No cities found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CityOption({ city, isSelected, onSelect }: { city: CityTimezone; isSelected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${
        isSelected ? 'bg-blue-50 dark:bg-slate-700 font-medium' : ''
      }`}
    >
      <span>{city.emoji}</span>
      <div className="text-left">
        <div className="text-slate-800 dark:text-slate-200">{city.city}</div>
        <div className="text-xs text-slate-400">{city.country}</div>
      </div>
    </button>
  );
}
