interface HeaderProps {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export function Header({ isDarkTheme, onToggleTheme }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">Study Planner</h1>
      <button className="header__theme-toggle" onClick={onToggleTheme}>
        {isDarkTheme ? 'Світла тема' : 'Темна тема'}
      </button>
    </header>
  );
}