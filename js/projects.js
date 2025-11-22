// Projects Page - Dynamic project loading and rendering

let allProjects = [];

// Load projects from JSON
async function loadProjects() {
    try {
        const response = await fetch('../data/projects.json');
        const data = await response.json();
        allProjects = data.projects;

        // Use the order from JSON (manually curated)
        // Projects are already ordered: EU-ALMPO, TRAIN4BLUE, Growth4Blue, MicroIdea, etc.

        renderProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Render all projects
function renderProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    container.innerHTML = allProjects.map(project => renderProjectCard(project)).join('');
}

// Render a single project card
function renderProjectCard(project) {
    const startYear = new Date(project.duration.start).getFullYear();
    const endYear = new Date(project.duration.end).getFullYear();
    const duration = `${startYear}-${endYear}`;

    // Logo section - only show if logo exists and is not empty
    const logoHtml = project.logo ? `
        <div class="project-logo">
            <img src="${project.logo}" alt="${project.title} logo" onerror="this.parentElement.style.display='none'">
        </div>
    ` : '';

    // Website button - only show if website exists and is not empty
    const websiteBtn = project.website ? `
        <a href="${project.website}" target="_blank" rel="noopener noreferrer" class="project-website-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            Visit Project Website
        </a>
    ` : '';

    // Status badge
    const statusClass = project.status === 'active' ? 'status-active' : 'status-completed';
    const statusText = project.status === 'active' ? 'Active' : 'Completed';

    return `
        <div class="project-detail" data-project-id="${project.id}">
            ${logoHtml}
            <div class="project-detail-header">
                <h3>${escapeHtml(project.title)}</h3>
                <p class="project-full-title">${escapeHtml(project.fullTitle)}</p>
                <div class="project-meta">
                    <div class="project-meta-item">
                        <span class="project-meta-label">Program</span>
                        <span class="project-meta-value">${escapeHtml(project.program)}</span>
                    </div>
                    <div class="project-meta-item">
                        <span class="project-meta-label">Duration</span>
                        <span class="project-meta-value">${duration}</span>
                    </div>
                    <div class="project-meta-item">
                        <span class="project-meta-label">Status</span>
                        <span class="project-meta-value ${statusClass}">${statusText}</span>
                    </div>
                    ${project.funding ? `
                    <div class="project-meta-item">
                        <span class="project-meta-label">Funding</span>
                        <span class="project-meta-value">${escapeHtml(project.funding)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            <div class="project-detail-content">
                <p>${escapeHtml(project.description)}</p>
                ${project.objectives && project.objectives.length > 0 ? `
                    <p><strong>Objectives:</strong></p>
                    <ul>
                        ${project.objectives.map(obj => `<li>${escapeHtml(obj)}</li>`).join('')}
                    </ul>
                ` : ''}
                ${project.keyInnovations && project.keyInnovations.length > 0 ? `
                    <p><strong>Key Innovations:</strong> ${project.keyInnovations.map(escapeHtml).join(', ')}.</p>
                ` : ''}
                ${websiteBtn}
            </div>
        </div>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadProjects);
