# DM Lab Website

A modern, responsive website for the Data & Media Laboratory at the University of Peloponnese, featuring a clean Tailwind CSS design with full dark mode support.

## Features

- **Modern Tailwind Design**: Clean, professional aesthetic using Tailwind CSS via CDN
- **Dark Mode**: Full dark/light theme toggle with localStorage persistence
- **Responsive Layout**: Adapts seamlessly from desktop to mobile devices
- **Dynamic Content**: Publications and projects loaded from JSON data files
- **Global Theme**: Centralized configuration for consistent styling across all pages
- **Material Icons**: Google Material Symbols for consistent iconography

## Project Structure

```
dm_lab_site/
├── index.html              # Homepage with hero, news, research, projects
├── js/
│   ├── tailwind-config.js  # Shared Tailwind configuration
│   └── theme.js            # Dark mode toggle functionality
├── data/
│   ├── publications.json   # Publications data
│   ├── projects.json       # Projects data
│   └── news-events.json    # News and events data
├── pages/
│   ├── research.html       # Research areas with sidebar navigation
│   ├── projects.html       # Active/completed projects
│   ├── publications.html   # Filterable publications list
│   ├── team.html           # Team profiles
│   ├── news.html           # News and events
│   ├── about.html          # About the lab
│   ├── contact.html        # Contact form
│   └── infrastructure.html # Lab infrastructure
└── README.md
```

## Quick Start

### Option 1: Simple HTTP Server (Python)

```bash
cd dm_lab_site
python -m http.server 8080
```

Then open http://localhost:8080

### Option 2: Live Server (VS Code)

1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

### Option 3: Direct File

Simply open `index.html` in a modern web browser. Note: Some features (JSON loading) require a web server.

## Technology Stack

- **Tailwind CSS** (via CDN) - Utility-first CSS framework
- **Space Grotesk** - Google Font for typography
- **Material Symbols** - Google icon library
- **Vanilla JavaScript** - No framework dependencies

## Theme Configuration

The site uses a centralized theme configuration in `js/tailwind-config.js`:

```javascript
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#135bec",
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
                "card-light": "#ffffff",
                "card-dark": "#1a212e"
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"]
            }
        }
    }
};
```

To customize colors, edit this file and the changes will apply across all pages.

## Dark Mode

Dark mode is handled by `js/theme.js`:
- Theme preference saved to localStorage
- Toggle button in header on all pages
- Uses Tailwind's `dark:` variant classes

## Pages

| Page | Description |
|------|-------------|
| **Home** | Hero section, recent news, research highlights, stats, active projects |
| **Research** | 6 research areas with sidebar navigation and circuit background |
| **Projects** | Active and completed EU-funded projects loaded from JSON |
| **Publications** | Filterable list by year, type, and search keywords |
| **Team** | Lab Director, Faculty members, PhD students/Research Associates |
| **News** | Upcoming events, recent talks, latest news |
| **About** | Mission, research excellence, impact, facilities |
| **Contact** | Contact info cards, message form, collaboration opportunities |
| **Infrastructure** | HPC resources, software tools, lab facilities |

## Data Files

### publications.json

```json
{
  "publications": [
    {
      "title": "Paper Title",
      "authors": ["Author 1", "Author 2"],
      "venue": "Journal/Conference Name",
      "year": 2024,
      "type": "Journal Article",
      "tags": ["ML", "NLP"]
    }
  ]
}
```

### projects.json

```json
{
  "projects": [
    {
      "id": "project-id",
      "title": "Project Name",
      "fullTitle": "Full Project Title",
      "description": "Project description...",
      "status": "active",
      "role": "Lead Partner",
      "program": "Horizon Europe",
      "funding": "€2M",
      "duration": { "start": "2024-01", "end": "2027-12" },
      "objectives": ["Objective 1", "Objective 2"],
      "keyInnovations": ["Innovation 1", "Innovation 2"],
      "website": "https://project-url.eu"
    }
  ]
}
```

## Deployment

### GitHub Pages

1. Push to GitHub repository
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Site will be available at `https://username.github.io/repo-name`

### Netlify/Vercel

1. Connect your GitHub repository
2. Deploy automatically on push
3. Custom domain optional

### Traditional Hosting

Upload all files to your web server via FTP/SFTP.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

### Adding a New Page

1. Copy an existing page as template
2. Update the `<title>` and meta description
3. Keep the same header/footer structure
4. Include the shared scripts:
   ```html
   <script src="../js/tailwind-config.js"></script>
   <!-- ... page content ... -->
   <script src="../js/theme.js"></script>
   ```

### Updating Navigation

The navigation is duplicated in each page. To update, edit the `<nav>` section in all HTML files.

### Adding Content

- **Publications**: Edit `data/publications.json`
- **Projects**: Edit `data/projects.json`
- **News/Events**: Edit `data/news-events.json`

## License

This website is built for the Data & Media Laboratory, University of Peloponnese.

---

**Version**: 2.0
**Updated**: 2024
**Design**: Tailwind CSS with Stitch Lab-inspired aesthetic
**Built for**: Data & Media Laboratory, University of Peloponnese
