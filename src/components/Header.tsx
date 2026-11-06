import { useTheme } from '../context/ThemeContext';

export function Header() {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <h1 className="header__title">Study Planner</h1>
      <button className="header__theme-toggle" onClick={toggleTheme}>
        {isDarkTheme ? 'Світла тема' : 'Темна тема'}
      </button>
    </header>
  );
}