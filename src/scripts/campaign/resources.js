//The initial value here is the initial value of resources available to the player. 

// export const resources = {
//   credits: 20, commonMetal: 10, heavyMachinery: 4, specialMetals: 10,
//   fissiles: 5, IC: 20, innovation: 0, stability: 4, pop: 50,
//   gridScale: 10, rations: 100
// };

export const resources = {
  credits: {
    initial: 20,
    delta: 0,
    final: 20
  },
  commonMetal: {
    initial: 10,
    delta: 0,
    final: 10
  },
  heavyMachinery: {
    initial: 4,
    delta: 0,
    final: 4
  },
  specialMetals: {
    initial: 10,
    delta: 0,
    final: 10
  },
  fissiles: {
    initial: 5,
    delta: 0,
    final: 5
  },
  IC: {
    initial: 20,
    delta: 0,
    final: 20
  },
  innovation: {
    initial: 0,
    delta: 0,
    final: 0
  },
  stability: {
    initial: 4,
    delta: 0,
    final: 4
  },
  pop: {
    initial: 50,
    delta: 0,
    final: 50
  },
  gridScale: {
    initial: 10,
    delta: 0,
    final: 10
  },
  rations: {
    initial: 100,
    delta: 0,
    final: 100
  }
};


export function applyResourceDelta(delta) {
  for (const resourceIndex in delta) {
    resources[resourceIndex] = (resources[resourceIndex] ?? 0) + delta[resourceIndex];
  }
}

//Originally I wasn't going to have a base object delta at all, but I ultimately refactored out the "set 0 if null" out of my functions because it was getting hard to read.
export function zeroDelta() {
  return {
    credits: 0, commonMetal: 0, heavyMachinery: 0, specialMetals: 0,
    fissiles: 0, IC: 0, innovation: 0, stability: 0, pop: 0,
    gridScale: 0, rations: 0
  };
}