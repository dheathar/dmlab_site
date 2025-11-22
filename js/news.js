/**
 * News & Events Page
 * Handles loading and displaying news, events, and talks
 */

let newsData = [];
let eventsData = [];
let talksData = [];

// Load news data from JSON
async function loadNewsData() {
    try {
        const response = await fetch('../data/news.json');
        const data = await response.json();

        newsData = data.news || [];
        eventsData = data.events || [];
        talksData = data.pastTalks || [];

        renderNewsItems();
        renderUpcomingEventsWidget();
        renderRecentTalksWidget();
        renderFullEventsList();
        renderFullTalksList();
    } catch (error) {
        console.error('Error loading news data:', error);
    }
}

// Render news items
function renderNewsItems() {
    const container = document.getElementById('newsContainer');
    if (!container) return;

    if (newsData.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-tertiary);">No news items available.</p>';
        return;
    }

    // Sort by date (newest first)
    const sortedNews = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = sortedNews.map(news => `
        <article class="news-item ${news.featured ? 'featured' : ''}">
            ${news.image ? `
                <div class="news-item-image">
                    <img src="${escapeHtml(news.image)}" alt="${escapeHtml(news.title)}" onerror="this.parentElement.style.display='none'">
                </div>
            ` : ''}
            <div class="news-item-content">
                <div class="news-item-header">
                    <span class="news-category">${escapeHtml(news.category)}</span>
                    <span class="news-date">${formatDate(news.date)}</span>
                </div>
                <h2 class="news-item-title">${escapeHtml(news.title)}</h2>
                <p class="news-item-summary">${escapeHtml(news.summary || news.content)}</p>
                <div class="news-item-footer">
                    <div class="news-author">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>${escapeHtml(news.author || 'DM Lab')}</span>
                    </div>
                    ${news.tags && news.tags.length > 0 ? `
                        <div class="news-tags">
                            ${news.tags.map(tag => `<span class="news-tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        </article>
    `).join('');
}

// Render upcoming events widget (sidebar)
function renderUpcomingEventsWidget() {
    const container = document.getElementById('upcomingEventsWidget');
    if (!container) return;

    if (eventsData.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-tertiary); font-size: var(--font-size-sm);">No upcoming events.</p>';
        return;
    }

    // Filter future events and sort by date
    const now = new Date();
    const upcomingEvents = eventsData
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3); // Show only 3 upcoming events

    if (upcomingEvents.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-tertiary); font-size: var(--font-size-sm);">No upcoming events.</p>';
        return;
    }

    container.innerHTML = upcomingEvents.map(event => `
        <div class="event-item">
            <div class="event-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ${formatDate(event.date)}
            </div>
            <h4 class="event-title">${escapeHtml(event.title)}</h4>
            <p class="event-location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle;">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${escapeHtml(event.location)}
            </p>
            ${event.type ? `<span class="event-type">${escapeHtml(event.type)}</span>` : ''}
        </div>
    `).join('');
}

// Render recent talks widget (sidebar)
function renderRecentTalksWidget() {
    const container = document.getElementById('recentTalksWidget');
    if (!container) return;

    if (talksData.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-tertiary); font-size: var(--font-size-sm);">No recent talks.</p>';
        return;
    }

    // Sort by date (newest first) and show only 3
    const recentTalks = [...talksData]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    container.innerHTML = recentTalks.map(talk => `
        <div class="talk-item">
            <div class="talk-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ${formatDate(talk.date)}
            </div>
            <h4 class="talk-title">${escapeHtml(talk.title)}</h4>
            <p class="talk-speaker">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle;">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                ${escapeHtml(talk.speaker)}
            </p>
            ${talk.type ? `<span class="talk-type">${escapeHtml(talk.type)}</span>` : ''}
        </div>
    `).join('');
}

// Render full events list
function renderFullEventsList() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;

    if (eventsData.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-tertiary);">No events available.</p>';
        return;
    }

    // Sort by date
    const sortedEvents = [...eventsData].sort((a, b) => new Date(a.date) - new Date(b.date));

    container.innerHTML = `
        <div style="display: grid; gap: var(--spacing-xl);">
            ${sortedEvents.map(event => `
                <div class="news-item">
                    <div class="news-item-content">
                        <div class="news-item-header">
                            <span class="news-category">${escapeHtml(event.type || 'Event')}</span>
                            <span class="news-date">${formatDate(event.date)}${event.endDate ? ' - ' + formatDate(event.endDate) : ''}</span>
                        </div>
                        <h2 class="news-item-title">${escapeHtml(event.title)}</h2>
                        ${event.speaker ? `
                            <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-md);">
                                <strong>Speaker:</strong> ${escapeHtml(event.speaker.name)}${event.speaker.affiliation ? `, ${escapeHtml(event.speaker.affiliation)}` : ''}
                            </p>
                        ` : ''}
                        <p class="news-item-summary">${escapeHtml(event.description)}</p>
                        ${event.location || event.time ? `
                            <div style="margin-top: var(--spacing-md); color: var(--color-text-tertiary); font-size: var(--font-size-sm);">
                                ${event.time ? `<p><strong>Time:</strong> ${escapeHtml(event.time)}</p>` : ''}
                                ${event.location ? `<p><strong>Location:</strong> ${escapeHtml(event.location)}</p>` : ''}
                            </div>
                        ` : ''}
                        ${event.registrationRequired ? `
                            <div style="margin-top: var(--spacing-md);">
                                <span style="display: inline-block; padding: var(--spacing-xs) var(--spacing-md); background: var(--color-accent); color: white; border-radius: var(--border-radius-sm); font-size: var(--font-size-sm); font-weight: 600;">Registration Required</span>
                                ${event.registrationUrl ? `<a href="${escapeHtml(event.registrationUrl)}" target="_blank" style="margin-left: var(--spacing-md);" class="btn-primary">Register Now</a>` : ''}
                            </div>
                        ` : ''}
                        ${event.website ? `
                            <div style="margin-top: var(--spacing-md);">
                                <a href="${escapeHtml(event.website)}" target="_blank" class="btn-secondary">Event Website →</a>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Render full talks list
function renderFullTalksList() {
    const container = document.getElementById('talksContainer');
    if (!container) return;

    if (talksData.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-tertiary);">No talks available.</p>';
        return;
    }

    // Sort by date (newest first)
    const sortedTalks = [...talksData].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = `
        <div style="display: grid; gap: var(--spacing-xl);">
            ${sortedTalks.map(talk => `
                <div class="news-item">
                    <div class="news-item-content">
                        <div class="news-item-header">
                            <span class="news-category">${escapeHtml(talk.type || 'Talk')}</span>
                            <span class="news-date">${formatDate(talk.date)}</span>
                        </div>
                        <h2 class="news-item-title">${escapeHtml(talk.title)}</h2>
                        <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-md);">
                            <strong>Speaker:</strong> ${escapeHtml(talk.speaker)}
                        </p>
                        <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-md);">
                            <strong>Event:</strong> ${escapeHtml(talk.event)}
                        </p>
                        <p style="color: var(--color-text-tertiary); font-size: var(--font-size-sm); margin-bottom: var(--spacing-md);">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle;">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            ${escapeHtml(talk.location)}
                        </p>
                        ${talk.slidesUrl || talk.videoUrl ? `
                            <div style="margin-top: var(--spacing-md); display: flex; gap: var(--spacing-md);">
                                ${talk.slidesUrl ? `<a href="${escapeHtml(talk.slidesUrl)}" target="_blank" class="btn-secondary">View Slides</a>` : ''}
                                ${talk.videoUrl ? `<a href="${escapeHtml(talk.videoUrl)}" target="_blank" class="btn-secondary">Watch Video</a>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Tab switching functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadNewsData();
    initializeTabs();
});
