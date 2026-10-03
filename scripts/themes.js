// Deep module: Theme system and toolbar controller
const THEME_STORAGE_KEY = 'aura_startpage_theme';

export const THEMES = [
  {
    id: 'midnight',
    name: 'Midnight Navy',
    desc: 'Classic NightTab dark aesthetic',
    dotColor: '#3b82f6',
    iconMode: 'monochrome',
    vars: {
      '--bg-radial-1': '#10182b',
      '--bg-radial-2': '#0b101c',
      '--bg-radial-3': '#070a12',
      '--tile-bg': 'linear-gradient(180deg, rgba(14, 22, 40, 0.75) 0%, rgba(10, 16, 30, 0.75) 100%)',
      '--tile-border': 'rgba(30, 58, 102, 0.75)',
      '--tile-bevel': 'rgba(255, 255, 255, 0.05)',
      '--toolbar-bg': 'rgba(13, 20, 36, 0.85)',
      '--toolbar-border': 'rgba(30, 58, 102, 0.75)'
    }
  },
  {
    id: 'prism-gradients',
    name: 'Prism Gradients',
    desc: 'Vibrant signature brand gradients',
    dotColor: '#ec4899',
    iconMode: 'gradient',
    vars: {
      '--bg-radial-1': '#141226',
      '--bg-radial-2': '#0b0917',
      '--bg-radial-3': '#06050d',
      '--tile-bg': 'linear-gradient(180deg, rgba(22, 18, 42, 0.8) 0%, rgba(13, 10, 26, 0.8) 100%)',
      '--tile-border': 'rgba(75, 55, 128, 0.65)',
      '--tile-bevel': 'rgba(255, 255, 255, 0.08)',
      '--toolbar-bg': 'rgba(18, 14, 34, 0.85)',
      '--toolbar-border': 'rgba(75, 55, 128, 0.65)'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    desc: 'Pitch OLED black with neon charge',
    dotColor: '#00f0ff',
    iconMode: 'cyber-gradient',
    vars: {
      '--bg-radial-1': '#180829',
      '--bg-radial-2': '#080511',
      '--bg-radial-3': '#020105',
      '--tile-bg': 'linear-gradient(180deg, rgba(28, 12, 48, 0.8) 0%, rgba(12, 5, 22, 0.8) 100%)',
      '--tile-border': 'rgba(120, 40, 180, 0.65)',
      '--tile-bevel': 'rgba(255, 0, 128, 0.15)',
      '--toolbar-bg': 'rgba(20, 8, 36, 0.85)',
      '--toolbar-border': 'rgba(120, 40, 180, 0.65)'
    }
  },
  {
    id: 'navy-brands',
    name: 'Navy Signature',
    desc: 'Original navy · Signature brand icon colors',
    dotColor: '#38bdf8',
    iconMode: 'brand-colors',
    vars: {
      '--bg-radial-1': '#10182b',
      '--bg-radial-2': '#0b101c',
      '--bg-radial-3': '#070a12',
      '--tile-bg': 'linear-gradient(180deg, rgba(14, 22, 40, 0.75) 0%, rgba(10, 16, 30, 0.75) 100%)',
      '--tile-border': 'rgba(30, 58, 102, 0.75)',
      '--tile-bevel': 'rgba(255, 255, 255, 0.05)',
      '--toolbar-bg': 'rgba(13, 20, 36, 0.85)',
      '--toolbar-border': 'rgba(30, 58, 102, 0.75)'
    }
  },
  {
    id: 'stealth',
    name: 'Titanium Stealth',
    desc: 'Pure achromatic matte graphite',
    dotColor: '#a1a1aa',
    iconMode: 'monochrome',
    vars: {
      '--bg-radial-1': '#18181b',
      '--bg-radial-2': '#09090b',
      '--bg-radial-3': '#000000',
      '--tile-bg': 'linear-gradient(180deg, rgba(28, 28, 32, 0.8) 0%, rgba(14, 14, 16, 0.8) 100%)',
      '--tile-border': 'rgba(63, 63, 70, 0.75)',
      '--tile-bevel': 'rgba(255, 255, 255, 0.06)',
      '--toolbar-bg': 'rgba(20, 20, 22, 0.85)',
      '--toolbar-border': 'rgba(63, 63, 70, 0.75)'
    }
  }
];

export function getCurrentTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return THEMES.find(t => t.id === saved) || THEMES[0];
}

export function applyTheme(themeId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const root = document.documentElement;

  // Apply CSS variables
  Object.entries(theme.vars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });

  // Set data attributes
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-icon-mode', theme.iconMode);

  // Update toolbar dot
  const dot = document.getElementById('themeDot');
  if (dot) {
    dot.style.backgroundColor = theme.dotColor;
  }

  // Update active mark in menu
  document.querySelectorAll('.theme-option').forEach(el => {
    if (el.dataset.themeId === theme.id) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  localStorage.setItem(THEME_STORAGE_KEY, theme.id);
}

export function setupThemeToolbar() {
  const current = getCurrentTheme();
  applyTheme(current.id);

  const toolbar = document.getElementById('toolbar');
  const themeBtn = document.getElementById('themeBtn');
  const themeMenu = document.getElementById('themeMenu');
  const themeOptions = document.getElementById('themeOptions');

  if (!toolbar || !themeBtn || !themeMenu || !themeOptions) return;

  // Render theme options
  themeOptions.innerHTML = '';
  THEMES.forEach(t => {
    const opt = document.createElement('button');
    opt.className = `theme-option ${t.id === current.id ? 'active' : ''}`;
    opt.dataset.themeId = t.id;
    opt.setAttribute('role', 'menuitem');
    opt.innerHTML = `
      <span class="theme-option-dot" style="background: ${t.dotColor};"></span>
      <span class="theme-option-info">
        <span class="theme-option-name">${t.name}</span>
        <span class="theme-option-desc">${t.desc}</span>
      </span>
      <svg class="theme-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    `;

    opt.addEventListener('click', () => {
      applyTheme(t.id);
      closeMenu();
    });

    themeOptions.appendChild(opt);
  });

  function toggleMenu() {
    const isOpen = themeMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    themeMenu.classList.add('open');
    themeMenu.setAttribute('aria-hidden', 'false');
    themeBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    themeMenu.classList.remove('open');
    themeMenu.setAttribute('aria-hidden', 'true');
    themeBtn.setAttribute('aria-expanded', 'false');
  }

  themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toolbar.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && themeMenu.classList.contains('open')) {
      closeMenu();
      themeBtn.focus();
    }
  });
}
