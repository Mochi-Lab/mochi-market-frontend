import { useEffect, useState } from 'react';
import './index.scss';

export default function ToggleDarkMode() {
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  useEffect(() => {
    const selectedMode = localStorage.getItem('theme')
    if(selectedMode !== null) document.querySelector("html").setAttribute('data-theme', selectedMode);
  }, []);

  const toggleThemeChange = () => {
    if (isDark) {
      localStorage.setItem('theme', 'light');
      document.querySelector("html").setAttribute('data-theme', 'light');
      setIsDark(false);
    } else {
      localStorage.setItem('theme', 'dark');
      document.querySelector("html").setAttribute('data-theme', 'dark');
      setIsDark(true);
    }
  };
  return (
    <div className='darkmode-switch'>
      <span className='darkmode-switch-label'>Theme: </span>
      <div className='toggle' title='toggle dark mode'>
        <label>
          <input checked={!isDark} onChange={() => toggleThemeChange()} type='checkbox' name='' />
          <span></span>
        </label>
      </div>
    </div>
  );
}
