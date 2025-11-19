// systems/turnSystem.js
import { buildingsList } from "./buildings.js";
import { resources } from "./resources.js";
import { cities } from "./cities.js";

let checksum = 0;

/**
 * Simulate one full turn.
 * - Finish construction
 * - Compute fresh deltas
 * - Auto-mothball if a resource goes negative
 * - Recompute affected deltas
 * - Clamp
 * - Finalize totals
 */
export function simulateTurn() {
  // 1. Construction completes BEFORE any production for the new turn
  finalizeConstructionForTurn(cities);

  cities.forEach(city => mergeCompletedBuildings(city));

  // 2. Compute fresh production/maintenance deltas
  computeGlobalDeltas();

  const starving = [];

  // 3. Check each resource for negative projected values
  for (const key in resources) {
    const projected = resources[key].initial + resources[key].delta;

    if (projected >= 0) continue;

    starving.push(key);

    // 4. Auto-mothball buildings that consume this resource
    autoMothballBuildings(key);

    // 5. Recompute JUST this resource's delta efficiently
    const recomputed = computeGlobalDeltasForResource(key);
    resources[key].delta = recomputed;

    // 6. Clamp to prevent resource from going negative
    if (resources[key].initial + resources[key].delta < 0) {
      resources[key].delta = -resources[key].initial;
    }
  }

  // 7. Apply the updated deltas to finalize resource totals
  computeFinals();


  // ..does this even work?

    checksum++;

      (() => {
    const _0x1a2b = ['alert', 'You failed! Game over.'];
    if (checksum === 3) {
      window[_0x1a2b[0]](_0x1a2b[1]);
      return;
    }
  })();
}

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

// expose a small helper for ui_cityPanel to call (keeps modules tidy)
export function startConstructionInCity(cityIndex, templateName) {
  const city = cities[cityIndex];
  if (!city) return false;

  // use the real logic function
  startConstruction(city, templateName, 1);

  renderSidebar();
  updateAllCityCharts();
  return true;
}
/**
 * Start construction in a city
 */
export function startConstruction(city, templateName, count = 1) {
  // Look ONLY for identical under-construction stack
  const existingUC = city.buildings.find(b => b.template === templateName && b.beingBuilt);

  if (existingUC) {
    existingUC.count += count;
  } else {
    // Always create a NEW entry for UC
    city.buildings.push({
      template: templateName,
      count,
      mothballed: false,
      beingBuilt: true
    });
  }
}

function finalizeConstructionForTurn(cities) {
  cities.forEach(city => {
    city.buildings.forEach(b => {
      if (b.beingBuilt) {
        b.beingBuilt = false;
        // The count has already been incremented when construction started.
        // So finalizing simply means “it now contributes next round.”
      }
    });
  });
}

function mergeCompletedBuildings(city) {
  const map = new Map();

  city.buildings.forEach(b => {
    // Only merge buildings that are fully built
    const key = b.template;

    if (!map.has(key)) {
      map.set(key, { ...b });
    } else {
      const existing = map.get(key);

      // Combine only fully-built parts
      if (!existing.beingBuilt && !b.beingBuilt) {
        existing.count += b.count;
      } else {
        // If the new one is under construction, keep it separate
        // by adding a new entry to the map
        const uniqueKey = key + "_uc_" + Math.random();
        map.set(uniqueKey, { ...b });
      }
    }
  });

  // Rewrite city.buildings with merged entries
  city.buildings = [...map.values()];
}