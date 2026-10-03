import { getShortcuts } from './config.js';
import { ICONS } from './icons.js';
import { setupThemeToolbar } from './themes.js';

function injectSvgGradients(shortcuts) {
  const existing = document.getElementById('svg-gradient-defs');
  if (existing) existing.remove();

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'svg-gradient-defs';
  svg.style.position = 'absolute';
  svg.style.width = '0';
  svg.style.height = '0';
  svg.style.overflow = 'hidden';
  svg.setAttribute('aria-hidden', 'true');

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

  // Brand specific gradients
  shortcuts.forEach(item => {
    if (!item.gradient) return;
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.id = `grad-${item.id}`;
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '100%');

    const step = 100 / (item.gradient.length - 1);
    item.gradient.forEach((color, idx) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', `${Math.round(idx * step)}%`);
      stop.setAttribute('stop-color', color);
      grad.appendChild(stop);
    });

    defs.appendChild(grad);
  });

  // Global theme gradients
  const themeGradients = [
    { id: 'grad-theme-cyber', stops: ['#ff007f', '#00f0ff'] },
    { id: 'grad-theme-aurora', stops: ['#2dd4bf', '#38bdf8'] },
    { id: 'grad-theme-sunset', stops: ['#f59e0b', '#f43f5e'] }
  ];

  themeGradients.forEach(t => {
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.id = t.id;
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '100%');

    const step = 100 / (t.stops.length - 1);
    t.stops.forEach((color, idx) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', `${Math.round(idx * step)}%`);
      stop.setAttribute('stop-color', color);
      grad.appendChild(stop);
    });

    defs.appendChild(grad);
  });

  svg.appendChild(defs);
  document.body.prepend(svg);
}

function init() {
  const grid = document.getElementById('grid');
  if (!grid) return;

  const shortcuts = getShortcuts();
  injectSvgGradients(shortcuts);

  // Divide into Row 1 and Row 2
  const row1 = shortcuts.filter(s => s.row === 1);
  const row2 = shortcuts.filter(s => s.row === 2);

  grid.innerHTML = '';

  const renderRow = (items, rowNumber) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'grid-row';
    rowEl.setAttribute('role', 'row');

    items.forEach((item, colIndex) => {
      const tile = document.createElement('a');
      tile.href = item.url;
      tile.target = '_blank';
      tile.rel = 'noopener noreferrer';
      tile.className = 'tile';
      tile.title = item.title;
      tile.setAttribute('aria-label', item.title);
      tile.setAttribute('role', 'gridcell');
      tile.dataset.id = item.id;
      tile.dataset.row = rowNumber;
      tile.dataset.col = colIndex;
      tile.style.setProperty('--brand-color', item.color);

      const iconSvg = ICONS[item.icon] || '';
      tile.innerHTML = `<div class="tile-icon">${iconSvg}</div>`;

      rowEl.appendChild(tile);
    });

    return rowEl;
  };

  grid.appendChild(renderRow(row1, 1));
  grid.appendChild(renderRow(row2, 2));

  setupKeyboardNavigation();
  setupThemeToolbar();
}

function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (!active || !active.classList.contains('tile')) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const first = document.querySelector('.tile');
        if (first) {
          first.focus();
          e.preventDefault();
        }
      }
      return;
    }

    const currentRow = parseInt(active.dataset.row, 10);
    const currentCol = parseInt(active.dataset.col, 10);

    let nextTarget = null;

    if (e.key === 'ArrowRight') {
      nextTarget = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentCol + 1}"]`)
        || document.querySelector(`.tile[data-row="${currentRow === 1 ? 2 : 1}"][data-col="0"]`);
    } else if (e.key === 'ArrowLeft') {
      nextTarget = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentCol - 1}"]`)
        || document.querySelector(`.tile[data-row="${currentRow === 1 ? 2 : 1}"][data-col="5"]`);
    } else if (e.key === 'ArrowDown') {
      nextTarget = document.querySelector(`.tile[data-row="2"][data-col="${currentCol}"]`);
    } else if (e.key === 'ArrowUp') {
      nextTarget = document.querySelector(`.tile[data-row="1"][data-col="${currentCol}"]`);
    }

    if (nextTarget) {
      e.preventDefault();
      nextTarget.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
