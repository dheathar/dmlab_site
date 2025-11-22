/**
 * News Card Component
 * Renders news items, events, and talks
 */

import { escapeHtml, formatDate, truncate } from '../utils/renderer.js';

/**
 * Generate news card HTML
 * @param {Object} newsItem - News item data
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function NewsCard(newsItem, options = {}) {
  const { compact = false, showImage = true } = options;

  const summary = compact
    ? truncate(newsItem.summary || newsItem.content, 100)
    : newsItem.summary;

  const typeBadge = getTypeBadge(newsItem.type || newsItem.category);

  return `
    <div class="news-card ${newsItem.featured ? 'news-featured' : ''}" data-id="${newsItem.id}" data-type="${newsItem.type}">
      ${showImage && newsItem.image ? `
        <div class="news-image">
          <img src="${newsItem.image}" alt="${escapeHtml(newsItem.title)}" loading="lazy" />
          ${newsItem.featured ? '<span class="featured-badge">Featured</span>' : ''}
        </div>
      ` : ''}

      <div class="news-content">
        <div class="news-header">
          ${typeBadge}
          <span class="news-date">${formatDate(newsItem.date)}</span>
        </div>

        <h3 class="news-title">${escapeHtml(newsItem.title)}</h3>

        ${summary ? `<p class="news-summary">${escapeHtml(summary)}</p>` : ''}

        ${newsItem.author ? `
          <p class="news-author">By ${escapeHtml(newsItem.author)}</p>
        ` : ''}

        ${newsItem.tags && newsItem.tags.length > 0 ? `
          <div class="news-tags">
            ${newsItem.tags.map(tag => `<span class="tag tag-sm">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Generate event card HTML
 * @param {Object} event - Event data
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function EventCard(event, options = {}) {
  const isUpcoming = new Date(event.date) > new Date();

  return `
    <div class="event-card ${isUpcoming ? 'event-upcoming' : 'event-past'}" data-id="${event.id}">
      <div class="event-date-badge">
        <span class="event-month">${formatDate(event.date, { month: 'short' })}</span>
        <span class="event-day">${formatDate(event.date, { day: 'numeric' })}</span>
      </div>

      <div class="event-content">
        <div class="event-meta">
          <span class="event-type">${escapeHtml(event.type)}</span>
          ${event.time ? `<span class="event-time">${event.time}</span>` : ''}
        </div>

        <h3 class="event-title">${escapeHtml(event.title)}</h3>

        ${event.speaker ? `
          <div class="event-speaker">
            <strong>${escapeHtml(event.speaker.name)}</strong>
            ${event.speaker.affiliation ? `<span> - ${escapeHtml(event.speaker.affiliation)}</span>` : ''}
          </div>
        ` : ''}

        ${event.location ? `
          <p class="event-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${escapeHtml(event.location)}
          </p>
        ` : ''}

        ${event.description ? `
          <p class="event-description">${escapeHtml(truncate(event.description, 150))}</p>
        ` : ''}

        ${event.registrationRequired && event.registrationUrl ? `
          <a href="${event.registrationUrl}" class="btn-primary btn-sm" target="_blank" rel="noopener">
            Register
          </a>
        ` : ''}

        ${event.website ? `
          <a href="${event.website}" class="event-link" target="_blank" rel="noopener">
            Event Website →
          </a>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Generate talk item HTML (past talks)
 * @param {Object} talk - Talk data
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function TalkItem(talk, options = {}) {
  return `
    <div class="talk-item" data-id="${talk.id}">
      <div class="talk-meta">
        <span class="talk-date">${formatDate(talk.date)}</span>
        <span class="talk-type ${talk.type?.toLowerCase()}">${escapeHtml(talk.type)}</span>
      </div>

      <h4 class="talk-title">${escapeHtml(talk.title)}</h4>

      <div class="talk-details">
        <p class="talk-speaker">
          <strong>${escapeHtml(talk.speaker)}</strong>
        </p>
        <p class="talk-event">${escapeHtml(talk.event)}</p>
        ${talk.location ? `<p class="talk-location">${escapeHtml(talk.location)}</p>` : ''}
      </div>

      <div class="talk-links">
        ${talk.slidesUrl ? `
          <a href="${talk.slidesUrl}" target="_blank" rel="noopener" class="talk-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            Slides
          </a>
        ` : ''}
        ${talk.videoUrl ? `
          <a href="${talk.videoUrl}" target="_blank" rel="noopener" class="talk-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Video
          </a>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Get type badge HTML
 * @private
 */
function getTypeBadge(type) {
  const typeMap = {
    announcement: { label: 'Announcement', class: 'badge-info', icon: '📢' },
    award: { label: 'Award', class: 'badge-success', icon: '🏆' },
    event: { label: 'Event', class: 'badge-primary', icon: '📅' },
    publication: { label: 'Publication', class: 'badge-secondary', icon: '📄' },
  };

  const typeData = typeMap[type?.toLowerCase()] || {
    label: type,
    class: 'badge-default',
    icon: '📌',
  };

  return `<span class="badge ${typeData.class}">${typeData.icon} ${typeData.label}</span>`;
}

/**
 * Render news timeline (grouped by month/year)
 * @param {Array} newsItems - Array of news items
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function NewsTimeline(newsItems, options = {}) {
  // Sort by date descending
  const sorted = [...newsItems].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Group by month/year
  const grouped = {};
  sorted.forEach(item => {
    const date = new Date(item.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = formatDate(item.date, { year: 'numeric', month: 'long' });

    if (!grouped[key]) {
      grouped[key] = { label, items: [] };
    }
    grouped[key].items.push(item);
  });

  let html = '<div class="news-timeline">';

  Object.values(grouped).forEach(group => {
    html += `
      <div class="timeline-group">
        <h3 class="timeline-label">${group.label}</h3>
        <div class="timeline-items">
          ${group.items.map(item => NewsCard(item, options)).join('')}
        </div>
      </div>
    `;
  });

  html += '</div>';

  return html;
}

/**
 * Render multiple news cards
 * @param {Array} newsItems - Array of news items
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function NewsCardList(newsItems, options = {}) {
  return newsItems.map(item => NewsCard(item, options)).join('');
}

/**
 * Render multiple event cards
 * @param {Array} events - Array of event objects
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function EventCardList(events, options = {}) {
  return events.map(event => EventCard(event, options)).join('');
}

/**
 * Render multiple talk items
 * @param {Array} talks - Array of talk objects
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function TalkList(talks, options = {}) {
  return talks.map(talk => TalkItem(talk, options)).join('');
}

export default NewsCard;
