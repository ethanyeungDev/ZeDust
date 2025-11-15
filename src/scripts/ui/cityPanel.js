// cityPanel.js
import { buildingsList, buildingMap } from '../campaign/buildings.js';
import { startConstructionInCity } from '../mainGame.js';
import { applyValueClass } from './colors.js';

/**
 * Compute total deltas for a city based on its active buildings.
 */
function calculateCityDeltas(city) {
  const totals = {};

  city.buildings.forEach(b => {
    const template = buildingMap[b.template];
    if (!template || !template.deltas) return;

    for (const [resource, value] of Object.entries(template.deltas)) {
      totals[resource] = (totals[resource] || 0) + value * b.count;
    }
  });

  return totals;
}

/**
 * Create a panel for one city, including header, building list,
 * deltas, and a dropdown to construct new buildings.
 */
export function createCityPanel(city, cityIndex) {
  const panel = document.createElement('div');
  panel.className = 'city-panel';

  // --- HEADER ---
  const header = document.createElement('div');
  header.className = 'city-header';
  header.innerHTML = `<h3>${city.name}</h3>`;
  panel.appendChild(header);

  // --- DELTAS ---
  const deltas = calculateCityDeltas(city);
  const deltaDiv = document.createElement('div');
  deltaDiv.className = 'city-deltas';

  if (Object.keys(deltas).length === 0) {
    deltaDiv.innerHTML = `<hr>`;
  } else {
    for (const [res, value] of Object.entries(deltas)) {
      const line = document.createElement('div');
      line.className = 'delta-line';
      line.innerHTML = `${res}: <span class="${applyValueClass(value)}">${value}</span>`;
      deltaDiv.appendChild(line);
    }
  }
  panel.appendChild(deltaDiv);

  // --- BUILDINGS LIST ---
  const buildingListDiv = document.createElement('div');
  buildingListDiv.className = 'city-buildings';

  city.buildings.forEach(b => {
    const entry = document.createElement('div');
    entry.className = 'building-entry';
    entry.innerHTML = `${b.template} × ${b.count}`;
    buildingListDiv.appendChild(entry);
  });

  panel.appendChild(buildingListDiv);

  // --- CONSTRUCTION DROPDOWN ---
  const dropdown = document.createElement('select');
  dropdown.className = 'city-construction';
  const placeholder = document.createElement('option');
  placeholder.textContent = 'Construct new building...';
  placeholder.disabled = true;
  placeholder.selected = true;
  dropdown.appendChild(placeholder);

  buildingsList.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.name;
    opt.textContent = b.name;
    dropdown.appendChild(opt);
  });

  dropdown.addEventListener('change', (e) => {
    startConstructionInCity(cityIndex, e.target.value);
    e.target.selectedIndex = 0;
  });

  panel.appendChild(dropdown);

  return panel;
}
