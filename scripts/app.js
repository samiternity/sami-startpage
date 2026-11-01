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
    const tiles = Array.from(document.querySelectorAll('.tile'));
    if (!tiles.length) return;

    const active = document.activeElement;
    const isTile = active && active.classList.contains('tile');

    if (!isTile) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        tiles[0].focus();
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      tiles[0].focus();
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      tiles[tiles.length - 1].focus();
      return;
    }

    const currentRect = active.getBoundingClientRect();
    const currentCenter = {
      x: currentRect.left + currentRect.width / 2,
      y: currentRect.top + currentRect.height / 2
    };

    let nextTarget = null;
    const currentIndex = tiles.indexOf(active);

    if (e.key === 'ArrowRight') {
      // Find candidate to the right on roughly the same row
      const candidates = tiles.filter(t => {
        if (t === active) return false;
        const r = t.getBoundingClientRect();
        const cy = r.top + r.height / 2;
        const cx = r.left + r.width / 2;
        return cx > currentCenter.x + 5 && Math.abs(cy - currentCenter.y) < currentRect.height * 0.45;
      });

      if (candidates.length > 0) {
        candidates.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
        nextTarget = candidates[0];
      } else {
        // Wrap to next tile in linear order
        nextTarget = tiles[(currentIndex + 1) % tiles.length];
      }
    } else if (e.key === 'ArrowLeft') {
      // Find candidate to the left on roughly the same row
      const candidates = tiles.filter(t => {
        if (t === active) return false;
        const r = t.getBoundingClientRect();
        const cy = r.top + r.height / 2;
        const cx = r.left + r.width / 2;
        return cx < currentCenter.x - 5 && Math.abs(cy - currentCenter.y) < currentRect.height * 0.45;
      });

      if (candidates.length > 0) {
        candidates.sort((a, b) => b.getBoundingClientRect().right - a.getBoundingClientRect().right);
        nextTarget = candidates[0];
      } else {
        // Wrap to previous tile in linear order
        nextTarget = tiles[(currentIndex - 1 + tiles.length) % tiles.length];
      }
    } else if (e.key === 'ArrowDown') {
      // Find candidates strictly below current tile
      const below = tiles.filter(t => {
        if (t === active) return false;
        const r = t.getBoundingClientRect();
        const cy = r.top + r.height / 2;
        return cy > currentCenter.y + currentRect.height * 0.4;
      });

      if (below.length > 0) {
        const minDy = Math.min(...below.map(t => {
          const r = t.getBoundingClientRect();
          return (r.top + r.height / 2) - currentCenter.y;
        }));
        const nextRowCandidates = below.filter(t => {
          const r = t.getBoundingClientRect();
          const dy = (r.top + r.height / 2) - currentCenter.y;
          return Math.abs(dy - minDy) < currentRect.height * 0.45;
        });
        nextRowCandidates.sort((a, b) => {
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          const dxa = Math.abs((ra.left + ra.width / 2) - currentCenter.x);
          const dxb = Math.abs((rb.left + rb.width / 2) - currentCenter.x);
          return dxa - dxb;
        });
        nextTarget = nextRowCandidates[0];
      }
    } else if (e.key === 'ArrowUp') {
      // Find candidates strictly above current tile
      const above = tiles.filter(t => {
        if (t === active) return false;
        const r = t.getBoundingClientRect();
        const cy = r.top + r.height / 2;
        return cy < currentCenter.y - currentRect.height * 0.4;
      });

      if (above.length > 0) {
        const minDy = Math.min(...above.map(t => {
          const r = t.getBoundingClientRect();
          return currentCenter.y - (r.top + r.height / 2);
        }));
        const prevRowCandidates = above.filter(t => {
          const r = t.getBoundingClientRect();
          const dy = currentCenter.y - (r.top + r.height / 2);
          return Math.abs(dy - minDy) < currentRect.height * 0.45;
        });
        prevRowCandidates.sort((a, b) => {
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          const dxa = Math.abs((ra.left + ra.width / 2) - currentCenter.x);
          const dxb = Math.abs((rb.left + rb.width / 2) - currentCenter.x);
          return dxa - dxb;
        });
        nextTarget = prevRowCandidates[0];
      }
    }

    if (nextTarget) {
      e.preventDefault();
      nextTarget.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
