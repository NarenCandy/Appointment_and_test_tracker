import { useAppState, useAppDispatch } from '../context/AppContext';
import './ThemeToggle.css';

/**
 * ThemeToggle component for switching between light and dark modes
 * Dispatches SET_THEME action and persists preference to localStorage
 */
export function ThemeToggle() {
  const { theme } = useAppState();
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <span className="theme-icon" role="img" aria-label="Moon icon">
          🌙
        </span>
      ) : (
        <span className="theme-icon" role="img" aria-label="Sun icon">
          ☀️
        </span>
      )}
      <span className="theme-label">
        {theme === 'light' ? 'Dark' : 'Light'} Mode
      </span>
    </button>
  );
}
