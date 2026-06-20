// ==========================================================================
// CMS PORTFOLIO PROJECT MANAGER (scripts/cms.js)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const state = {
        projects: [],
        editingProjectId: null
    };

    // DOM Elements
    const form = document.getElementById('projectForm');
    const projectList = document.getElementById('projectList');
    const formTitle = document.getElementById('formTitle');
    const resetBtn = document.getElementById('resetBtn');
    
    // Export Elements
    const exportBtn = document.getElementById('exportBtn');
    const exportOverlay = document.getElementById('exportOverlay');
    const closeExport = document.getElementById('closeExport');
    const jsonOutput = document.getElementById('jsonOutput');
    const downloadJsonBtn = document.getElementById('downloadJsonBtn');
    const copyJsonBtn = document.getElementById('copyJsonBtn');

    // ==========================================================================
    // INITIALIZATION & DATA LOADING
    // ==========================================================================
    function init() {
        loadProjects();
        setupForm();
        setupExport();
    }

    function loadProjects() {
        // First check localStorage for user changes
        const localData = localStorage.getItem('khushnood_portfolio_projects');
        
        if (localData) {
            state.projects = JSON.parse(localData);
            console.log('✅ Loaded projects from local cache.');
        } else if (window.projectsData) {
            state.projects = window.projectsData;
            console.log('✅ Loaded projects from window.projectsData.');
        } else {
            console.error('❌ No initial project data found.');
            state.projects = [];
        }

        renderProjectList();
    }

    // Save current state to localStorage (immediate preview)
    function saveToCache() {
        localStorage.setItem('khushnood_portfolio_projects', JSON.stringify(state.projects));
    }

    // ==========================================================================
    // ADMIN LIST RENDER
    // ==========================================================================
    function renderProjectList() {
        if (!projectList) return;

        if (state.projects.length === 0) {
            projectList.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">No projects logged. Use the form to add one.</div>`;
            return;
        }

        projectList.innerHTML = state.projects.map(p => `
            <div class="admin-project-item" data-id="${p.id}">
                <div class="admin-item-info">
                    <span class="admin-item-title">${p.title}</span>
                    <div class="admin-item-meta">
                        <span>Category: ${p.category}</span>
                        <span>•</span>
                        <span>Featured: ${p.featured ? 'Yes' : 'No'}</span>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-mono btn-edit" data-id="${p.id}">Edit</button>
                    <button class="btn btn-mono btn-delete" data-id="${p.id}" style="color: var(--danger); border-color: rgba(248, 113, 113, 0.2);">Del</button>
                </div>
            </div>
        `).join('');

        // Attach action events
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                loadProjectToForm(id);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                if (confirm('Are you sure you want to remove this project?')) {
                    deleteProject(id);
                }
            });
        });
    }

    // ==========================================================================
    // FORM CONTROLLER
    // ==========================================================================
    function setupForm() {
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProjectFromForm();
        });

        resetBtn.addEventListener('click', () => {
            clearForm();
        });
    }

    function clearForm() {
        form.reset();
        state.editingProjectId = null;
        formTitle.textContent = "Create New Project";
        resetBtn.textContent = "Clear Form";
    }

    function loadProjectToForm(id) {
        const p = state.projects.find(proj => proj.id === id);
        if (!p) return;

        state.editingProjectId = id;
        formTitle.textContent = `Edit: ${p.title}`;
        resetBtn.textContent = "Cancel Edit";

        // Fill form fields
        document.getElementById('pTitle').value = p.title || '';
        document.getElementById('pTagline').value = p.tagline || '';
        document.getElementById('pCategory').value = p.category || 'Backend Core';
        document.getElementById('pTechStack').value = (p.techStack || []).join(', ');
        document.getElementById('pImage').value = p.image || '';
        document.getElementById('pImages').value = (p.images || []).join(', ');
        document.getElementById('pGithub').value = p.github || '';
        document.getElementById('pFeatured').checked = !!p.featured;
        document.getElementById('pDescription').value = p.description || '';
        
        // Extended Details
        document.getElementById('pProblem').value = p.problem || '';
        document.getElementById('pArchitecture').value = p.architecture || '';
        document.getElementById('pChallenges').value = p.challenges || '';
        document.getElementById('pLearnings').value = p.learnings || '';
        document.getElementById('pFuture').value = p.futureImprovements || '';
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
    }

    function saveProjectFromForm() {
        const title = document.getElementById('pTitle').value.trim();
        const tagline = document.getElementById('pTagline').value.trim();
        const category = document.getElementById('pCategory').value;
        const techStack = document.getElementById('pTechStack').value.split(',').map(s => s.trim()).filter(Boolean);
        const image = document.getElementById('pImage').value.trim() || 'pic.png';
        const images = document.getElementById('pImages').value.split(',').map(s => s.trim()).filter(Boolean);
        const github = document.getElementById('pGithub').value.trim() || '#';
        const featured = document.getElementById('pFeatured').checked;
        const description = document.getElementById('pDescription').value.trim();
        
        const problem = document.getElementById('pProblem').value.trim();
        const architecture = document.getElementById('pArchitecture').value.trim();
        const challenges = document.getElementById('pChallenges').value.trim();
        const learnings = document.getElementById('pLearnings').value.trim();
        const future = document.getElementById('pFuture').value.trim();

        if (!title) {
            alert('Please enter a project title.');
            return;
        }

        if (state.editingProjectId !== null) {
            // Update Existing Project
            const projectIdx = state.projects.findIndex(p => p.id === state.editingProjectId);
            if (projectIdx !== -1) {
                state.projects[projectIdx] = {
                    ...state.projects[projectIdx],
                    title,
                    tagline,
                    category,
                    techStack,
                    image,
                    images: images.length > 0 ? images : [image],
                    github,
                    featured,
                    description,
                    problem,
                    architecture,
                    challenges,
                    learnings,
                    futureImprovements: future
                };
            }
        } else {
            // Create New Project
            // Find max ID
            const maxId = state.projects.reduce((max, p) => p.id > max ? p.id : max, 0);
            
            const newProject = {
                id: maxId + 1,
                title,
                tagline,
                category,
                techStack,
                image,
                images: images.length > 0 ? images : [image],
                github,
                live: '#',
                featured,
                description,
                problem,
                architecture,
                challenges,
                learnings,
                futureImprovements: future
            };
            
            state.projects.push(newProject);
        }

        saveToCache();
        renderProjectList();
        clearForm();
        alert('Project structure saved successfully! Note: To make changes permanent in files, click Export JSON and follow instructions.');
    }

    function deleteProject(id) {
        state.projects = state.projects.filter(p => p.id !== id);
        saveToCache();
        renderProjectList();
        if (state.editingProjectId === id) {
            clearForm();
        }
    }

    // ==========================================================================
    // EXPORT PAYLOAD PANEL
    // ==========================================================================
    function setupExport() {
        if (!exportBtn) return;

        exportBtn.addEventListener('click', () => {
            // Generate formatted JSON representing state
            const payload = JSON.stringify(state.projects, null, 2);
            jsonOutput.value = payload;
            exportOverlay.classList.add('active');
        });

        closeExport.addEventListener('click', () => {
            exportOverlay.classList.remove('active');
        });

        // Close when clicking outside modal
        exportOverlay.addEventListener('click', (e) => {
            if (e.target === exportOverlay) {
                exportOverlay.classList.remove('active');
            }
        });

        // Copy JSON logic
        copyJsonBtn.addEventListener('click', () => {
            jsonOutput.select();
            document.execCommand('copy');
            copyJsonBtn.textContent = "Copied!";
            setTimeout(() => {
                copyJsonBtn.textContent = "Copy Clipboard";
            }, 2000);
        });

        // Download JSON logic
        downloadJsonBtn.addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonOutput.value);
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "projects.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });
    }

    // Run CMS Init
    init();
});
