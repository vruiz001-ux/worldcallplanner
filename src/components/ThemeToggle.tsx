interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-sm transition-transform flex items-center justify-center text-sm ${
          isDark ? 'translate-x-7' : 'translate-x-0.5'
        }`}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
