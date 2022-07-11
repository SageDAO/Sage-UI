import { useEffect, useState } from 'react';

const KEY = 'theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';
type Theme = typeof DARK_THEME | typeof LIGHT_THEME;
const DEFAULT_THEME: Theme = 'dark';


export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  function toggleTheme() {
    console.log('toggleTheme()');
    if (theme === DARK_THEME) {
      document.body.classList.replace(DARK_THEME, LIGHT_THEME);
      localStorage.setItem(KEY, LIGHT_THEME);
      setTheme(LIGHT_THEME);
    } else {
      document.body.classList.replace(LIGHT_THEME, DARK_THEME);
      localStorage.setItem(KEY, DARK_THEME);
      setTheme(DARK_THEME);
    }
  }

  useEffect(() => console.log(localStorage.getItem(KEY)), [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem(KEY);
    if (savedTheme) {
      document.body.classList.add(theme);
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem(KEY);
    if (!savedTheme) {
      localStorage.setItem(KEY, DEFAULT_THEME);
    }
    setTheme(savedTheme as Theme);
  }, []);

  return { toggleTheme, theme };
}
