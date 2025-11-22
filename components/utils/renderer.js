/**
 * Renderer Utility
 * Helper functions for rendering components and managing DOM
 */

/**
 * Render HTML string into a container
 * @param {string} html - HTML string to render
 * @param {HTMLElement} container - Container element
 * @param {boolean} append - Whether to append or replace content
 */
export function render(html, container, append = false) {
  if (!container) {
    console.error('Render: Container element not found');
    return;
  }

  if (append) {
    container.insertAdjacentHTML('beforeend', html);
  } else {
    container.innerHTML = html;
  }
}

/**
 * Create element from HTML string
 * @param {string} html - HTML string
 * @returns {HTMLElement} Created element
 */
export function createElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

/**
 * Render array of items with a template function
 * @param {Array} items - Array of data items
 * @param {Function} templateFn - Function that returns HTML for each item
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Rendering options
 */
export function renderList(items, templateFn, container, options = {}) {
  const {
    append = false,
    emptyMessage = 'No items found',
    wrapper = null,
    className = '',
  } = options;

  if (!items || items.length === 0) {
    render(`<p class="empty-state">${emptyMessage}</p>`, container, append);
    return;
  }

  const html = items.map(templateFn).join('');
  const wrappedHtml = wrapper
    ? `<${wrapper} class="${className}">${html}</${wrapper}>`
    : html;

  render(wrappedHtml, container, append);
}

/**
 * Show loading state in container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Loading message
 */
export function showLoading(container, message = 'Loading...') {
  if (!container) return;

  container.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>${message}</p>
    </div>
  `;
}

/**
 * Show error state in container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message
 */
export function showError(container, message = 'An error occurred') {
  if (!container) return;

  container.innerHTML = `
    <div class="error-state">
      <p class="error-message">${message}</p>
      <button class="btn-outline" onclick="location.reload()">Retry</button>
    </div>
  `;
}

/**
 * Safely escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      ...defaultOptions,
      ...options,
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toString();
  }
}

/**
 * Debounce function calls
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Animate element entrance
 * @param {HTMLElement} element - Element to animate
 * @param {string} animationClass - Animation class name
 * @param {number} delay - Delay before animation
 */
export function animateIn(element, animationClass = 'fade-in', delay = 0) {
  if (!element) return;

  setTimeout(() => {
    element.classList.add(animationClass);
  }, delay);
}

/**
 * Batch animate list items with stagger
 * @param {NodeList|Array} elements - Elements to animate
 * @param {number} staggerDelay - Delay between each item
 */
export function staggerAnimate(elements, staggerDelay = 100) {
  elements.forEach((element, index) => {
    animateIn(element, 'fade-in-up', index * staggerDelay);
  });
}

/**
 * Filter array by search query
 * @param {Array} items - Items to filter
 * @param {string} query - Search query
 * @param {string[]} fields - Fields to search in
 * @returns {Array} Filtered items
 */
export function filterByQuery(items, query, fields) {
  if (!query || !query.trim()) return items;

  const lowerQuery = query.toLowerCase();

  return items.filter(item => {
    return fields.some(field => {
      const value = getNestedValue(item, field);
      if (!value) return false;

      if (Array.isArray(value)) {
        return value.some(v =>
          v.toString().toLowerCase().includes(lowerQuery)
        );
      }

      return value.toString().toLowerCase().includes(lowerQuery);
    });
  });
}

/**
 * Get nested object value by path
 * @param {Object} obj - Object to search
 * @param {string} path - Dot-separated path (e.g., 'user.name')
 * @returns {*} Value at path
 */
export function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Group array by field
 * @param {Array} items - Items to group
 * @param {string} field - Field to group by
 * @returns {Object} Grouped items
 */
export function groupBy(items, field) {
  return items.reduce((groups, item) => {
    const key = getNestedValue(item, field);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

/**
 * Sort array by field
 * @param {Array} items - Items to sort
 * @param {string} field - Field to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted items
 */
export function sortBy(items, field, order = 'asc') {
  const sorted = [...items].sort((a, b) => {
    const aVal = getNestedValue(a, field);
    const bVal = getNestedValue(b, field);

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}
