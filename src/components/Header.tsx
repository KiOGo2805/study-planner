interface HeaderProps {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export function Header({ isDarkTheme, onToggleTheme }: HeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <h1 className="text-3xl font-bold text-primary">Study Planner</h1>
      <button
        className="rounded-full border border-border bg-surface px-4 py-2 font-medium text-text transition-colors hover:border-primary"
        onClick={onToggleTheme}
      >
        {isDarkTheme ? 'Світла тема' : 'Темна тема'}
      </button>
    </header>
  );
}