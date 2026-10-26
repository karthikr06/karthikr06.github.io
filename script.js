// Greeting Logic
const greeting = document.getElementById('greeting');
const currentHour = new Date().getHours();

if (currentHour < 12) {
    greeting.innerText = "Good Morning, I'm Karthik";
} else if (currentHour < 17) {
    greeting.innerText = "Good Afternoon, I'm Karthik";
} else {
    greeting.innerText = "Good Evening, I'm Karthik";
}

// --- PROJECTS LOGIC ---
function generateAppCard(app) {
    const highlightsHTML = (app.highlights || [])
        .map(item => `<li>${item}</li>`)
        .join('');

    return `
        <a href="${app.url}" target="_blank" class="app-card" style="--app-accent: ${app.accent};">
            <div class="app-card-header">
                <img src="./assets/apps/${app.icon}" alt="${app.title} icon" class="app-icon">
                <div>
                    <h3>${app.title}</h3>
                    <span class="project-stack">${app.stack}</span>
                </div>
            </div>
            <p class="app-tagline">${app.tagline}</p>
            <p class="app-description">${app.description}</p>
            <ul class="app-highlights">${highlightsHTML}</ul>
            <div class="app-cta">${app.cta} <i class="fa fa-arrow-right"></i></div>
        </a>
    `;
}

async function loadProjects() {
    const featuredContainer = document.getElementById('featured-container');
    const projectsContainer = document.getElementById('projects-container');
    try {
        const response = await fetch('./assets/projects.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const allProjects = await response.json();

        // Featured apps get their own cards at the top
        featuredContainer.innerHTML = allProjects
            .filter(project => project.featured)
            .map(generateAppCard)
            .join('');

        const projects = allProjects.filter(project => !project.featured);
        projectsContainer.innerHTML = ''; // Clear loading text

        projects.forEach(project => {
            // Create the links HTML if links exist
            let linksHTML = '';
            if (project.links && project.links.length > 0) {
                const linkElements = project.links.map(link => 
                    `<a href="${link.url}" target="_blank">${link.text}</a>`
                );
                // Join multiple links with a visual separator
                linksHTML = ` — ${linkElements.join('<span class="project-links-separator">|</span>')}`;
            }

            const stackHTML = project.stack
                ? `<span class="project-stack">${project.stack}</span>`
                : '';

            const projectItem = `
                <li>
                    <strong>${project.title}</strong>${linksHTML}<br>
                    ${stackHTML}
                    ${project.description}
                </li>
            `;
            projectsContainer.innerHTML += projectItem;
        });
    } catch (error) {
        console.error("Failed to load projects:", error);
        featuredContainer.innerHTML = `
            <p style="color: var(--text-secondary);">
                Check out <a href="https://karthikr06.github.io/SideStackApp/" target="_blank">SideStack</a> and <a href="https://apps.microsoft.com/detail/9p4dzl11whv5" target="_blank">TabWriter</a>.
            </p>
        `;
        projectsContainer.innerHTML = `
            <li style="list-style: none; color: var(--text-secondary);">
                Check out my projects on <a href="https://github.com/karthikr06" target="_blank">GitHub</a>.
            </li>
        `;
    }
}

// --- ARTICLES LOGIC ---
function generateArticleCard(article) {
    const imageHTML = article.hasImage 
        ? `<img src="./assets/articles/${article.id}.jpg" alt="${article.title}" class="blog-image" onerror="this.style.display='none';">` 
        : '';
        
    return `
        <a href="${article.link}" target="_blank" class="blog-card">
            ${imageHTML}
            <div class="blog-content">
                <h3>${article.title}</h3>
                <p class="blog-excerpt">${article.excerpt}</p>
                <div class="read-more">
                    Read full article <i class="fa fa-external-link"></i>
                </div>
            </div>
        </a>
    `;
}

async function loadArticles() {
    const topContainer = document.getElementById('top-articles-container');
    const modalContainer = document.getElementById('modal-articles-container');
    const viewAllContainer = document.getElementById('view-all-container');
    
    try {
        const response = await fetch('./assets/articles.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const articles = await response.json();
        
        topContainer.innerHTML = '';
        modalContainer.innerHTML = '';
        
        const topArticles = articles.slice(0, 2);
        topArticles.forEach(article => {
            topContainer.innerHTML += generateArticleCard(article);
        });

        if (articles.length > 2) {
            viewAllContainer.style.display = 'block';
            articles.forEach(article => {
                modalContainer.innerHTML += generateArticleCard(article);
            });
        }
        
    } catch (error) {
        console.error("Failed to load articles:", error);
        topContainer.innerHTML = `
            <p style="padding-top: 15px; color: var(--text-secondary);">
                Check out my latest articles on my <a href="https://www.linkedin.com/in/karthikr06/" target="_blank">LinkedIn</a>.
            </p>
        `;
    }
}

// --- RESUME LOGIC ---
async function loadResume() {
    const resumeLink = document.getElementById('resume-link');
    const resumeNewTab = document.getElementById('resume-new-tab');
    const resumeFrame = document.getElementById('resume-frame');
    try {
        const response = await fetch('./assets/profile.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const profile = await response.json();

        resumeLink.href = profile.resumeUrl;
        resumeNewTab.href = profile.resumeUrl;
        resumeLink.style.display = '';

        resumeLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Load the Drive preview only when the popup is first opened
            if (!resumeFrame.src) {
                resumeFrame.src = profile.resumeUrl.replace(/\/view.*$/, '/preview');
            }
            openModal(document.getElementById('resume-modal'));
        });
    } catch (error) {
        console.error("Failed to load resume link:", error);
    }
}

// --- MODAL EVENT LISTENERS ---
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

const openModalBtn = document.getElementById('open-modal-btn');

if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        openModal(document.getElementById('articles-modal'));
    });
}

document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.querySelector('.close-modal-btn').addEventListener('click', () => closeModal(modal));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
    }
});

// Initialize API fetches
loadProjects();
loadArticles();
loadResume();