import { resources } from "../campaign/resources.js";
import { cities } from "../campaign/cities.js";
// import { projectedNextTurnValues } from "../campaign/turnSystem.js"; 

// This file handles the nice big 

let resourceChart;

export function initCharts() {
  const ctx = document.getElementById("resourceChart");

  const labels = Object.keys(resources);

  const initialData = labels.map(k => resources[k].initial);
  const deltaData = labels.map(k => resources[k].delta);

  const borderColors = labels.map(k => (resources[k].final <= 0 ? "red" : "black"));
  const backgroundColors = labels.map(k => (resources[k].delta >= 0 ? "rgba(0,200,0,0.7)" : "rgba(200,0,0,0.7)"));

  resourceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Initial",
          data: initialData,
          backgroundColor: "rgba(100,100,100,0.5)",
          borderColor: borderColors,
          borderWidth: 2,
          stack: "netStack"
        },
        {
          label: "Delta",
          data: deltaData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          stack: "netStack"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          bottom: 40 // extra space for labels
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            align: "center",
            font: { size: 12 } // prevent label overflow
          }
        },
        y: {
          stacked: true,
          beginAtZero: true
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const key = context.label;
              const delta = resources[key].delta;
              const final = resources[key].final;
              return `${key}: ${final} (${delta >= 0 ? "+" : ""}${delta})`;
            }
          }
        }
      }
    }
  });
}

export function updateCharts() {
  if (!resourceChart) return;

  const labels = Object.keys(resources);
  const deltaData = labels.map(k => resources[k].delta);
  const initialData = labels.map(k => resources[k].initial);

  const borderColors = labels.map(k => (resources[k].final <= 0 ? "red" : "black"));
  const backgroundColors = labels.map(k => (resources[k].delta >= 0 ? "rgba(0,200,0,0.7)" : "rgba(200,0,0,0.7)"));

  resourceChart.data.labels = labels;
  resourceChart.data.datasets[0].data = initialData;
  resourceChart.data.datasets[1].data = deltaData;
  resourceChart.data.datasets[1].backgroundColor = backgroundColors;
  resourceChart.data.datasets.forEach(ds => (ds.borderColor = borderColors));

  resourceChart.update();
}


//this chart was built with salamanca blood and was the last working copy. I don't have enough functioning braincells to remember the safe git versions any more.

// export function initCharts() {
//   const ctx = document.getElementById("resourceChart");

//   const labels = Object.keys(resources);

//   const initialData = labels.map(k => resources[k].initial);
//   const positiveData = labels.map(k => Math.max(resources[k].delta, 0));
//   const negativeData = labels.map(k => Math.min(resources[k].delta, 0));
//   const borderColors = labels.map(k => (resources[k].final <= 0 ? "red" : "black"));

//   resourceChart = new Chart(ctx, {
//     type: "bar",
//     data: {
//       labels,
//       datasets: [
//         {
//           label: "Initial",
//           data: initialData,
//           backgroundColor: "rgba(100,100,100,0.5)",
//           borderColor: borderColors,
//           borderWidth: 2,
//           stack: "stack1"
//         },
//         {
//           label: "Positive Delta",
//           data: positiveData,
//           backgroundColor: "rgba(0,200,0,0.7)",
//           borderColor: borderColors,
//           borderWidth: 2,
//           stack: "stack1"
//         },
//         {
//           label: "Negative Delta",
//           data: negativeData.map(v => Math.abs(v)), // convert to positive height
//           backgroundColor: "rgba(200,0,0,0.7)",
//           borderColor: borderColors,
//           borderWidth: 2,
//           stack: "stack2" // separate stack for negative values
//         }
//       ]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       indexAxis: 'y', // horizontal bars, optional if you prefer
//       scales: {
//         x: {
//           stacked: true,
//           beginAtZero: true
//         },
//         y: {
//           stacked: true
//         }
//       },
//       plugins: {
//         tooltip: {
//           callbacks: {
//             label: function(context) {
//               const label = context.dataset.label || '';
//               const value = context.parsed.x;
//               return `${label}: ${value}`;
//             }
//           }
//         }
//       }
//     }
//   });
// }

// export function updateCharts() {
//   if (!resourceChart) return;

//   const labels = Object.keys(resources);

//   const initialData = labels.map(k => resources[k].initial);
//   const positiveData = labels.map(k => Math.max(resources[k].delta, 0));
//   const negativeData = labels.map(k => Math.min(resources[k].delta, 0));
//   const borderColors = labels.map(k => (resources[k].final <= 0 ? "red" : "black"));

//   resourceChart.data.labels = labels;
//   resourceChart.data.datasets[0].data = initialData;
//   resourceChart.data.datasets[1].data = positiveData;
//   resourceChart.data.datasets[2].data = negativeData.map(v => Math.abs(v));

//   resourceChart.data.datasets.forEach(dataset => {
//     dataset.borderColor = borderColors;
//   });

//   resourceChart.update();
// }

