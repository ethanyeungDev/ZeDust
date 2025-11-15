// systems/turnSystem.js
import { buildingsList } from "./buildings.js";
import { resources, applyResourceDelta, zeroDelta } from "./resources.js";
import { cities } from "./cities.js";

export function simulateTurn() {
  const starving = [];
  const next = {}; // projected next-turn values

  // --- STEP 0: Reset all deltas ---
  for (const key in resources) {
    resources[key].delta = 0;
  }

  // --- STEP 1: Apply buildings production/maintenance ---
  for (const city of cities) {
    for (const b of city.buildings) {
      if (b.beingBuilt) {
        b.beingBuilt = false; // construction completes this turn
        continue;
      }

      if (b.mothballed) continue;

      const tpl = buildingsList[b.template];

      for (const r in tpl.deltas) {
        if (r in resources) {
          resources[r].delta += tpl.deltas[r] * b.count;
        }
      }
    }
  }

  // --- STEP 2: Compute projected next-turn values ---
  for (const key in resources) {
    next[key] = resources[key].initial + resources[key].delta;
  }

  // --- STEP 3: Auto-mothball to prevent negatives ---
  for (const key in next) {
    if (next[key] >= 0) continue;

    starving.push(key);

    // Your existing helper function
    autoMothballBuildingsAffecting(key, resources);

    // Recalculate after mothballing
    next[key] = resources[key].initial + resources[key].delta;

    // Clamp if still negative
    if (next[key] < 0) {
      resources[key].delta = -resources[key].initial;
      next[key] = 0;
    }
  }

  // --- STEP 4: Apply deltas to final values ---
  for (const key in resources) {
    resources[key].final = resources[key].initial + resources[key].delta;
  }

  // --- STEP 5: Warnings ---
  for (const key of starving) {
    if (resources[key].final === 0) warnResourceZero(key);
  }

  // --- STEP 6: Update Charts ---
  updateCharts();
  updateAllCityCharts();
}


// export function simulateTurn() {
//   // Step 0: Reset all deltas at start of turn
//   resetDeltas();

//   const baseDelta = computeGlobalDeltas(); 
//   const turnDelta = structuredClone(baseDelta);

//   const starving = [];
//   const next = {}; // projected next-turn final values

//   // --- STEP 1: Apply construction completion & adjust deltas ---
//   for (const city of cities) {
//     for (const b of city.buildings) {

//       if (b.beingBuilt) {
//         b.beingBuilt = false; // completes this turn
//         continue;
//       }

//       if (b.mothballed) continue;

//       const tpl = buildingsList[b.template];

//       for (const key in tpl.deltas) {
//         if (resources[key]) {
//           resources[key].delta += tpl.deltas[key] * b.count;
//         }
//       }
//     }
//   }

//   // --- STEP 2: Build initial projection ---
//   for (const key in resources) {
//     next[key] = resources[key].initial + resources[key].delta;
//   }

//   // --- STEP 3: Auto-mothballing to prevent negatives ---
//   for (const key in next) {
//     if (next[key] >= 0) continue;

//     starving.push(key);

//     autoMothballBuildingsAffecting(key, resources); // Adjust resources[key].delta inside

//     // recalc projection after mothballing
//     next[key] = resources[key].initial + resources[key].delta;

//     if (next[key] < 0) {
//       // Clamp
//       resources[key].delta = -resources[key].initial;
//       next[key] = 0;
//     }
//   }

//   // --- STEP 4: Compute final values ---
//   computeFinals();

//   // --- STEP 5: Warnings ---
//   for (const key of starving) {
//     if (resources[key].final === 0) warnResourceZero(key);
//   }

//   // --- STEP 6: Charts ---
//   updateCharts() ; // pass the normalized object

// //   return {
// //     appliedDelta: Object.fromEntries(
// //       Object.entries(resources).map(([k, v]) => [k, v.delta])
// //     ),
// //     projected: Object.fromEntries(
// //       Object.entries(resources).map(([k, v]) => [k, v.final])
// //     )
// //   };
// }

function autoMothballBuildingsAffecting(resourceKey, turnDelta, next) {
  // Find all buildings with negative effect on resource
  const offenders = [];

  for (const city of cities) {
    for (const b of city.buildings) {
      if (b.mothballed) continue;

      const tpl = buildingsList[b.template];
      const rate = tpl.deltas[resourceKey];

      if (rate < 0) {
        offenders.push({ city, b, rate });
      }
    }
  }

  // Largest (most negative) consumers first
  offenders.sort((a, b) => a.rate - b.rate);

  for (const { b, rate } of offenders) {
    if (next[resourceKey] >= 0) return; // fixed

    // Mothball
    b.mothballed = true;

    // Remove their consumption from turnDelta
    turnDelta[resourceKey] -= rate * b.count;

    // Recalculate projected
    next[resourceKey] = resources[resourceKey] + turnDelta[resourceKey];
  }
}


export function projectedNextTurnValues() {
  const deltas = computeGlobalDeltas();
  const next = {};

  for (const key in resources) {
    next[key] = resources[key] + deltas[key];
  }

  return next;
}
//Strategic functions

//I am perfectly aware that the clean way to do this is to have my code in separate modules and import them into the master file. Ideally I would have a separate strategicLib and a UILib. However that wasn't in our notes and I don't have enough time to learn how to do that.

//past me was a fool for thinking the above
// cityLogic.js


// --- Helpers ---

export function getBuildingTemplate(name) {
  return buildingsList.find(b => b.name === name);
}

//I don't think I need this

export function computeCityTotals(city) {
  const totals = Object.fromEntries(
    Object.keys(buildingsList[0].deltas).map(k => [k, 0])
  );

  for (const b of city.buildings) {
    if (b.mothballed || b.beingBuilt) continue;
    const t = getBuildingTemplate(b.template);

    for (const [k, v] of Object.entries(t.deltas)) {
      totals[k] += v * b.count;
    }
  }

  return totals;
}

// --- Construction ---

export function startConstruction(city, templateName, count = 1) {
  const existing = city.buildings.find(b => b.template === templateName);

  if (existing) {
    existing.beingBuilt = true;
    existing.count += count;
  } else {
    city.buildings.push({
      template: templateName,
      count,
      mothballed: false,
      beingBuilt: true
    });
  }
}

// --- City Tick ---

export function advanceCityTurn(city) {
  const totals = computeCityTotals(city);

  // Apply totals to city resources
  for (const [key, val] of Object.entries(totals)) {
    if (key in city.resources) {
      city.resources[key] += val;
    }
  }

  // Complete all 1-turn construction
  for (const b of city.buildings) {
    if (b.beingBuilt) {
      b.beingBuilt = false;
    }
  }
}

export function computeGlobalDeltas() {
  // Reset deltas
  for (const key in resources) {
    resources[key].delta = 0;
  }

  // Sum all cities’ production/maintenance
  for (const c of cities) {
    const totals = computeCityTotals(c);

    for (const key in resources) {
      if (key in totals) {
        resources[key].delta += totals[key];
      }
    }
  }

}


// Reset all deltas to 0 at start of turn
export function resetDeltas() {
  for (const r of Object.values(resources)) {
    r.delta = 0;
  }
}

// Apply the delta to compute final values
export function computeFinals() {
  for (const r of Object.values(resources)) {
    r.final = r.initial + r.delta;
  }
}

// Commit final values as new initial values for next turn
export function commitTurn() {
  for (const r of Object.values(resources)) {
    r.initial = r.final;
    r.delta = 0;
  }
}

// Apply a delta object to the resources
export function applyDelta(delta) {
  for (const key in delta) {
    if (resources[key]) resources[key].delta += delta[key];
  }
}