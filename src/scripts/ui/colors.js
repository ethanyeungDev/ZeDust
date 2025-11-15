// ui_colors.js
// central color / class helpers for resource values

//I've completely lost control of the situation and don't know why I need these for the charts

//oh I'm applying html tags, that makes more sense

export function valueClassFor(v) {
  if (v > 0) return 'positive';
  if (v < 0) return 'negative';
  return 'zero';
}

// call to apply coloring classes to a DOM element (adds .positive/.negative/.zero)
export function applyValueClass(el, value) {
  el.classList.remove('positive','negative','zero');
  el.classList.add(valueClassFor(value));
}