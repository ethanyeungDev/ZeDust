import { buildingsList, buildingMap } from '../campaign/buildings.js';
import { startConstructionInCity } from '../mainGame.js';
import { valueClassFor, applyValueClass } from './colors.js';

/**
 * Calculate deltas for a single building
 */
function calculateBuildingDeltas(building) {
  const tpl = buildingMap[building.template];
  if (!tpl || !tpl.deltas) return {};
  const deltas = {};
  for (const [res, val] of Object.entries(tpl.deltas)) {
    deltas[res] = val * building.count;
  }
  return deltas;
}

/**
 * Create a city panel element
 */
export function createCityPanel(city, cityIndex) {
  const panel = document.createElement('div');
  panel.className = 'city-panel';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.padding = '0.5rem';
  panel.style.margin = '0.25rem';
  panel.style.background = '#1a1a1a';
  panel.style.color = 'white';
  panel.style.border = '1px solid #333';
  panel.style.borderRadius = '4px';
  panel.style.minWidth = '250px';

  // Header
  const header = document.createElement('div');
  header.className = 'city-header';
  header.innerHTML = `<h3 style="margin:0 0 0.5rem 0;">${city.name}</h3>`;
  panel.appendChild(header);

  // Table for buildings + deltas
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.fontFamily = 'monospace';
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr>
      <th style="text-align:left;">Building</th>
      <th>Deltas</th>
      <th>Mothballed</th>
    </tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  city.buildings.forEach((b, i) => {
    const tr = document.createElement('tr');

    // Building name
    const tdName = document.createElement('td');
    tdName.textContent = `${b.template} × ${b.count}`;
    tdName.style.padding = '0.25rem';
    tr.appendChild(tdName);

    // Building deltas
    const tdDeltas = document.createElement('td');
    tdDeltas.style.padding = '0.25rem';
    const deltas = calculateBuildingDeltas(b);
    tdDeltas.textContent = Object.entries(deltas)
      .map(([res, val]) => `${res}: ${val >= 0 ? '+' : ''}${val}`)
      .join(' | ');
    tr.appendChild(tdDeltas);

    // Mothballed indicator
    const tdMoth = document.createElement('td');
    tdMoth.style.padding = '0.25rem';
    const mothBox = document.createElement('div');
    mothBox.style.width = '1.5rem';
    mothBox.style.height = '1.5rem';
    mothBox.style.display = 'flex';
    mothBox.style.alignItems = 'center';
    mothBox.style.justifyContent = 'center';
    mothBox.style.borderRadius = '2px';
    mothBox.style.cursor = 'pointer';
    mothBox.style.color = 'white';
    mothBox.style.fontWeight = 'bold';
    function updateMothBox() {
      mothBox.style.background = b.mothballed ? 'red' : 'green';
      mothBox.textContent = b.mothballed ? 'Y' : 'N';
    }
    updateMothBox();

    mothBox.addEventListener('click', () => {
      b.mothballed = !b.mothballed;
      updateMothBox();
    });

    tdMoth.appendChild(mothBox);
    tr.appendChild(tdMoth);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  panel.appendChild(table);

  // Construction dropdown
  const dropdown = document.createElement('select');
  const placeholder = document.createElement('option');
  placeholder.textContent = 'Construct new building...';
  placeholder.disabled = true;
  placeholder.selected = true;
  dropdown.appendChild(placeholder);

  buildingsList.forEach(building => {
    const opt = document.createElement('option');
    opt.value = building.name;
    opt.textContent = building.name;
    dropdown.appendChild(opt);
  });

  dropdown.addEventListener('change', (e) => {
    startConstructionInCity(cityIndex, e.target.value);
    e.target.selectedIndex = 0; // reset
  });

  panel.appendChild(dropdown);

  return panel;
}
