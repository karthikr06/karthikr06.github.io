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
async function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    try {
        const response = await fetch('./assets/projects.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const projects = await response.json();
        
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

// --- MODAL EVENT LISTENERS ---
const modal = document.getElementById('articles-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Initialize API fetches
loadProjects();
loadArticles();