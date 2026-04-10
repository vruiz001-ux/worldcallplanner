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
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          World Call Planner
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Schedule international calls with confidence
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onTimeFormatToggle}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {use24h ? '24h' : '12h'}
        </button>

        <button
          onClick={onReset}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Reset
        </button>

        <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
      </div>
    </header>
  );
}
