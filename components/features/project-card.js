/**
 * Project Card Component
 * Renders a project card with details, status, and metadata
 */

import { escapeHtml, formatDate, truncate } from '../utils/renderer.js';

/**
 * Generate project card HTML
 * @param {Object} project - Project data
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function ProjectCard(project, options = {}) {
  const { showFullDescription = false, showPartners = true } = options;

  const statusBadge = getStatusBadge(project.status);
  const typeBadge = getTypeBadge(project.type);
  const description = showFullDescription
    ? project.description
    : truncate(project.description, 150);

  return `
    <div class="project-card" data-id="${project.id}" data-status="${project.status}" data-type="${project.type}">
      <div class="project-card-header">
        <div class="project-badges">
          ${typeBadge}
          ${statusBadge}
        </div>
        ${project.image ? `
          <div class="project-image">
            <img src="${project.image}" alt="${escapeHtml(project.title)}" loading="lazy" />
          </div>
        ` : ''}
      </div>

      <div class="project-card-content">
        <h3 class="project-title">${escapeHtml(project.title)}</h3>
        ${project.fullTitle && project.fullTitle !== project.title ? `
          <p class="project-subtitle">${escapeHtml(project.fullTitle)}</p>
        ` : ''}

        <div class="project-meta">
          ${project.program ? `
            <div class="project-meta-item">
              <span class="project-meta-label">Program</span>
              <span class="project-meta-value">${escapeHtml(project.program)}</span>
            </div>
          ` : ''}
          ${project.duration ? `
            <div class="project-meta-item">
              <span class="project-meta-label">Duration</span>
              <span class="project-meta-value">${formatDuration(project.duration)}</span>
            </div>
          ` : ''}
          ${project.funding ? `
            <div class="project-meta-item">
              <span class="project-meta-label">Funding</span>
              <span class="project-meta-value">${escapeHtml(project.funding)}</span>
            </div>
          ` : ''}
          ${project.role ? `
            <div class="project-meta-item">
              <span class="project-meta-label">Our Role</span>
              <span class="project-meta-value">${escapeHtml(project.role)}</span>
            </div>
          ` : ''}
        </div>

        <p class="project-description">${escapeHtml(description)}</p>

        ${project.objectives && project.objectives.length > 0 ? `
          <div class="project-objectives">
            <h4>Key Objectives</h4>
            <ul>
              ${project.objectives.slice(0, 3).map(obj => `<li>${escapeHtml(obj)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${showPartners && project.partners && project.partners.length > 0 ? `
          <div class="project-partners">
            <h4>Partners</h4>
            <div class="partner-logos">
              ${project.partners.map(partner => `
                <div class="partner-logo" title="${escapeHtml(partner.name)}">
                  <img src="${partner.logo || 'https://via.placeholder.com/120x50/F3F4F6/6B7280?text=' + partner.name.substring(0, 3)}" alt="${escapeHtml(partner.name)}" loading="lazy" />
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${project.tags && project.tags.length > 0 ? `
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Get status badge HTML
 * @private
 */
function getStatusBadge(status) {
  const statusMap = {
    active: { label: 'Active', class: 'badge-success' },
    completed: { label: 'Completed', class: 'badge-info' },
    upcoming: { label: 'Upcoming', class: 'badge-warning' },
  };

  const statusData = statusMap[status] || { label: status, class: 'badge-default' };

  return `<span class="badge ${statusData.class}">${statusData.label}</span>`;
}

/**
 * Get type badge HTML
 * @private
 */
function getTypeBadge(type) {
  const typeMap = {
    'EU-funded': { label: 'EU', class: 'badge-eu' },
    National: { label: 'National', class: 'badge-national' },
    Industry: { label: 'Industry', class: 'badge-industry' },
    Internal: { label: 'Internal', class: 'badge-internal' },
  };

  const typeData = typeMap[type] || { label: type, class: 'badge-default' };

  return `<span class="badge ${typeData.class}">${typeData.label}</span>`;
}

/**
 * Format duration from start/end dates
 * @private
 */
function formatDuration(duration) {
  if (!duration) return '';

  const start = formatDate(duration.start, { year: 'numeric', month: 'short' });
  const end = duration.ongoing
    ? 'Present'
    : formatDate(duration.end, { year: 'numeric', month: 'short' });

  return `${start} - ${end}`;
}

/**
 * Render multiple project cards
 * @param {Array} projects - Array of project objects
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function ProjectCardList(projects, options = {}) {
  return projects.map(project => ProjectCard(project, options)).join('');
}

/**
 * Sort projects chronologically (newest first)
 * @param {Array} projects - Array of project objects
 * @returns {Array} Sorted projects
 */
export function sortProjectsChronologically(projects) {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.duration?.start || 0);
    const dateB = new Date(b.duration?.start || 0);
    return dateB - dateA; // Newest first
  });
}

/**
 * Filter projects by status
 * @param {Array} projects - Array of project objects
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered projects
 */
export function filterByStatus(projects, status) {
  if (!status || status === 'all') return projects;
  return projects.filter(p => p.status === status);
}

/**
 * Filter projects by type
 * @param {Array} projects - Array of project objects
 * @param {string} type - Type to filter by
 * @returns {Array} Filtered projects
 */
export function filterByType(projects, type) {
  if (!type || type === 'all') return projects;
  return projects.filter(p => p.type === type);
}

export default ProjectCard;
