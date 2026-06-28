// ==========================================================================
// CORE PORTFOLIO ENGINE (scripts/main.js)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // State Manager
    const state = {
        projects: [],
        activeProject: null,
        activeImageIndex: 0,
        activeCategory: 'All',
        isNavOpen: false
    };

    // DOM Elements Cache
    const el = {
        projectsGrid: document.getElementById('projectsGrid'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        drawer: document.getElementById('projectDrawer'),
        drawerBackdrop: document.getElementById('drawerBackdrop'),
        drawerClose: document.getElementById('drawerClose'),
        // API Explorer (Hero)
        routeBtns: document.querySelectorAll('.route-btn'),
        explorerUrl: document.getElementById('explorerUrl'),
        explorerResponse: document.getElementById('explorerResponse'),
        traceDbStep: document.getElementById('traceDbStep'),
        // Contact Form
        contactForm: document.getElementById('contactForm'),
        contactName: document.getElementById('contactName'),
        contactEmail: document.getElementById('contactEmail'),
        contactMessage: document.getElementById('contactMessage'),
        payloadPreview: document.getElementById('payloadPreview'),
        apiResponsePanel: document.getElementById('apiResponsePanel'),
        apiResponseText: document.getElementById('apiResponseText'),
        apiResponseStatus: document.getElementById('apiResponseStatus'),
        apiResponseTime: document.getElementById('apiResponseTime'),
        // ERD Selector
        techSelectBtns: document.querySelectorAll('.tech-select-btn'),
        erdTables: document.querySelectorAll('.erd-table'),
        expertiseTitle: document.getElementById('expertiseTitle'),
        expertiseDesc: document.getElementById('expertiseDesc'),
        expertiseTags: document.getElementById('expertiseTags'),
        // Navigation
        navbar: document.querySelector('.navbar'),
        mobileToggle: document.getElementById('mobileToggle'),
        navMenu: document.getElementById('navMenu'),
        navLinks: document.querySelectorAll('.nav-link')
    };

    // ==========================================================================
    // INITIALIZATION & DATA LOADING
    // ==========================================================================
    async function init() {
        await loadProjectsData();
        setupNavigation();
        setupProjectFilters();
        setupProjectDrawer();
        setupApiExplorer();
        setupContactForm();
        setupErdInteractivity();
        setupKeyboardShortcuts();
    }

    async function loadProjectsData() {
        // First check localStorage for live preview of local CMS edits
        const cachedProjects = localStorage.getItem('khushnood_portfolio_projects');
        let useCache = false;
        if (cachedProjects) {
            try {
                const parsed = JSON.parse(cachedProjects);
                // Self-healing: if cache doesn't have WHATSAPP SPAM DETECTOR (id: 9) or uses old image paths, discard it
                const hasWsd = parsed.some(p => p.id === 9);
                const hasUpdatedPaths = parsed.every(p => 
                    (!p.image || p.image.startsWith('project_images/')) && 
                    (!p.images || p.images.every(img => img.startsWith('project_images/')))
                );
                if (hasWsd && hasUpdatedPaths) {
                    state.projects = parsed;
                    console.log('✅ Projects loaded from local CMS cache.');
                    useCache = true;
                } else {
                    console.log('⚠️ Local cache is outdated. Clearing local cache to load fresh database files.');
                    localStorage.removeItem('khushnood_portfolio_projects');
                }
            } catch (e) {
                localStorage.removeItem('khushnood_portfolio_projects');
            }
        }

        if (useCache) {
            renderProjects();
            return;
        }

        try {
            // Attempt to fetch central JSON data
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error('Network response not OK');
            state.projects = await response.json();
            console.log('✅ Projects loaded via JSON fetch.');
        } catch (error) {
            console.warn('⚠️ JSON fetch failed (likely local file:// CORS). Falling back to window.projectsData.');
            if (window.projectsData) {
                state.projects = window.projectsData;
                console.log('✅ Projects loaded from fallback local JS script.');
            } else {
                console.error('❌ No fallback project data found.');
                state.projects = [];
            }
        }
        
        // Render projects grid
        renderProjects();
    }

    // ==========================================================================
    // NAVIGATION & LAYOUT
    // ==========================================================================
    function setupNavigation() {
        // Sticky header styling on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                el.navbar.classList.add('scrolled');
            } else {
                el.navbar.classList.remove('scrolled');
            }
            highlightActiveLink();
        });

        // Mobile Nav Drawer Toggle
        if (el.mobileToggle && el.navMenu) {
            el.mobileToggle.addEventListener('click', () => {
                state.isNavOpen = !state.isNavOpen;
                el.mobileToggle.classList.toggle('active', state.isNavOpen);
                el.navMenu.classList.toggle('active', state.isNavOpen);
            });
        }

        // Close Mobile Menu on Click
        el.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (state.isNavOpen) {
                    state.isNavOpen = false;
                    el.mobileToggle.classList.remove('active');
                    el.navMenu.classList.remove('active');
                }
            });
        });
    }

    function highlightActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        el.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // PROJECTS RENDER & FILTERING
    // ==========================================================================
    function setupProjectFilters() {
        el.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                el.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.activeCategory = btn.getAttribute('data-filter');
                renderProjects();
            });
        });
    }

    function renderProjects() {
        if (!el.projectsGrid) return;

        const isCatalogPage = document.querySelector('.catalog-header') !== null;

        // Filter projects by category first
        let filtered = state.projects.filter(project => {
            if (state.activeCategory === 'All') return true;
            if (state.activeCategory === 'Backend' && 
                (project.category === 'Backend Core' || project.category === 'Systems Engineering')) return true;
            if (state.activeCategory === 'Databases' && project.category === 'Databases') return true;
            if (state.activeCategory === 'Programming' && project.category === 'Programming Core') return true;
            return false;
        });

        // If on the homepage, filter to only show featured projects, and limit to 6 projects
        if (!isCatalogPage) {
            filtered = filtered.filter(project => project.featured);
            // Limit to 6 projects for the homepage "pagination" view
            filtered = filtered.slice(0, 6);
        }

        if (filtered.length === 0) {
            el.projectsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted); font-family: var(--font-mono);">
                    [INFO] No systems found matching filter.
                </div>
            `;
            return;
        }

        el.projectsGrid.innerHTML = filtered.map(p => {
            const projectImages = (p.images && p.images.length > 0) ? p.images : [p.image || 'project_images/pic.png'];
            return `
                <div class="project-card" data-id="${p.id}">
                    <div class="project-card-image">
                        <div class="project-card-slides" id="slides-${p.id}" data-active-idx="0">
                            ${projectImages.map(img => `
                                <img src="${img}" alt="${p.title}" loading="lazy" onerror="this.src='project_images/pic.png'">
                            `).join('')}
                        </div>
                        ${projectImages.length > 1 ? `
                            <button class="project-card-nav-btn prev" data-target="${p.id}" aria-label="Previous image">&lsaquo;</button>
                            <button class="project-card-nav-btn next" data-target="${p.id}" aria-label="Next image">&rsaquo;</button>
                            <div class="project-card-dots" id="dots-${p.id}">
                                ${projectImages.map((_, idx) => `
                                    <span class="project-card-dot ${idx === 0 ? 'active' : ''}" data-target="${p.id}" data-idx="${idx}"></span>
                                `).join('')}
                            </div>
                        ` : ''}
                        <span class="project-card-category badge badge-accent">${p.category}</span>
                    </div>
                    <div class="project-card-info">
                        <h3 class="project-card-title">${p.title}</h3>
                        <p class="project-card-tagline">${p.tagline}</p>
                        <div class="project-card-tags">
                            ${p.techStack.slice(0, 3).map(t => `<span class="project-card-tag">${t}</span>`).join('')}
                            ${p.techStack.length > 3 ? `<span class="project-card-tag">+${p.techStack.length - 3}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Attach click listeners to cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.getAttribute('data-id'));
                const project = state.projects.find(p => p.id === id);
                if (project) openProjectDetail(project);
            });
        });

        // Attach click listeners to card navigation buttons and dots
        document.querySelectorAll('.project-card-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening the detail drawer
                const projectId = parseInt(btn.getAttribute('data-target'));
                const project = state.projects.find(p => p.id === projectId);
                if (!project) return;
                const images = (project.images && project.images.length > 0) ? project.images : [project.image];
                if (images.length <= 1) return;

                const slidesContainer = document.getElementById(`slides-${projectId}`);
                if (!slidesContainer) return;
                let activeIdx = parseInt(slidesContainer.getAttribute('data-active-idx')) || 0;

                if (btn.classList.contains('prev')) {
                    activeIdx = (activeIdx - 1 + images.length) % images.length;
                } else {
                    activeIdx = (activeIdx + 1) % images.length;
                }

                updateCardSlide(projectId, activeIdx);
            });
        });

        document.querySelectorAll('.project-card-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening the detail drawer
                const projectId = parseInt(dot.getAttribute('data-target'));
                const activeIdx = parseInt(dot.getAttribute('data-idx'));
                updateCardSlide(projectId, activeIdx);
            });
        });
    }

    function updateCardSlide(projectId, index) {
        const slidesContainer = document.getElementById(`slides-${projectId}`);
        if (!slidesContainer) return;
        
        slidesContainer.setAttribute('data-active-idx', index);
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;

        const dotsContainer = document.getElementById(`dots-${projectId}`);
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.project-card-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });
        }
    }

    // ==========================================================================
    // CASE STUDY SLIDEOUT DRAWER
    // ==========================================================================
    function setupProjectDrawer() {
        el.drawerClose.addEventListener('click', closeProjectDrawer);
        el.drawerBackdrop.addEventListener('click', closeProjectDrawer);
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeProjectDrawer();
        });

        // Prev/Next slide navigation button event handlers
        const prevBtn = document.getElementById('drPrevBtn');
        const nextBtn = document.getElementById('drNextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (!state.activeProject) return;
                const images = state.activeProject.images || [state.activeProject.image];
                let newIdx = state.activeImageIndex - 1;
                if (newIdx < 0) newIdx = images.length - 1;
                goToSlide(newIdx);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (!state.activeProject) return;
                const images = state.activeProject.images || [state.activeProject.image];
                let newIdx = state.activeImageIndex + 1;
                if (newIdx >= images.length) newIdx = 0;
                goToSlide(newIdx);
            });
        }
    }

    function openProjectDetail(project) {
        state.activeProject = project;
        state.activeImageIndex = 0;

        // Populate Drawer Details
        document.getElementById('drCategory').textContent = project.category;
        document.getElementById('drTitle').textContent = project.title;
        document.getElementById('drOverview').textContent = project.description;
        document.getElementById('drProblem').textContent = project.problem || "No description provided.";
        document.getElementById('drArchitecture').textContent = project.architecture || "In-memory structures built with SOLID principles.";
        document.getElementById('drChallenges').textContent = project.challenges || "No challenge details provided.";
        document.getElementById('drLearnings').textContent = project.learnings || "No learning outcomes logged.";
        
        const drFuture = document.getElementById('drFuture');
        if (drFuture) {
            drFuture.textContent = project.futureImprovements || "No future upgrades planned.";
        }
        
        // Render tech tags
        const techContainer = document.getElementById('drTech');
        techContainer.innerHTML = project.techStack.map(t => `<span class="expertise-tag">${t}</span>`).join('');

        // Link buttons
        const githubBtn = document.getElementById('drGithub');
        if (project.github && project.github !== '#') {
            githubBtn.href = project.github;
            githubBtn.style.display = 'inline-flex';
        } else {
            githubBtn.style.display = 'none';
        }

        // Render Slideshow
        renderSlideshow(project.images || [project.image]);

        // Show Drawer
        el.drawerBackdrop.classList.add('open');
        el.drawer.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeProjectDrawer() {
        el.drawerBackdrop.classList.remove('open');
        el.drawer.classList.remove('open');
        document.body.style.overflow = '';
        state.activeProject = null;
    }

    function renderSlideshow(images) {
        const slidesContainer = document.getElementById('drSlides');
        const dotsContainer = document.getElementById('drDots');
        const prevBtn = document.getElementById('drPrevBtn');
        const nextBtn = document.getElementById('drNextBtn');

        if (!slidesContainer) return;

        // Render images
        slidesContainer.innerHTML = images.map(img => `
            <img class="drawer-slide-img" src="${img}" alt="Screenshot" onerror="this.src='project_images/pic.png'" style="cursor: pointer;">
        `).join('');

        if (images.length <= 1) {
            if (dotsContainer) dotsContainer.innerHTML = '';
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            slidesContainer.style.transform = 'translateX(0)';
            return;
        }

        // Show navigation buttons if multiple images
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';

        // Dots indicator
        if (dotsContainer) {
            dotsContainer.innerHTML = images.map((_, idx) => `
                <span class="drawer-gallery-dot ${idx === 0 ? 'active' : ''}" data-idx="${idx}"></span>
            `).join('');

            // Attach click listeners to dots
            document.querySelectorAll('.drawer-gallery-dot').forEach(dot => {
                dot.addEventListener('click', () => {
                    const idx = parseInt(dot.getAttribute('data-idx'));
                    goToSlide(idx);
                });
            });
        }

        // Allow clicking on the image to advance to the next slide
        // Remove previous event listener if any (re-add to prevent duplication)
        slidesContainer.onclick = () => {
            if (!state.activeProject) return;
            const imgs = state.activeProject.images || [state.activeProject.image];
            if (imgs.length <= 1) return;
            let newIdx = state.activeImageIndex + 1;
            if (newIdx >= imgs.length) newIdx = 0;
            goToSlide(newIdx);
        };

        // Set initial slide
        goToSlide(0);
    }

    function goToSlide(index) {
        state.activeImageIndex = index;
        const slidesContainer = document.getElementById('drSlides');
        const dots = document.querySelectorAll('.drawer-gallery-dot');
        
        if (slidesContainer) {
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        }

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });
    }

    // ==========================================================================
    // INTERACTIVE API EXPLORER (HERO)
    // ==========================================================================
    const explorerData = {
        profile: {
            url: "https://api.khushnood.dev/v1/profile",
            db: "MySQL",
            json: {
                "name": "Khushnood Ahmad",
                "role": "Java Backend Developer",
                "focus": [
                    "REST APIs",
                    "Database Normalization (3NF)",
                    "Clean System Architecture"
                ]
            }
        },
        skills: {
            url: "https://api.khushnood.dev/v1/skills",
            db: "MySQL",
            json: {
                "languages": ["Java", "C++", "Python", "SQL", "JavaScript", "Kotlin"],
                "frameworks": ["Spring Boot", "Spring MVC", "Spring Data JPA", "JUnit"],
                "databases": ["MySQL", "MongoDB", "Oracle DB"],
                "methodologies": ["3NF Schema Design", "RESTful Design", "SOLID", "OOP"]
            }
        },
        philosophy: {
            url: "https://api.khushnood.dev/v1/philosophy",
            db: "In-Memory",
            json: {
                "cleanCode": "Write code for humans first, optimized for machines.",
                "normalization": "Normalize to 3NF to prevent redundancy, index for performance.",
                "solid": "Decoupled modules are easier to test and extend."
            }
        }
    };

    function setupApiExplorer() {
        if (!el.routeBtns.length) return;

        el.routeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const route = btn.getAttribute('data-route');
                const data = explorerData[route];
                if (!data) return;

                // Toggle active buttons
                el.routeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update URL
                if (el.explorerUrl) {
                    el.explorerUrl.textContent = data.url;
                }

                // Update DB step indicator
                if (el.traceDbStep) {
                    el.traceDbStep.textContent = data.db;
                }

                // Update Response with animation
                if (el.explorerResponse) {
                    el.explorerResponse.style.opacity = 0;
                    setTimeout(() => {
                        el.explorerResponse.textContent = JSON.stringify(data.json, null, 2);
                        el.explorerResponse.style.opacity = 1;
                    }, 150);
                }
            });
        });
    }

    // ==========================================================================
    // CONTACT FORM & REAL-TIME PAYLOAD PREVIEW
    // ==========================================================================
    function setupContactForm() {
        if (!el.contactForm) return;

        // Function to update payload JSON preview
        function updatePayloadPreview() {
            const payload = {
                name: el.contactName.value || "",
                email: el.contactEmail.value || "",
                message: el.contactMessage.value || ""
            };
            if (el.payloadPreview) {
                el.payloadPreview.textContent = JSON.stringify(payload, null, 2);
            }
        }

        // Bind input events to update payload preview
        [el.contactName, el.contactEmail, el.contactMessage].forEach(input => {
            if (input) {
                input.addEventListener('input', updatePayloadPreview);
            }
        });

        // Form Submit
        el.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = el.contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            
            // Set loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="ping-indicator" style="background-color: var(--warning); margin-right: 0.5rem; display: inline-block;"></span>
                <span>Sending...</span>
            `;

            if (el.apiResponsePanel) {
                el.apiResponsePanel.style.display = 'none';
            }

            // Web3Forms Integration Config
            const WEB3FORMS_ACCESS_KEY = "bd1f3efe-1153-4a64-a6e7-642793231cdf"; 

            try {
                const name = el.contactName.value;
                const email = el.contactEmail.value;
                const message = el.contactMessage.value;

                if (!name || !email || !message) {
                    throw new Error("Validation Error: Please fill in all required fields.");
                }

                let emailSent = false;
                let apiMessage = "Message logged in system database.";

                if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
                    const response = await fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            access_key: WEB3FORMS_ACCESS_KEY,
                            name: name,
                            email: email,
                            message: message,
                            subject: `Portfolio Contact from ${name}`
                        })
                    });

                    const resData = await response.json();
                    if (response.ok && resData.success) {
                        emailSent = true;
                        apiMessage = "Email dispatched successfully via Web3Forms gateway.";
                    } else {
                        throw new Error(resData.message || "Failed to dispatch email via Web3Forms API.");
                    }
                } else {
                    // Simulate latency for the mockup experience
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.warn("⚠️ Web3Forms Access Key is missing or default. Email dispatch skipped (simulation mode).");
                    apiMessage = "Message simulation successful (Key not configured. Please get a free key from web3forms.com to send actual emails).";
                }

                // Render success status
                if (el.apiResponseStatus) {
                    el.apiResponseStatus.textContent = "200 OK";
                    el.apiResponseStatus.className = "api-status-code";
                }
                if (el.apiResponseTime) {
                    el.apiResponseTime.textContent = `${Math.floor(Math.random() * 50) + 120}ms`;
                }

                const successResponse = {
                    "status": "success",
                    "code": 200,
                    "timestamp": new Date().toISOString(),
                    "message": `Connection established successfully. Thank you, ${name}!`,
                    "email_dispatched": emailSent ? "Yes" : "No (Simulation Mode)",
                    "gateway_logs": apiMessage,
                    "routing": "API_GATEWAY_V1 ➔ web3forms-api-gateway ➔ contact-controller",
                    "actions": "I will review your message and reply via email within 24 hours."
                };

                if (el.apiResponseText) {
                    el.apiResponseText.textContent = JSON.stringify(successResponse, null, 2);
                    el.apiResponseText.classList.remove('error');
                }

                // Reset form fields and payload preview
                el.contactForm.reset();
                updatePayloadPreview();

            } catch (err) {
                // Render error status
                if (el.apiResponseStatus) {
                    el.apiResponseStatus.textContent = "400 Bad Request";
                    el.apiResponseStatus.className = "api-status-code error";
                }
                if (el.apiResponseTime) {
                    el.apiResponseTime.textContent = "25ms";
                }

                const errorResponse = {
                    "status": "error",
                    "code": 400,
                    "timestamp": new Date().toISOString(),
                    "error": err.message || "Invalid submission parameters."
                };

                if (el.apiResponseText) {
                    el.apiResponseText.textContent = JSON.stringify(errorResponse, null, 2);
                    el.apiResponseText.classList.add('error');
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                
                if (el.apiResponsePanel) {
                    el.apiResponsePanel.style.display = 'block';
                    el.apiResponsePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    }

    // ==========================================================================
    // INTERACTIVE ERD / TECH CAPABILITY MAP
    // ==========================================================================
    const skillsData = {
        backend: {
            title: "Java & Spring Boot Core Ecosystem",
            desc: "Expertise in designing scalable web services, enterprise REST APIs, handling data models, managing configuration properties, and writing production-ready test suites.",
            tags: ["Java SE/EE", "Spring Boot", "Spring MVC", "Spring JDBC", "REST APIs", "Maven", "Gradle", "JUnit", "SQL"]
        },
        databases: {
            title: "Data Architecture & Storage Engines",
            desc: "Proficient in relational schema modeling, normalization (up to 3NF), index optimization, and utilizing document storage systems for high throughput writes and low latency reads.",
            tags: ["MySQL", "MongoDB", "Oracle SQL", "Database Normalization", "Query Tuning", "ER Diagrams", "Indexes", "Transactions"]
        },
        programming: {
            title: "Core Programming Fundamentals",
            desc: "Solid foundation in core object-oriented structures, functional patterns, algorithmic analysis, design patterns, and cross-compiling applications across standard paradigms.",
            tags: ["Java", "C++", "Python", "JavaScript", "Kotlin", "Data Structures", "Algorithms", "Object-Oriented Design"]
        },
        tools: {
            title: "Developer Workflow & Environment Tools",
            desc: "Command over revision control, terminal debug environments, API testing cycles, dependency lifecycles, and IDE performance profiles.",
            tags: ["Git", "GitHub", "IntelliJ IDEA", "Postman", "Maven Compiler", "Terminal CLI", "Unix Shell Utilities"]
        },
        concepts: {
            title: "Software Engineering Core Concepts",
            desc: "Rigorous alignment with Clean Code principles, standard data architectures, API interface guidelines, and system modeling methodologies.",
            tags: ["OOP Principles", "API Design", "Database Modeling", "Clean Code", "Design Patterns", "Systems Architecture"]
        }
    };

    function setupErdInteractivity() {
        if (!el.techSelectBtns.length) return;

        el.techSelectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-cat');
                
                // Highlight button
                el.techSelectBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Highlight corresponding ERD table
                el.erdTables.forEach(table => {
                    table.classList.remove('active-relation');
                    if (table.getAttribute('data-table') === category) {
                        table.classList.add('active-relation');
                    }
                });

                // Update text panel
                updateExpertiseDisplay(category);
            });
        });

        // Add direct click listener to ERD tables
        el.erdTables.forEach(table => {
            table.addEventListener('click', () => {
                const tableCat = table.getAttribute('data-table');
                
                // Click matching category button
                const matchingBtn = Array.from(el.techSelectBtns).find(btn => btn.getAttribute('data-cat') === tableCat);
                if (matchingBtn) {
                    matchingBtn.click();
                }
            });
        });

        // Default display on load
        updateExpertiseDisplay('backend');
    }

    function updateExpertiseDisplay(category) {
        const info = skillsData[category];
        if (!info) return;

        el.expertiseTitle.textContent = info.title;
        el.expertiseDesc.textContent = info.desc;
        
        el.expertiseTags.innerHTML = info.tags.map(tag => `
            <span class="expertise-tag">${tag}</span>
        `).join('');
    }

    // ==========================================================================
    // KEYBOARD SHORTCUTS (CMS DOCK TRIGGER)
    // ==========================================================================
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Secret keybind: Ctrl + Shift + P
            if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'P') {
                e.preventDefault();
                console.log('⚡ Secret developer gateway activated. Redirecting to admin projects panel.');
                
                // Redirect after a brief visual pause
                setTimeout(() => {
                    window.location.href = 'admin/index.html';
                }, 800);
            }
        });
    }

    // Run Engine Init
    init();
});
