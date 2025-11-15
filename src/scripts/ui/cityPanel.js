// ui/cityPanel.js
import { buildingMap } from '../campaign/buildings.js';
import { startConstructionInCity } from '../mainGame.js';

/**
 * Compute per-building deltas, accounting for mothballed status
 */
function calculateBuildingDeltas(building) {
  const template = buildingMap[building.template];
  if (!template || !template.output) return {};
  const deltas = {};
  for (const [res, val] of Object.entries(template.output)) {
    deltas[res] = building.mothballed ? 0 : val;
  }
  return deltas;
}

/**
 * Compute summed deltas for the city
 */
function calculateCityTotals(city) {
  const totals = {};
  city.buildings.forEach(b => {
    const deltas = calculateBuildingDeltas(b);
    for (const [res, val] of Object.entries(deltas)) {
      totals[res] = (totals[res] || 0) + val * b.count;
    }
  });
  return totals;
}

/**
 * Render a single city panel
 */
export function createCityPanel(city, index) {
  const panel = document.createElement('div');
  panel.className = 'city-panel';
  panel.style.background = '#1b1b2f';
  panel.style.color = 'white';
  panel.style.padding = '0.75rem';
  panel.style.borderRadius = '8px';
  panel.style.flex = '0 0 auto';
  panel.style.minWidth = '300px';

  // --- HEADER ---
  const header = document.createElement('div');
  header.className = 'city-header';
  header.innerHTML = `<h3 style="margin:0; text-align:center;">${city.name}</h3>`;
  panel.appendChild(header);

  // --- TABLE FOR BUILDINGS AND DELTAS ---
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '0.5rem';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr style="border-bottom:1px solid #444;">
      <th style="text-align:left; padding:0.25rem;">Building</th>
      <th style="text-align:left; padding:0.25rem;">Deltas</th>
      <th style="padding:0.25rem;">Mothballed</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
city.buildings.forEach((b, i) => {
  const deltas = calculateBuildingDeltas(b);
  const tr = document.createElement('tr');

  // --- Building name ---
  const tdName = document.createElement('td');
  tdName.textContent = `${b.template} × ${b.count}`;
  tdName.style.padding = '0.25rem';
  tr.appendChild(tdName);

  // --- Deltas ---
  const tdDeltas = document.createElement('td');
  tdDeltas.style.padding = '0.25rem';
  tdDeltas.style.fontFamily = 'monospace';
  tdDeltas.textContent = Object.entries(deltas)
    .map(([res, val]) => `${res}: ${b.mothballed ? 0 : (val >= 0 ? '+' : '') + val}`)
    .join(' | ');
  tr.appendChild(tdDeltas);

  // --- Mothballed indicator (color + Y/N) ---
  const tdMoth = document.createElement('td');
  tdMoth.style.padding = '0.25rem';
  tdMoth.style.fontWeight = 'bold';
  tdMoth.style.textAlign = 'center';
  tdMoth.style.cursor = 'pointer';

  function updateMothCell() {
    tdMoth.textContent = b.mothballed ? 'Y' : 'N';
    tdMoth.style.color = b.mothballed ? 'red' : 'green';
  }

  updateMothCell();

  tdMoth.addEventListener('click', () => {
    b.mothballed = !b.mothballed;
    updateMothCell();
    // optionally re-render sidebar to update all deltas
  });

  tr.appendChild(tdMoth);

  tbody.appendChild(tr);
});


  // --- TOTAL ROW ---
  const totalRow = document.createElement('tr');
  totalRow.style.borderTop = '1px solid #888';
  const totals = calculateCityTotals(city);

  const tdLabel = document.createElement('td');
  tdLabel.textContent = 'Total';
  tdLabel.style.fontWeight = 'bold';
  tdLabel.style.padding = '0.25rem';
  totalRow.appendChild(tdLabel);

  const tdTotals = document.createElement('td');
  tdTotals.style.padding = '0.25rem';
  tdTotals.style.fontFamily = 'monospace';
  tdTotals.style.fontWeight = 'bold';
  tdTotals.textContent = Object.entries(totals)
    .map(([res, val]) => `${res}: ${val >= 0 ? '+' : ''}${val}`)
    .join(' | ');
  totalRow.appendChild(tdTotals);

  // Empty cell for mothballed column
  const tdEmpty = document.createElement('td');
  tdEmpty.textContent = '';
  totalRow.appendChild(tdEmpty);

  tbody.appendChild(totalRow);

  table.appendChild(tbody);
  panel.appendChild(table);

  // --- CONSTRUCTION DROPDOWN ---
  const dropdown = document.createElement('select');
  dropdown.style.marginTop = '0.5rem';
  const placeholder = document.createElement('option');
  placeholder.textContent = 'Construct new building...';
  placeholder.disabled = true;
  placeholder.selected = true;
  dropdown.appendChild(placeholder);

  Object.values(buildingMap).forEach(building => {
    const opt = document.createElement('option');
    opt.value = building.name;
    opt.textContent = building.name;
    dropdown.appendChild(opt);
  });

  dropdown.addEventListener('change', e => {
    const buildingName = e.target.value;
    startConstructionInCity(index, buildingName);
    e.target.selectedIndex = 0;
  });

  panel.appendChild(dropdown);

  return panel;
}
