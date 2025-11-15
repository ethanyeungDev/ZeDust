// ui_colors.js
// central color / class helpers for resource values

//I've completely lost control of the situation and don't know why I need these for the charts



export function valueClassFor(v) {
  if (v > 0) return 'positive';
  if (v < 0) return 'negative';
  return 'zero';
}

//oh I'm applying html tags, that makes more sense

// purging that but leaving it for posterity because it was very funny

// // call to apply coloring classes to a DOM element (adds .positive/.negative/.zero)
// export function applyValueClass(el, value) {
//   el.classList.remove('positive','negative','zero');
//   el.classList.add(valueClassFor(value));
// }

export function applyValueClass(value) {
  return valueClassFor(value);
}