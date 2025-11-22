/**
 * Publications Page - Modern Academic Design
 * Handles filtering, searching, and BibTeX export functionality
 */

// State management
let allPublications = [];
let filteredPublications = [];
let currentFilters = {
    year: '',
    type: '',
    search: ''
};

// DOM Elements
const publicationsContainer = document.getElementById('publicationsContainer');
const emptyState = document.getElementById('emptyState');
const yearFilter = document.getElementById('yearFilter');
const typeFilter = document.getElementById('typeFilter');
const searchInput = document.getElementById('searchInput');
const clearFiltersBtn = document.getElementById('clearFilters');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadPublications();
    setupEventListeners();
    renderPublications();
});

// Load publications from JSON
async function loadPublications() {
    try {
        const response = await fetch('../data/publications.json');
        const data = await response.json();
        allPublications = data.publications || [];
        filteredPublications = [...allPublications];

        // Populate year filter
        populateYearFilter();
    } catch (error) {
        console.error('Error loading publications:', error);
        showError();
    }
}

// Populate year filter dropdown
function populateYearFilter() {
    const years = [...new Set(allPublications.map(pub => pub.year))].sort((a, b) => b - a);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    yearFilter.addEventListener('change', handleFilterChange);
    typeFilter.addEventListener('change', handleFilterChange);
    searchInput.addEventListener('input', debounce(handleSearchChange, 300));
    clearFiltersBtn.addEventListener('click', clearAllFilters);
}

// Handle filter changes
function handleFilterChange(e) {
    const filterType = e.target.id.replace('Filter', '');
    currentFilters[filterType] = e.target.value;
    applyFilters();
}

// Handle search input
function handleSearchChange(e) {
    currentFilters.search = e.target.value.toLowerCase();
    applyFilters();
}

// Apply all filters
function applyFilters() {
    filteredPublications = allPublications.filter(pub => {
        // Year filter
        if (currentFilters.year && pub.year !== parseInt(currentFilters.year)) {
            return false;
        }

        // Type filter
        if (currentFilters.type && pub.type !== currentFilters.type) {
            return false;
        }

        // Search filter (searches title, authors, abstract, keywords)
        if (currentFilters.search) {
            const searchStr = currentFilters.search;
            const titleMatch = pub.title.toLowerCase().includes(searchStr);
            const authorsMatch = pub.authors.join(' ').toLowerCase().includes(searchStr);
            const abstractMatch = pub.abstract?.toLowerCase().includes(searchStr);
            const keywordsMatch = pub.keywords?.join(' ').toLowerCase().includes(searchStr);

            if (!titleMatch && !authorsMatch && !abstractMatch && !keywordsMatch) {
                return false;
            }
        }

        return true;
    });

    renderPublications();
}

// Clear all filters
function clearAllFilters() {
    currentFilters = { year: '', type: '', search: '' };
    yearFilter.value = '';
    typeFilter.value = '';
    searchInput.value = '';
    filteredPublications = [...allPublications];
    renderPublications();
}

// Render publications grouped by year
function renderPublications() {
    if (filteredPublications.length === 0) {
        publicationsContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    publicationsContainer.style.display = 'block';
    emptyState.style.display = 'none';

    // Group by year
    const groupedByYear = groupByYear(filteredPublications);

    // Render each year section
    let html = '';
    Object.keys(groupedByYear).sort((a, b) => b - a).forEach(year => {
        html += renderYearSection(year, groupedByYear[year]);
    });

    publicationsContainer.innerHTML = html;

    // Attach event listeners for expandable abstracts and BibTeX
    attachPublicationEventListeners();
}

// Group publications by year
function groupByYear(publications) {
    return publications.reduce((groups, pub) => {
        const year = pub.year;
        if (!groups[year]) {
            groups[year] = [];
        }
        groups[year].push(pub);
        return groups;
    }, {});
}

// Render a year section
function renderYearSection(year, publications) {
    return `
        <div class="publication-year-section">
            <h2 class="year-heading">${year}</h2>
            <div class="publications-list">
                ${publications.map(pub => renderPublicationCard(pub)).join('')}
            </div>
        </div>
    `;
}

// Render a single publication card
function renderPublicationCard(pub) {
    const typeBadge = getTypeBadge(pub.type);
    const authorsHtml = formatAuthors(pub.authors);
    const hasAbstract = pub.abstract && pub.abstract.length > 0;

    return `
        <div class="publication-card" data-pub-id="${pub.id}">
            <div class="publication-content">
                <div class="publication-tags">
                    ${typeBadge}
                    ${pub.tags ? pub.tags.map(tag => `<span class="publication-tag">${tag}</span>`).join('') : ''}
                </div>

                <h3 class="publication-title">${escapeHtml(pub.title)}</h3>

                <p class="publication-authors">${authorsHtml}</p>

                <p class="publication-venue">
                    <span class="publication-venue-name">${escapeHtml(pub.venue)}</span>
                    <span class="publication-year-inline"> · ${pub.year}</span>
                </p>

                ${pub.keywords && pub.keywords.length > 0 ? `
                    <div class="publication-keywords">
                        ${pub.keywords.map(keyword => `<span class="keyword-pill">${escapeHtml(keyword)}</span>`).join('')}
                    </div>
                ` : ''}

                ${hasAbstract ? `
                    <div class="publication-abstract" id="abstract-${pub.id}">
                        <p>${escapeHtml(pub.abstract)}</p>
                    </div>
                    <button class="show-abstract-btn" data-target="abstract-${pub.id}">Show Abstract</button>
                ` : ''}
            </div>

            <div class="publication-actions">
                ${pub.pdf ? `
                    <a href="${pub.pdf}" target="_blank" class="action-btn primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        PDF
                    </a>
                ` : ''}

                ${pub.doi ? `
                    <a href="${pub.doi}" target="_blank" class="action-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        DOI
                    </a>
                ` : ''}

                <button class="action-btn bibtex-btn" data-bibtex='${JSON.stringify(pub.bibtex || generateBibtex(pub))}'>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                    BibTeX
                </button>
            </div>
        </div>
    `;
}

// Get type badge HTML
function getTypeBadge(type) {
    const typeClass = type.toLowerCase().replace(' ', '-');
    let badgeClass = 'type-badge';

    if (type.includes('Journal')) {
        badgeClass += ' journal';
    } else if (type.includes('Conference')) {
        badgeClass += ' conference';
    } else if (type.includes('Workshop')) {
        badgeClass += ' workshop';
    } else if (type.includes('Chapter')) {
        badgeClass += ' chapter';
    }

    return `<span class="${badgeClass}">${type}</span>`;
}

// Format authors (show "et al." for 4+ authors)
function formatAuthors(authors) {
    if (!authors || authors.length === 0) return '';

    if (authors.length <= 3) {
        return authors.map(author => `<strong>${escapeHtml(author)}</strong>`).join(', ');
    } else {
        const firstThree = authors.slice(0, 3).map(author => `<strong>${escapeHtml(author)}</strong>`).join(', ');
        return `${firstThree}, et al.`;
    }
}

// Generate BibTeX if not provided
function generateBibtex(pub) {
    const id = pub.id || pub.title.toLowerCase().replace(/\s+/g, '_').substring(0, 20);
    const authors = pub.authors.join(' and ');
    const year = pub.year;
    const title = pub.title;
    const venue = pub.venue;

    return `@article{${id},
  author = {${authors}},
  title = {${title}},
  journal = {${venue}},
  year = {${year}}
}`;
}

// Attach event listeners to publication cards
function attachPublicationEventListeners() {
    // Abstract toggle buttons
    document.querySelectorAll('.show-abstract-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const abstract = document.getElementById(targetId);

            if (abstract.classList.contains('expanded')) {
                abstract.classList.remove('expanded');
                this.textContent = 'Show Abstract';
            } else {
                abstract.classList.add('expanded');
                this.textContent = 'Hide Abstract';
            }
        });
    });

    // BibTeX copy buttons
    document.querySelectorAll('.bibtex-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const bibtex = JSON.parse(this.getAttribute('data-bibtex'));
            copyToClipboard(bibtex);
            showCopyToast();
        });
    });
}

// Copy to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Show copy success toast
function showCopyToast() {
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = 'BibTeX copied to clipboard!';
    document.body.appendChild(toast);

    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error state
function showError() {
    publicationsContainer.innerHTML = `
        <div class="publications-empty">
            <h3>Error loading publications</h3>
            <p>Please try refreshing the page</p>
        </div>
    `;
}
