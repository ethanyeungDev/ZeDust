// systems/turnSystem.js
import { buildingsList } from "./buildings.js";
import { resources } from "./resources.js";
import { cities } from "./cities.js";

/**
 * Reset all resource deltas to 0
 */
export function resetDeltas() {
  for (const r of Object.values(resources)) {
    r.delta = 0;
  }
}

/**
 * Compute total production/consumption for a city
 */
export function computeCityTotals(city) {
  const totals = Object.fromEntries(Object.keys(buildingsList[0].deltas).map(k => [k, 0]));

  for (const b of city.buildings) {
    if (b.mothballed || b.beingBuilt) continue;
    const tpl = buildingsList.find(bl => bl.name === b.template);
    if (!tpl) continue;
    for (const [k, v] of Object.entries(tpl.deltas)) {
      totals[k] += v * b.count;
    }
  }
  return totals;
}

/**
 * Compute global deltas across all cities
 */
export function computeGlobalDeltas() {
  resetDeltas();
  for (const city of cities) {
    const cityTotals = computeCityTotals(city);
    for (const key in cityTotals) {
      if (resources[key]) resources[key].delta += cityTotals[key];
    }
  }
}

/**
 * Apply deltas to compute final values
 */
export function computeFinals() {
  for (const key in resources) {
    const r = resources[key];
    r.final = r.initial + r.delta;
  }
}

/**
 * Commit final values as new initial values
 */
export function commitTurn() {
  for (const r of Object.values(resources)) {
    r.initial = r.final;
    r.delta = 0;
  }
}

/**
 * Compute projected next-turn values without committing
 */
export function projectedNextTurnValues() {
  computeGlobalDeltas();
  const next = {};
  for (const key in resources) {
    next[key] = resources[key].initial + resources[key].delta;
  }
  return next;
}

/**
 * Simulate a full turn: apply building outputs, handle mothballing to prevent negatives, and update finals
 */
export function simulateTurn() {
  computeGlobalDeltas();

  const starving = [];

  // Auto-mothball buildings if a resource would go negative
  for (const key in resources) {
    const projected = resources[key].initial + resources[key].delta;
    if (projected >= 0) continue;

    starving.push(key);
    autoMothballBuildings(key);

    // Recalculate after mothballing
    resources[key].delta = computeGlobalDeltasForResource(key);

    // Clamp if still negative
    if (resources[key].initial + resources[key].delta < 0) {
      resources[key].delta = -resources[key].initial;
    }
  }

  computeFinals();
}

/**
 * Auto-mothball buildings that consume a specific resource
 */
function autoMothballBuildings(resourceKey) {
  const offenders = [];
  for (const city of cities) {
    for (const b of city.buildings) {
      if (b.mothballed) continue;
      const tpl = buildingsList.find(t => t.name === b.template);
      const rate = tpl?.deltas[resourceKey] ?? 0;
      if (rate < 0) offenders.push({ city, b, rate });
    }
  }

  offenders.sort((a, b) => a.rate - b.rate);

  for (const { b, rate } of offenders) {
    if (resources[resourceKey].initial + resources[resourceKey].delta >= 0) break;
    b.mothballed = true;
  }
}

/**
 * Compute global delta for a specific resource
 */
function computeGlobalDeltasForResource(key) {
  let total = 0;
  for (const city of cities) {
    for (const b of city.buildings) {
      if (b.mothballed || b.beingBuilt) continue;
      const tpl = buildingsList.find(t => t.name === b.template);
      if (!tpl) continue;
      total += (tpl.deltas[key] ?? 0) * b.count;
    }
  }
  return total;
}

/**
 * Start construction in a city
 */
export function startConstruction(city, templateName, count = 1) {
  const existing = city.buildings.find(b => b.template === templateName);
  if (existing) {
    existing.beingBuilt = true;
    existing.count += count;
  } else {
    city.buildings.push({ template: templateName, count, mothballed: false, beingBuilt: true });
  }
}
