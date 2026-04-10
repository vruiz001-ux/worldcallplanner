import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  use24h: boolean;
  onTimeFormatToggle: () => void;
  onReset: () => void;
}

export function Header({ isDark, onThemeToggle, use24h, onTimeFormatToggle, onReset }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
      <div>
        <h1 className="text-lg sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          World Call Planner
        </h1>
        <p className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
          Schedule international calls with confidence
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onTimeFormatToggle}
          className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {use24h ? '24h' : '12h'}
        </button>

        <button
          onClick={onReset}
          className="hidden sm:block px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Reset
        </button>

        <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
      </div>
    </header>
  );
}
