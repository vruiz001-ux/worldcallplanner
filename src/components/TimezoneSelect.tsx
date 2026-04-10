import { useState, useRef, useEffect, useMemo } from 'react';
import { CITIES, type CityTimezone } from '../data/timezones';

interface TimezoneSelectProps {
  selectedCityId: string;
  onChange: (cityId: string) => void;
}

export function TimezoneSelect({ selectedCityId, onChange }: TimezoneSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = CITIES.find(c => c.id === selectedCityId);

  const filtered = useMemo(() => {
    if (!search) return CITIES.slice(0, 50); // show first 50 when no search
    const q = search.toLowerCase();
    return CITIES.filter(c =>
      c.city.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q) ||
      c.timezone.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [search]);

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
        className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-blue-400 dark:hover:border-blue-400 transition-colors text-xs"
      >
        <span className="truncate font-medium text-slate-700 dark:text-slate-200">
          {selected?.city ?? 'Select city'}
        </span>
        <svg className="ml-auto w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to search any city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 outline-none focus:border-blue-400 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
            {!search && (
              <div className="text-[10px] text-slate-400 mt-1 px-1">
                {CITIES.length} cities available
              </div>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto">
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
            {filtered.length === 50 && search && (
              <div className="px-4 py-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-700">
                Type more to narrow results...
              </div>
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
      className={`w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${
        isSelected ? 'bg-blue-50 dark:bg-slate-700' : ''
      }`}
    >
      <span className="text-slate-800 dark:text-slate-200 truncate">{city.city}</span>
      <span className="text-[10px] text-slate-400 shrink-0 ml-2">{city.region}</span>
    </button>
  );
}
