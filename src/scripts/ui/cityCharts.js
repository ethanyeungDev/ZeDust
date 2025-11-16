//NOTE: per city charts display in devmode only. they were too visually cluttering for the game.

// creates per-city Chart.js stacked bar charts and updates them
import { buildingMap } from '../campaign/buildings.js';
import { cities } from '../campaign/cities.js';

// returns resource keys in consistent order
//look, I know I could use integer ids, but I kept forgetting the ids okay
const RESOURCE_KEYS = ["credits","commonMetal","heavyMachinery","specialMetals","fissiles","IC","innovation","stability","pop","gridScale","rations","advancedComponent"];

// map cityName -> Chart instance
const cityCharts = new Map();

function buildDatasetsForCity(city) {
  // current values
  const current = RESOURCE_KEYS.map(k => city.resources[k] ?? 0);

  // compute deltas
  const deltas = RESOURCE_KEYS.map(k => 0);
  for (const b of city.buildings) {
    if (b.mothballed || b.beingBuilt) continue;
    const tpl = buildingMap[b.template];
    if (!tpl) continue;
    RESOURCE_KEYS.forEach((k, i) => {
      deltas[i] += (tpl.deltas[k] ?? 0) * (b.count ?? 1);
    });
  }

  const positive = deltas.map(v => (v > 0 ? v : 0));
  const negative = deltas.map(v => (v < 0 ? Math.abs(v) : 0)); // Chart.js will stack; we will use negative dataset rendered downward

  // Projected next-turn
  const projected = current.map((c, i) => c + (deltas[i] ?? 0));

  return { current, positive, negative, projected };
}

function chartOptionsFor(projected) {
  // Outline red if any projected value <= 0
  const danger = projected.some(v => v <= 0);
  return {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      x: { stacked: true, ticks: { color: '#ddd' }},
      y: { stacked: true, beginAtZero: true, ticks: { color: '#ddd' }}
    },
    // store danger flag so caller may set border color on chart canvas via plugin or later
    danger
  };
}

/**
 * Create (or re-create) the chart for a single city
 * @param {*} canvas El canvas DOM node
 * @param {*} city city object
 */
export function createOrUpdateCityChart(canvas, city) {
  const ctx = canvas.getContext('2d');
  const { current, positive, negative, projected } = buildDatasetsForCity(city);

  // destroy old chart if exists
  const existing = cityCharts.get(city.name);
  if (existing) {
    existing.destroy();
    cityCharts.delete(city.name);
  }

  const options = chartOptionsFor(projected);

  // Build a stacked chart where 'current' and 'positive' stack upwards, 'negative' also stacks but we'll show it as negative visually
  const data = {
    labels: RESOURCE_KEYS,
    datasets: [
      { label: 'Current', data: current, stack: 'a', backgroundColor: 'rgba(0,200,255,0.35)', borderColor: options.danger ? 'red' : 'rgba(0,200,255,0.9)', borderWidth: 1 },
      { label: 'Gain', data: positive, stack: 'a', backgroundColor: 'rgba(0,220,0,0.4)' },
      // To visually show loss reducing the stacked height, we will represent losses as negative values in dataset.
      { label: 'Loss', data: negative.map(v => -v), stack: 'a', backgroundColor: 'rgba(255,80,80,0.55)' }
    ]
  };

  const chart = new Chart(ctx, {
    type: 'bar',
    data,
    options
  });

  // store and return
  cityCharts.set(city.name, chart);

  // Add red outline to canvas if any projected <= 0
  canvas.style.border = options.danger ? '2px solid red' : '1px solid #333';
}

/**
 * Update all city charts (recreate)
 */
export function updateAllCityCharts() {
  // find canvases in DOM for each city (they are named canvas-city-{name})
  for (const city of cities) {
    const id = `canvas-city-${cssSafe(city.name)}`;
    const canvas = document.getElementById(id);
    if (!canvas) continue;
    createOrUpdateCityChart(canvas, city);
  }
}

function cssSafe(name) {
  return name.replace(/\s+/g,'-').replace(/[^a-zA-Z0-9-_]/g,'').toLowerCase();
}