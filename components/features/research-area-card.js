/**
 * Research Area Card Component
 * Renders a research area card with topics and related info
 */

import { escapeHtml, truncate } from '../utils/renderer.js';

/**
 * Generate research area card HTML
 * @param {Object} area - Research area data
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function ResearchAreaCard(area, options = {}) {
  const { compact = false, showTopics = true } = options;

  const description = compact
    ? truncate(area.shortDescription || area.fullDescription, 120)
    : area.fullDescription || area.shortDescription;

  return `
    <div class="feature-card" data-id="${area.id}">
      <div class="feature-icon">
        ${getIcon(area.icon)}
      </div>
      <h3 class="feature-title">${escapeHtml(area.title)}</h3>
      <p class="feature-description">${escapeHtml(description)}</p>

      ${showTopics && area.topics && area.topics.length > 0 ? `
        <div class="research-topics">
          <h4>Key Topics</h4>
          <ul class="topics-list">
            ${area.topics.slice(0, compact ? 4 : 8).map(topic => `
              <li>${escapeHtml(topic)}</li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      ${area.relatedPublications && area.relatedPublications.length > 0 ? `
        <div class="research-meta">
          <span class="meta-badge">${area.relatedPublications.length} Publications</span>
        </div>
      ` : ''}

      ${area.relatedProjects && area.relatedProjects.length > 0 ? `
        <div class="research-meta">
          <span class="meta-badge">${area.relatedProjects.length} Projects</span>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Get icon SVG based on icon name
 * @private
 */
function getIcon(iconName) {
  const icons = {
    database: `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    `,
    cpu: `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <rect x="9" y="9" width="6" height="6"></rect>
        <line x1="9" y1="1" x2="9" y2="4"></line>
        <line x1="15" y1="1" x2="15" y2="4"></line>
        <line x1="9" y1="20" x2="9" y2="23"></line>
        <line x1="15" y1="20" x2="15" y2="23"></line>
        <line x1="20" y1="9" x2="23" y2="9"></line>
        <line x1="20" y1="14" x2="23" y2="14"></line>
        <line x1="1" y1="9" x2="4" y2="9"></line>
        <line x1="1" y1="14" x2="4" y2="14"></line>
      </svg>
    `,
    'bar-chart': `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="20" x2="12" y2="10"></line>
        <line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="16"></line>
      </svg>
    `,
    'trending-up': `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    `,
    'message-circle': `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    `,
    'book-open': `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    `,
  };

  return icons[iconName] || icons.database;
}

/**
 * Render multiple research area cards
 * @param {Array} areas - Array of research area objects
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function ResearchAreaCardList(areas, options = {}) {
  return areas.map(area => ResearchAreaCard(area, options)).join('');
}

export default ResearchAreaCard;
