
import { cities } from '../campaign/cities.js';
import { createCityPanel } from './cityPanel.js';

/**
 * Render the entire sidebar and attach it to #rightSidebar
 */
export function renderSidebar() {
  const container = document.getElementById('citySidebar');
  container.innerHTML = ''; // clear

  const title = document.createElement('div');
  //dang the white on black looks pretty good actually
  title.innerHTML = `<h2 style="margin:0 0 0.75rem 0; text-align: center; color:white; box-shadow: 0 0 10px rgba(188, 220, 230, 0.4); font-size:1.1rem;">City Manager</h2>`;
  container.appendChild(title);

  cities.forEach((city, idx) => {
    const panel = createCityPanel(city, idx);
    container.appendChild(panel);
  });
}
