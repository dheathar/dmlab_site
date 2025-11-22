/**
 * SEO Utilities
 * Provides functions for dynamically updating SEO meta tags and structured data
 */

class SEO {
    /**
     * Update page meta tags
     * @param {Object} options - SEO options
     * @param {string} options.title - Page title
     * @param {string} options.description - Page description
     * @param {string} options.keywords - Page keywords
     * @param {string} options.url - Canonical URL
     * @param {string} options.image - OG image URL
     */
    static updateMetaTags(options) {
        const {
            title,
            description,
            keywords,
            url,
            image
        } = options;

        // Update title
        if (title) {
            document.title = title;
            this.updateMetaTag('og:title', title, 'property');
            this.updateMetaTag('twitter:title', title);
        }

        // Update description
        if (description) {
            this.updateMetaTag('description', description);
            this.updateMetaTag('og:description', description, 'property');
            this.updateMetaTag('twitter:description', description);
        }

        // Update keywords
        if (keywords) {
            this.updateMetaTag('keywords', keywords);
        }

        // Update canonical URL
        if (url) {
            this.updateLink('canonical', url);
            this.updateMetaTag('og:url', url, 'property');
        }

        // Update OG image
        if (image) {
            this.updateMetaTag('og:image', image, 'property');
            this.updateMetaTag('twitter:image', image);
        }
    }

    /**
     * Update or create a meta tag
     * @param {string} name - Meta tag name
     * @param {string} content - Meta tag content
     * @param {string} attribute - Attribute to use ('name' or 'property')
     */
    static updateMetaTag(name, content, attribute = 'name') {
        let element = document.querySelector(`meta[${attribute}="${name}"]`);

        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attribute, name);
            document.head.appendChild(element);
        }

        element.setAttribute('content', content);
    }

    /**
     * Update or create a link tag
     * @param {string} rel - Link rel attribute
     * @param {string} href - Link href attribute
     */
    static updateLink(rel, href) {
        let element = document.querySelector(`link[rel="${rel}"]`);

        if (!element) {
            element = document.createElement('link');
            element.setAttribute('rel', rel);
            document.head.appendChild(element);
        }

        element.setAttribute('href', href);
    }

    /**
     * Add JSON-LD structured data to the page
     * @param {Object} data - Structured data object
     */
    static addStructuredData(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data, null, 2);
        document.head.appendChild(script);
    }

    /**
     * Generate BreadcrumbList structured data
     * @param {Array} breadcrumbs - Array of {name, url} objects
     * @returns {Object} BreadcrumbList schema
     */
    static generateBreadcrumbs(breadcrumbs) {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": crumb.url
            }))
        };
    }

    /**
     * Generate ScholarlyArticle structured data for publications
     * @param {Object} publication - Publication data
     * @returns {Object} ScholarlyArticle schema
     */
    static generatePublicationSchema(publication) {
        return {
            "@context": "https://schema.org",
            "@type": "ScholarlyArticle",
            "headline": publication.title,
            "author": publication.authors.map(author => ({
                "@type": "Person",
                "name": author
            })),
            "datePublished": publication.year,
            "publisher": {
                "@type": "Organization",
                "name": publication.venue
            },
            "about": publication.tags || publication.keywords,
            "abstract": publication.abstract,
            "url": publication.doi || publication.pdf
        };
    }

    /**
     * Generate ResearchProject structured data
     * @param {Object} project - Project data
     * @returns {Object} ResearchProject schema
     */
    static generateProjectSchema(project) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "ResearchProject",
            "name": project.title,
            "description": project.description,
            "url": project.website,
            "keywords": project.tags
        };

        if (project.startDate || project.endDate) {
            schema.startDate = project.startDate;
            schema.endDate = project.endDate;
        }

        if (project.fundingProgram) {
            schema.funding = {
                "@type": "Grant",
                "funder": {
                    "@type": "Organization",
                    "name": project.fundingProgram
                }
            };
        }

        return schema;
    }

    /**
     * Generate Person structured data for team members
     * @param {Object} person - Person data
     * @returns {Object} Person schema
     */
    static generatePersonSchema(person) {
        return {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": person.name,
            "jobTitle": person.title,
            "affiliation": {
                "@type": "Organization",
                "name": "Data & Media Laboratory, University of Peloponnese"
            },
            "email": person.email,
            "knowsAbout": person.researchInterests,
            "url": person.links?.personalWebsite,
            "sameAs": [
                person.links?.googleScholar,
                person.links?.orcid,
                person.links?.linkedin,
                person.links?.github
            ].filter(Boolean)
        };
    }

    /**
     * Generate Event structured data
     * @param {Object} event - Event data
     * @returns {Object} Event schema
     */
    static generateEventSchema(event) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": event.title,
            "description": event.description,
            "startDate": event.date,
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
        };

        if (event.endDate) {
            schema.endDate = event.endDate;
        }

        if (event.location) {
            schema.location = {
                "@type": "Place",
                "name": event.location
            };
        }

        if (event.speaker) {
            schema.performer = {
                "@type": "Person",
                "name": event.speaker.name
            };
        }

        if (event.registrationUrl) {
            schema.offers = {
                "@type": "Offer",
                "url": event.registrationUrl,
                "availability": "https://schema.org/InStock"
            };
        }

        return schema;
    }

    /**
     * Generate NewsArticle structured data
     * @param {Object} news - News data
     * @returns {Object} NewsArticle schema
     */
    static generateNewsSchema(news) {
        return {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": news.title,
            "description": news.summary || news.content,
            "datePublished": news.date,
            "author": {
                "@type": "Person",
                "name": news.author || "DM Lab"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Data & Media Laboratory",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://dmlab.uop.gr/assets/images/logo.png"
                }
            },
            "image": news.image,
            "keywords": news.tags
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEO;
}
