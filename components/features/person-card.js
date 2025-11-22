/**
 * Person Card Component
 * Renders a team member card with photo, info, and links
 */

import { escapeHtml } from '../utils/renderer.js';

/**
 * Generate person card HTML
 * @param {Object} person - Person data
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function PersonCard(person, options = {}) {
  const { showBio = true, showLinks = true, compact = false } = options;

  const links = generateLinks(person.links, person.name);
  const interests = person.researchInterests
    ? person.researchInterests.slice(0, 3).join(', ')
    : '';

  return `
    <div class="team-member" data-role="${person.role}" data-id="${person.id}">
      <div class="team-member-image">
        <img
          src="${person.image || 'https://via.placeholder.com/150/F3F4F6/6B7280?text=' + getInitials(person.name)}"
          alt="${escapeHtml(person.name)}"
          loading="lazy"
        />
      </div>
      <h3 class="team-member-name">${escapeHtml(person.name)}</h3>
      <p class="team-member-title">${escapeHtml(person.title)}</p>
      ${interests ? `<p class="team-member-interests">${escapeHtml(interests)}</p>` : ''}
      ${showBio && person.bio ? `<p class="team-member-bio">${escapeHtml(person.bio)}</p>` : ''}
      ${showLinks && links ? `<div class="team-member-links">${links}</div>` : ''}
    </div>
  `;
}

/**
 * Generate social/academic links
 * @private
 */
function generateLinks(links, name) {
  if (!links) return '';

  const linkElements = [];

  if (links.googleScholar) {
    linkElements.push(
      `<a href="${links.googleScholar}" target="_blank" rel="noopener" aria-label="${name} Google Scholar">Google Scholar</a>`
    );
  }

  if (links.orcid) {
    linkElements.push(
      `<a href="${links.orcid}" target="_blank" rel="noopener" aria-label="${name} ORCID">ORCID</a>`
    );
  }

  if (links.linkedin) {
    linkElements.push(
      `<a href="${links.linkedin}" target="_blank" rel="noopener" aria-label="${name} LinkedIn">LinkedIn</a>`
    );
  }

  if (links.github) {
    linkElements.push(
      `<a href="${links.github}" target="_blank" rel="noopener" aria-label="${name} GitHub">GitHub</a>`
    );
  }

  if (links.personalWebsite) {
    linkElements.push(
      `<a href="${links.personalWebsite}" target="_blank" rel="noopener" aria-label="${name} Personal Website">Website</a>`
    );
  }

  return linkElements.join('');
}

/**
 * Get initials from name
 * @private
 */
function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Render multiple person cards
 * @param {Array} people - Array of person objects
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function PersonCardList(people, options = {}) {
  return people.map(person => PersonCard(person, options)).join('');
}

/**
 * Filter people by role
 * @param {Array} people - Array of person objects
 * @param {string} role - Role to filter by
 * @returns {Array} Filtered people
 */
export function filterByRole(people, role) {
  if (!role || role === 'all') return people;
  return people.filter(p => p.role === role);
}

export default PersonCard;
