const setTheme = (theme) => {
  document.body.classList.toggle('dark', theme === 'dark');

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme !== null)
    metaTheme.setAttribute('content', theme === 'dark' ? '#121113' : '#FDFCFD');

  window.localStorage.setItem('theme', theme);

  const lightToggle = document.querySelector('[data-theme-toggle-light]');
  const darkToggle = document.querySelector('[data-theme-toggle-dark]');

  if (theme === 'light') {
    lightToggle?.classList.add('active');
    darkToggle?.classList.remove('active');
  } else {
    lightToggle?.classList.remove('active');
    darkToggle?.classList.add('active');
  }
};

function getUserPreference() {
  if (window.localStorage.getItem('theme')) {
    return window.localStorage.getItem('theme');
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const setInitialTheme = () => {
  const userPreference = getUserPreference();
  setTheme(userPreference);
};

setInitialTheme();
