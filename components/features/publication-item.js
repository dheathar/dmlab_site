/**
 * Publication Item Component
 * Renders a publication list item with citation, metadata, and actions
 */

import { escapeHtml } from '../utils/renderer.js';

/**
 * Generate publication item HTML
 * @param {Object} publication - Publication data
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function PublicationItem(publication, options = {}) {
  const { showAbstract = false, showTags = true } = options;

  const authors = formatAuthors(publication.authors);
  const typeBadge = getTypeBadge(publication.type);

  return `
    <div class="publication" data-id="${publication.id}" data-year="${publication.year}" data-type="${publication.type}">
      <div class="publication-header">
        <span class="publication-year">${publication.year}</span>
        <div class="publication-content">
          <h3 class="publication-title">${escapeHtml(publication.title)}</h3>
          <p class="publication-authors">${authors}</p>
          <p class="publication-venue">
            ${typeBadge}
            ${escapeHtml(publication.venue)}
          </p>

          ${showAbstract && publication.abstract ? `
            <p class="publication-abstract">${escapeHtml(publication.abstract)}</p>
          ` : ''}

          ${showTags && publication.tags && publication.tags.length > 0 ? `
            <div class="publication-tags">
              ${publication.tags.map(tag => `<span class="tag tag-sm">${escapeHtml(tag)}</span>`).join('')}
            </div>
          ` : ''}

          <div class="publication-links">
            ${publication.pdf ? `
              <a href="${publication.pdf}" target="_blank" rel="noopener" class="publication-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                PDF
              </a>
            ` : ''}
            ${publication.doi ? `
              <a href="https://doi.org/${publication.doi}" target="_blank" rel="noopener" class="publication-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                DOI
              </a>
            ` : ''}
            <button class="publication-link" onclick="copyBibtex('${publication.id}')" aria-label="Copy BibTeX citation">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              BibTeX
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Format authors list
 * @private
 */
function formatAuthors(authors) {
  if (!authors || authors.length === 0) return '';

  if (authors.length <= 3) {
    return authors.map(escapeHtml).join(', ');
  }

  // More than 3 authors: show first 3 and "et al."
  const firstThree = authors.slice(0, 3).map(escapeHtml).join(', ');
  return `${firstThree}, <em>et al.</em>`;
}

/**
 * Get publication type badge
 * @private
 */
function getTypeBadge(type) {
  const typeMap = {
    journal: { label: 'Journal', icon: '📄' },
    conference: { label: 'Conference', icon: '🎤' },
    'book-chapter': { label: 'Book Chapter', icon: '📚' },
    workshop: { label: 'Workshop', icon: '🔧' },
    preprint: { label: 'Preprint', icon: '📝' },
  };

  const typeData = typeMap[type] || { label: type, icon: '📄' };

  return `<span class="publication-type" title="${typeData.label}">${typeData.icon}</span>`;
}

/**
 * Generate BibTeX citation
 * @param {Object} publication - Publication data
 * @returns {string} BibTeX string
 */
export function generateBibtex(publication) {
  const { id, title, authors, year, venue, doi } = publication;

  const authorStr = authors.join(' and ');
  const key = `${authors[0].split(' ').pop()}${year}`;

  return `@article{${key},
  title={${title}},
  author={${authorStr}},
  journal={${venue}},
  year={${year}}${doi ? `,\n  doi={${doi}}` : ''}
}`;
}

/**
 * Copy BibTeX to clipboard (to be called from HTML)
 * @param {string} publicationId - Publication ID
 */
window.copyBibtex = async function (publicationId) {
  try {
    // This would need access to the publication data
    // For now, show a message
    const bibtexText = `@article{${publicationId},\n  // BibTeX citation\n}`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(bibtexText);
      showToast('BibTeX copied to clipboard!');
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = bibtexText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('BibTeX copied to clipboard!');
    }
  } catch (error) {
    console.error('Failed to copy BibTeX:', error);
    showToast('Failed to copy BibTeX', 'error');
  }
};

/**
 * Show toast notification
 * @private
 */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

/**
 * Render multiple publication items
 * @param {Array} publications - Array of publication objects
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function PublicationList(publications, options = {}) {
  return publications.map(pub => PublicationItem(pub, options)).join('');
}

/**
 * Group publications by year
 * @param {Array} publications - Array of publication objects
 * @returns {Object} Publications grouped by year
 */
export function groupByYear(publications) {
  const grouped = {};

  publications.forEach(pub => {
    const year = pub.year;
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(pub);
  });

  // Sort years in descending order
  const sortedYears = Object.keys(grouped).sort((a, b) => b - a);

  const sortedGrouped = {};
  sortedYears.forEach(year => {
    sortedGrouped[year] = grouped[year];
  });

  return sortedGrouped;
}

/**
 * Filter publications by year
 * @param {Array} publications - Array of publication objects
 * @param {number} year - Year to filter by
 * @returns {Array} Filtered publications
 */
export function filterByYear(publications, year) {
  if (!year || year === 'all') return publications;
  return publications.filter(p => p.year === parseInt(year));
}

/**
 * Filter publications by type
 * @param {Array} publications - Array of publication objects
 * @param {string} type - Type to filter by
 * @returns {Array} Filtered publications
 */
export function filterByType(publications, type) {
  if (!type || type === 'all') return publications;
  return publications.filter(p => p.type === type);
}

/**
 * Filter publications by tag
 * @param {Array} publications - Array of publication objects
 * @param {string} tag - Tag to filter by
 * @returns {Array} Filtered publications
 */
export function filterByTag(publications, tag) {
  if (!tag || tag === 'all') return publications;
  return publications.filter(p => p.tags && p.tags.includes(tag));
}

export default PublicationItem;
