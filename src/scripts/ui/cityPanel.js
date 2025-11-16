import { buildingsList, buildingMap } from '../campaign/buildings.js';
import { startConstructionInCity } from '../mainGame.js';
import { updateCharts } from './netChart.js';
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
 * Create a city panel element for one individual city
 */
export function createCityPanel(city, cityIndex) {
  const panel = document.createElement('div');
  panel.className = 'city-panel';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.padding = '0.75rem';
  panel.style.margin = '0.5rem';
  panel.style.background = '#c2c5b2ff';
  panel.style.color = 'white';
  panel.style.border = '1px solid #2a2a2a';
  panel.style.borderRadius = '6px';
  panel.style.boxShadow = '0 0 6px rgba(0,0,0,0.5)';

  // Header (3D, less bottom void, more spacing below)
  const header = document.createElement('div');
  header.innerHTML = `<h3 style="
      margin:0; 
      padding:0.3rem 0.75rem 0.45rem 0.75rem;
      font-size:1.15rem;
      text-align:center;
      background:#000;
      border-radius:4px;
      box-shadow:
        inset 0 0 6px rgba(255,255,255,0.06),
        0 1px 4px rgba(0,0,0,0.7);
  ">${city.name}</h3>`;
  header.style.marginBottom = '0.85rem';
  panel.appendChild(header);

  // Table container
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.fontFamily = 'monospace';
  table.style.tableLayout = 'fixed';
  table.style.background = '#1a1a1a';
  table.style.border = '1px solid #333';
  table.style.borderRadius = '4px';
  table.style.overflow = 'hidden';

  // Header row of main table
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr style="background:#000;">
      <th style="padding:0.5rem; border-bottom:1px solid #444; text-align:left;">Building</th>
      <th style="padding:0.5rem; border-bottom:1px solid #444; text-align:left;">Deltas / Cost</th>
      <th style="padding:0.5rem; border-bottom:1px solid #444; text-align:center;">Mothballed</th>
    </tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

// Separate completed vs under-construction and sort
const sortedBuildings = [...city.buildings].sort((a, b) => {
  if (a.template === b.template) {
    // Completed first, UC after
    return (a.beingBuilt === b.beingBuilt) ? 0 : (a.beingBuilt ? 1 : -1);
  }
  return a.template.localeCompare(b.template);
});

  sortedBuildings.forEach((b) => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #333';

 // Building name
const tdName = document.createElement('td');
tdName.style.padding = '0.4rem';

// Separate completed vs under-construction counts
let builtCount = b.beingBuilt ? (b.count - 1) : b.count;
let underConstructionCount = b.beingBuilt ? 1 : 0;

let displayParts = [];

// If there are finished buildings
if (builtCount > 0) {
  displayParts.push(`${b.template} × ${builtCount}`);
}

// If there are under-construction buildings
if (underConstructionCount > 0) {
  const ucSpan = document.createElement('span');
  ucSpan.textContent = `${b.template} × ${underConstructionCount} (Under Construction)`;
  ucSpan.style.background = '#bfa700';
  ucSpan.style.color = 'black';
  ucSpan.style.fontWeight = 'bold';
  ucSpan.style.padding = '0.15rem 0.25rem';
  ucSpan.style.borderRadius = '3px';
  ucSpan.style.marginLeft = builtCount > 0 ? '0.35rem' : '0';

  // If we have both built and UC, place built text first then UC span
  if (builtCount > 0) {
    tdName.textContent = `${b.template} × ${builtCount}, `;
    tdName.appendChild(ucSpan);
  } else {
    tdName.appendChild(ucSpan);
  }
} else {
  // Only built buildings
  tdName.textContent = displayParts.join(", ");
}

tr.appendChild(tdName);


    // DELTAS — now boxed, lined, aligned
    const tdDeltas = document.createElement('td');
    tdDeltas.style.padding = '0.4rem';

    const deltaTable = document.createElement('table');
  deltaTable.style.width = '100%';
  deltaTable.style.borderCollapse = 'collapse';
  deltaTable.style.background = '#1a1a1a';

const deltaTbody = document.createElement('tbody');

if (b.beingBuilt) {
  // Under-construction: show construction cost
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `<td colspan="2" style="text-align:center; font-weight:bold; border-bottom:1px solid #444; padding:0.2rem;">CONSTRUCTION COST</td>`;
  deltaTbody.appendChild(headerRow);

  const cost = getBuildingCost(b.template);
  Object.entries(cost).forEach(([res, val]) => {
    const deltaTr = document.createElement('tr');

    const resTd = document.createElement('td');
    resTd.textContent = res;
    resTd.style.borderBottom = '1px solid #444';
    resTd.style.padding = '0.15rem 0.25rem';
    resTd.style.textAlign = 'left';
    resTd.style.width = '50%';
    deltaTr.appendChild(resTd);

    const valTd = document.createElement('td');
    valTd.textContent = val >= 0 ? `+${val}` : val;
    valTd.style.borderBottom = '1px solid #444';
    valTd.style.padding = '0.15rem 0.25rem';
    valTd.style.textAlign = 'right';
    valTd.style.width = '50%';
    deltaTr.appendChild(valTd);

    deltaTbody.appendChild(deltaTr);
  });
} else {
  // Regular completed building deltas
  const deltas = calculateBuildingDeltas(b);
  Object.entries(deltas).forEach(([res, val]) => {
    const deltaTr = document.createElement('tr');

    const resTd = document.createElement('td');
    resTd.textContent = res;
    resTd.style.borderBottom = '1px solid #444';
    resTd.style.padding = '0.15rem 0.25rem';
    resTd.style.textAlign = 'left';
    resTd.style.width = '50%';
    deltaTr.appendChild(resTd);

    const valTd = document.createElement('td');
    valTd.textContent = val >= 0 ? `+${val}` : val;
    valTd.style.borderBottom = '1px solid #444';
    valTd.style.padding = '0.15rem 0.25rem';
    valTd.style.textAlign = 'right';
    valTd.style.width = '50%';
    deltaTr.appendChild(valTd);

    deltaTbody.appendChild(deltaTr);
  });
}


    // Remove final bottom border for last row
    if (deltaTbody.lastChild) {
      deltaTbody.lastChild.children[0].style.borderBottom = 'none';
      deltaTbody.lastChild.children[1].style.borderBottom = 'none';
    }

    deltaTable.appendChild(deltaTbody);
    tdDeltas.appendChild(deltaTable);
    tr.appendChild(tdDeltas);

    // Mothball indicator
    const tdMoth = document.createElement('td');
    tdMoth.style.padding = '0.4rem';
    tdMoth.style.textAlign = 'center';  // center the content horizontally

    const mothBox = document.createElement('div');
    mothBox.style.width = '1.5rem';
    mothBox.style.height = '1.5rem';
    mothBox.style.display = 'flex';
    mothBox.style.alignItems = 'center';     // center vertically
    mothBox.style.justifyContent = 'center'; // center horizontally
    mothBox.style.borderRadius = '3px';
    mothBox.style.cursor = 'pointer';
    mothBox.style.fontWeight = 'bold';
    mothBox.style.color = 'white';


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
dropdown.style.marginTop = '0.75rem';

// Placeholder
const placeholder = document.createElement('option');
placeholder.textContent = 'Construct new building...';
placeholder.disabled = true;
placeholder.selected = true;
dropdown.appendChild(placeholder);

// Populate dropdown
buildingsList.forEach(building => {
  const opt = document.createElement('option');
  opt.value = building.name;
  opt.textContent = building.name;
  dropdown.appendChild(opt);
});

// Inline message
const message = document.createElement('div');
message.style.color = '#ff5555';
message.style.fontSize = '0.85rem';
message.style.marginTop = '0.25rem';
message.style.height = '1rem';
panel.appendChild(message);

// Track if a new construction has already been initiated this turn
let newConstructionThisTurn = false;

dropdown.addEventListener('change', (e) => {
  const templateName = e.target.value;

  // Only allow one construction per turn
  if (newConstructionThisTurn) {
    message.textContent = "You can only start one new construction per city per turn.";
    setTimeout(() => { message.textContent = ""; }, 3000);
    e.target.selectedIndex = 0;
    return;
  }

  // Attempt to start construction
  const ok = startConstructionInCity(cityIndex, templateName);
  if (ok !== false) {
    newConstructionThisTurn = true;
    e.target.selectedIndex = 0;
    message.textContent = ""; // clear any previous message
    updateCharts();

  // Refresh just the tbody (buildings table) instead of whole panel
  const oldTbody = panel.querySelector('tbody');
  const newTbody = createCityTableBody(city);
  oldTbody.replaceWith(newTbody);
  }
});


// Add dropdown last
panel.appendChild(dropdown);

return panel;
}

