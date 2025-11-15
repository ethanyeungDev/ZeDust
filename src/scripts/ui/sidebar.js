
  //dang the white on black looks pretty good actually


// ui/sidebar.js
import { cities } from '../campaign/cities.js';
import { createCityPanel } from './cityPanel.js';

export function renderSidebar() {
  const container = document.getElementById('citySidebar');
  if (!container) {
    console.error("Cannot find #citySidebar in the DOM");
    return;
  }

  container.innerHTML = ''; // clear existing content
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '1rem';
  container.style.padding = '1rem';
  container.style.justifyContent = 'flex-start';
  container.style.alignItems = 'flex-start';

  // Optional overall title for the sidebar
  const title = document.createElement('div');
  title.style.width = '100%';
  title.innerHTML = `<h2 style="margin:0 0 0.75rem 0; text-align:center; color:white; font-size:1.2rem; box-shadow: 0 0 10px rgba(188,220,230,0.4);">City Manager</h2>`;
  container.appendChild(title);

  cities.forEach((city, idx) => {
    const panel = createCityPanel(city, idx);
    container.appendChild(panel);
  });
}