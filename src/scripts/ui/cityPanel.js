import { buildingsList, buildingMap } from '../campaign/buildings.js';
import { startConstructionInCity } from '../mainGame.js';

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

  // Insert table via helper
  const table = createBuildingTable(city);
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
    const templateName = e.target.value;
    const ok = startConstructionInCity(cityIndex, templateName);

    if (ok !== false) {
      e.target.selectedIndex = 0;
      updateCharts();

      // Refresh table only
      const oldTable = panel.querySelector('table');
      if (oldTable) {
        const newTable = createBuildingTable(city);
        oldTable.replaceWith(newTable);
      }
    }
  });

  dropdown.style.marginTop = '0.5rem';
  panel.appendChild(dropdown);

  return panel;
}

/**
 * Build the buildings table for a city
 */
function createBuildingTable(city) {
  // Table container
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.fontFamily = 'monospace';
  table.style.tableLayout = 'fixed';

  // Header row
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr>
      <th style="text-align:left; border-bottom:1px solid #555;">Building</th>
      <th style="border-bottom:1px solid #555;">Deltas</th>
      <th style="border-bottom:1px solid #555;">Mothballed</th>
    </tr>`;
  table.appendChild(thead);

  // Sort buildings: completed first, under construction after
  const sortedBuildings = [...city.buildings].sort((a, b) => {
    if (a.template === b.template) {
      return (a.beingBuilt === b.beingBuilt) ? 0 : (a.beingBuilt ? 1 : -1);
    }
    return a.template.localeCompare(b.template);
  });

  const tbody = document.createElement('tbody');

  sortedBuildings.forEach((b) => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #555';

    // Building name
    const tdName = document.createElement('td');
    tdName.textContent = `${b.template} × ${b.count}`;
    tdName.style.padding = '0.25rem';
    tr.appendChild(tdName);

    // Deltas nested table
    const tdDeltas = document.createElement('td');
    tdDeltas.style.padding = '0.25rem';
    const deltas = calculateBuildingDeltas(b);

    const deltaTable = document.createElement('table');
    deltaTable.style.width = '100%';
    deltaTable.style.borderCollapse = 'collapse';
    const deltaTbody = document.createElement('tbody');

    Object.entries(deltas).forEach(([res, val]) => {
      const deltaTr = document.createElement('tr');

      const resTd = document.createElement('td');
      resTd.textContent = res;
      resTd.style.borderBottom = '1px solid #555';
      resTd.style.padding = '0 0.25rem';
      resTd.style.textAlign = 'left';
      resTd.style.width = '50%';
      deltaTr.appendChild(resTd);

      const valTd = document.createElement('td');
      valTd.textContent = val >= 0 ? `+${val}` : val;
      valTd.style.borderBottom = '1px solid #555';
      valTd.style.padding = '0 0.25rem';
      valTd.style.textAlign = 'right';
      valTd.style.width = '50%';
      deltaTr.appendChild(valTd);

      deltaTbody.appendChild(deltaTr);
    });

    deltaTable.appendChild(deltaTbody);
    tdDeltas.appendChild(deltaTable);
    tr.appendChild(tdDeltas);

    // Mothballed indicator
    const tdMoth = document.createElement('td');
    tdMoth.style.padding = '0.25rem';
    tdMoth.style.textAlign = 'center';

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
  return table;
}
