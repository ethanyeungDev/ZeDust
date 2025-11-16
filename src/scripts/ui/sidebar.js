import { cities } from '../campaign/cities.js';
import { createCityPanel } from './cityPanel.js';

/**
 * Render the sidebar with all city panels side by side
 */
export function renderSidebar() {
  const container = document.getElementById('citySidebar');
  if (!container) return;
  container.innerHTML = '';

  // Flex layout for horizontal city panels
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '1rem';
  container.style.justifyContent = 'flex-start';
  container.style.alignItems = 'flex-start';
  container.style.width = '50vw'; // go all the way to the middle of the page
  container.style.maxWidth = '100%';
  container.style.paddingRight = '1rem';

  // Optional title
  const title = document.createElement('div');
  title.innerHTML = `<h2 style="margin:0 0 0.75rem 0; text-align: center; color:white; font-size:1.3rem;">City Manager</h2>`;
  title.style.width = '100%';
  container.appendChild(title);

  cities.forEach((city, idx) => {
    const panel = createCityPanel(city, idx);
    container.appendChild(panel);
  });
}
