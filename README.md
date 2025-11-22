# DM Lab Website

A modern, responsive website for the Data & Media Laboratory at the University of Peloponnese, inspired by datalab.to's design aesthetic.

## 🎨 Features

- **Horizontal Scroll Homepage**: Unique horizontal scrolling experience with smooth animations (inspired by datalab.to)
- **Modern Design**: Dark theme with vibrant accent colors and smooth transitions
- **Fully Responsive**: Adapts seamlessly from desktop to mobile devices
- **6 Research Areas**: Comprehensive coverage of lab's research domains
- **Project Showcase**: Detailed pages for EU-funded and research projects
- **Team Profiles**: Showcase researchers and collaborators
- **Publications**: Academic output and research contributions
- **Contact Form**: Easy communication with the lab

## 📁 Project Structure

```
dm_lab_site/
├── index.html              # Homepage with horizontal scroll
├── css/
│   ├── main.css            # Core styles, variables, components
│   ├── horizontal-scroll.css  # Horizontal scroll mechanics
│   ├── responsive.css      # Mobile/tablet responsive styles
│   └── pages.css           # Styles for additional pages
├── js/
│   ├── scroll-manager.js   # Horizontal scrolling logic
│   └── animations.js       # Interactive animations
├── pages/
│   ├── research.html       # Research areas detail page
│   ├── projects.html       # Projects showcase
│   ├── team.html           # Team members
│   ├── publications.html   # Research publications
│   ├── about.html          # About the lab
│   └── contact.html        # Contact form
├── assets/
│   ├── images/            # Images (placeholders currently)
│   └── icons/             # Icons and graphics
└── README.md              # This file
```

## 🚀 Getting Started

### Quick Start

1. **Open the site**: Simply open `index.html` in a modern web browser
2. **Navigate**: Scroll horizontally (desktop) or vertically (mobile) through the homepage
3. **Explore**: Click navigation links to visit additional pages

### No Build Process Required

This is a static HTML/CSS/JavaScript site with no dependencies. No npm install, no build step - just open and run!

## 🎯 Customization Guide

### 1. Update Content

#### Replace Placeholder Images

Currently using placeholder images from `via.placeholder.com`. Replace with actual images:

- Team photos: Save to `assets/images/team/`
- Project images: Save to `assets/images/projects/`
- Logos: Save to `assets/images/logos/`

Update image src attributes in HTML files:
```html
<!-- Before -->
<img src="https://via.placeholder.com/200x200/1a1a1a/ffffff?text=PI" alt="Principal Investigator">

<!-- After -->
<img src="../assets/images/team/director.jpg" alt="Dr. Name">
```

#### Update Text Content

- **Team names**: Replace `[Name]` placeholders in `pages/team.html`
- **Publications**: Add real publications in `pages/publications.html`
- **Projects**: Customize project details in `pages/projects.html`
- **Contact info**: Update email/phone in `pages/contact.html`

### 2. Customize Colors

Edit CSS variables in `css/main.css`:

```css
:root {
    --color-primary: #2563eb;      /* Main brand color */
    --color-secondary: #059669;    /* Secondary accent */
    --color-accent: #dc2626;       /* Accent color */

    /* Change to your university colors */
    --color-primary: #your-color;
}
```

### 3. Modify Typography

Change fonts in `css/main.css`:

```css
:root {
    --font-primary: 'YourFont', sans-serif;
    --font-secondary: 'YourFont', sans-serif;
}
```

Update Google Fonts link in all HTML files:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@...">
```

### 4. Adjust Layouts

#### Grid Layouts

Modify grid columns in `css/main.css`:

```css
/* Change from 2 columns to 3 */
.features-grid {
    grid-template-columns: repeat(3, 1fr);
}
```

#### Panel Order

Reorder sections in `index.html` by moving `<section class="panel">` blocks.

### 5. Configure Horizontal Scroll

Disable horizontal scroll (use vertical only):

In `css/horizontal-scroll.css`, comment out the scroll container styles:
```css
/* .scroll-container {
    overflow-x: scroll;
    ...
} */
```

Adjust scroll speed in `js/scroll-manager.js`:
```javascript
this.ease = 0.075;  // Lower = smoother, higher = faster
```

## 📱 Mobile Responsiveness

The site automatically switches from horizontal to vertical scrolling on mobile devices (< 768px width). Customize breakpoints in `css/responsive.css`:

```css
@media screen and (max-width: 1024px) {
    /* Tablet styles */
}

@media screen and (max-width: 768px) {
    /* Mobile styles */
}
```

## 🌐 Deployment

### Option 1: GitHub Pages

1. Create a GitHub repository
2. Push the `dm_lab_site` folder contents
3. Enable GitHub Pages in repository settings
4. Your site will be at `https://yourusername.github.io/repo-name`

### Option 2: Netlify/Vercel

1. Drag and drop the `dm_lab_site` folder into Netlify/Vercel
2. Site deploys automatically
3. Get a custom domain or use provided URL

### Option 3: Traditional Web Hosting

1. Upload all files via FTP to your web server
2. Ensure `index.html` is in the root directory
3. Access via your domain

## 🔧 Technical Details

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performance

- No external dependencies (except Google Fonts)
- Optimized CSS with CSS variables
- Efficient JavaScript with RAF animations
- Lazy loading for images (optional)

### Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support (arrow keys for panels)
- Reduced motion support for accessibility
- Proper heading hierarchy

## 📝 Content Integration from dmlab.edu.gr

To pull real content from the existing dmlab.edu.gr site:

1. **Team**: Copy team member names, titles, bios from existing site
2. **Projects**: Import project descriptions, funding info, dates
3. **Publications**: Export publication list and format as shown in publications.html
4. **Research Areas**: Adapt existing research descriptions to the new format
5. **Contact Info**: Update with actual phone numbers, emails, addresses

## 🎨 Design Philosophy

This site follows datalab.to's modern SaaS aesthetic:

- **Dark theme** with high contrast for readability
- **Bold typography** with clear hierarchy
- **Smooth animations** for engaging user experience
- **Horizontal scrolling** for unique storytelling
- **Minimalist design** focusing on content
- **Vibrant accents** to highlight important elements

## 🤝 Contributing

To modify or enhance this site:

1. Edit HTML files for content changes
2. Modify CSS files for styling adjustments
3. Update JavaScript files for functionality changes
4. Test across multiple browsers and devices
5. Optimize images before adding to assets folder

## 📄 License

This template is created for the Data & Media Laboratory, University of Peloponnese.

## 💡 Tips

- **Keep it simple**: Don't overcomplicate the design
- **Optimize images**: Compress images to improve load times
- **Test mobile**: Always check mobile responsiveness
- **Update regularly**: Keep publications and projects current
- **Backup often**: Version control with Git recommended

## 🐛 Troubleshooting

### Horizontal scroll not working

- Check that JavaScript files are loaded properly
- Ensure `scroll-manager.js` is included before closing `</body>` tag
- Verify browser console for errors

### Images not loading

- Check file paths are correct (relative paths)
- Ensure image files exist in `assets/images/`
- Verify image file names match HTML references

### Mobile menu not showing

- Navigation menu automatically hides on mobile (<768px)
- Implement hamburger menu if needed (currently hidden)

### Animations not smooth

- Reduce animation complexity in `animations.js`
- Lower `ease` value in scroll manager
- Check browser performance

## 📧 Support

For questions or issues with this template:

- Review this README thoroughly
- Check browser console for errors
- Verify all file paths are correct
- Test in different browsers

---

**Version**: 1.0
**Created**: 2024
**Inspired by**: datalab.to design aesthetic
**Built for**: Data & Media Laboratory, University of Peloponnese
