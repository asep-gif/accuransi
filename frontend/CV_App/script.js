// --- State Management ---
const state = {
    lang: 'id',
    template: 'modern',
    zoom: 1.0,
    mobileView: 'editor', // 'editor' or 'preview'
    designPanelOpen: false,
    design: {
        primaryColor: '#2563eb',
        sidebarBgColor: '#1e293b',
        sidebarTextColor: '#f8fafc',
        textColor: '#1f2937',
        fontHeading: "'Inter', sans-serif",
        fontBody: "'Inter', sans-serif",
        fontScale: 1.0,
        lineHeight: 1.6,
        pageMargin: 3, // in rem
        sectionSpacing: 2.5, // in rem
    },
    labels: {
        id: {
            personal: "Informasi Pribadi",
            contact: "Kontak",
            summary: "Profil Singkat",
            exp: "Pengalaman Kerja",
            edu: "Pendidikan",
            skills: "Keahlian",
            portfolio: "Portofolio",
            video: "Video Perkenalan",
            documents: "Dokumen",
            name: "Nama Lengkap",
            job: "Posisi / Gelar",
            phone: "Telepon",
            address: "Alamat",
            selectTemplate: "PILIH DESAIN",
            print: "Unduh PDF"
        },
        en: {
            personal: "Personal Info",
            contact: "Contact",
            summary: "Professional Summary",
            exp: "Work Experience",
            edu: "Education",
            skills: "Skills",
            portfolio: "Portfolio",
            video: "Introduction Video",
            documents: "Documents",
            name: "Full Name",
            job: "Job Title",
            phone: "Phone",
            address: "Address",
            selectTemplate: "CHOOSE TEMPLATE",
            print: "Download PDF"
        }
    }
};

const colorPresets = [
    { name: 'Default Blue', primary: '#2563eb', text: '#1f2937', sidebarBg: '#1e293b', sidebarText: '#f8fafc' },
    { name: 'Emerald Green', primary: '#059669', text: '#1f2937', sidebarBg: '#064e3b', sidebarText: '#ecfdf5' },
    { name: 'Slate Gray', primary: '#475569', text: '#1e293b', sidebarBg: '#f1f5f9', sidebarText: '#334155' },
    { name: 'Rose Gold', primary: '#b45309', text: '#44403c', sidebarBg: '#fff7ed', sidebarText: '#44403c' },
    { name: 'Deep Purple', primary: '#7c3aed', text: '#1e293b', sidebarBg: '#3730a3', sidebarText: '#eef2ff' },
    { name: 'Crimson Red', primary: '#dc2626', text: '#1f2937', sidebarBg: '#fef2f2', sidebarText: '#3f3f46' },
    { name: 'Monochrome', primary: '#1f2937', text: '#1f2937', sidebarBg: '#f3f4f6', sidebarText: '#1f2937' },
    { name: 'Oceanic Teal', primary: '#0d9488', text: '#1f2937', sidebarBg: '#0f172a', sidebarText: '#f0f9ff' }
];

// --- Helper Functions ---
const getVal = (id) => document.getElementById(id).value;
const getText = (key) => state.labels[state.lang][key];

function toggleLanguage() {
    state.lang = state.lang === 'id' ? 'en' : 'id';
    updateUILabels();
    renderCV();
}

function setTemplate(tempName) {
    state.template = tempName;
    
    // Visual Active State
    document.querySelectorAll('.template-card').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${tempName}`).classList.add('active');
    
    renderCV();
}

function changeZoom(delta) {
    state.zoom = Math.max(0.5, Math.min(1.5, state.zoom + delta));
    document.getElementById('cvPreview').style.transform = `scale(${state.zoom})`;
    document.getElementById('zoomLevel').innerText = Math.round(state.zoom * 100) + '%';
}

function toggleDesignPanel() {
    state.designPanelOpen = !state.designPanelOpen;
    const designPanel = document.getElementById('design-panel');
    const designButton = document.getElementById('btn-design-toggle');

    if (state.designPanelOpen) {
        designPanel.classList.remove('hidden');
        designPanel.classList.add('flex'); // It's a flex-col
        designButton.classList.add('bg-blue-100', 'text-blue-700');
    } else {
        designPanel.classList.add('hidden');
        designPanel.classList.remove('flex');
        designButton.classList.remove('bg-blue-100', 'text-blue-700');
    }
}

function applyPreset(preset) {
    // Update state
    state.design.primaryColor = preset.primary;
    state.design.textColor = preset.text;
    state.design.sidebarBgColor = preset.sidebarBg;
    state.design.sidebarTextColor = preset.sidebarText;

    // Update color pickers UI
    document.getElementById('primary-color').value = preset.primary;
    document.getElementById('text-color').value = preset.text;
    document.getElementById('sidebar-bg-color').value = preset.sidebarBg;
    document.getElementById('sidebar-text-color').value = preset.sidebarText;

    // Re-render the CV
    renderCV();
}

function updateUILabels() {
    // Translate all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        if (getText(key)) {
            el.innerText = getText(key);
        }
    });
    // Translate all elements with data-lang-placeholder attribute
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.dataset.langPlaceholder;
        if (getText(key)) {
            el.placeholder = getText(key);
        }
    });
    document.getElementById('lang-label').innerText = state.lang.toUpperCase();
}

// --- Rendering Logic ---
function renderCV() {
    const preview = document.getElementById('cvPreview');

    // Apply design styles as CSS variables
    preview.style.setProperty('--primary-color', state.design.primaryColor);
    preview.style.setProperty('--sidebar-bg-color', state.design.sidebarBgColor);
    preview.style.setProperty('--sidebar-text-color', state.design.sidebarTextColor);
    preview.style.setProperty('--text-color', state.design.textColor);
    preview.style.setProperty('--font-heading', state.design.fontHeading);
    preview.style.setProperty('--font-body', state.design.fontBody);

    // Add new CSS variables for layout
    preview.style.setProperty('--page-margin', `${state.design.pageMargin}rem`);
    preview.style.setProperty('--section-spacing', `${state.design.sectionSpacing}rem`);

    // Inject dynamic styles for font scaling and line height
    const { fontScale, lineHeight } = state.design;
    const dynamicStyles = `
    <style>
        #cvPreview {
            --font-scale: ${fontScale};
            line-height: ${lineHeight};
        }
        #cvPreview .text-xs { font-size: calc(0.75rem * var(--font-scale)); }
        #cvPreview .text-sm { font-size: calc(0.875rem * var(--font-scale)); }
        #cvPreview .text-base { font-size: calc(1rem * var(--font-scale)); }
        #cvPreview .text-lg { font-size: calc(1.125rem * var(--font-scale)); }
        #cvPreview .text-xl { font-size: calc(1.25rem * var(--font-scale)); }
        #cvPreview .text-2xl { font-size: calc(1.5rem * var(--font-scale)); }
        #cvPreview .text-3xl { font-size: calc(1.875rem * var(--font-scale)); }
        #cvPreview .text-4xl { font-size: calc(2.25rem * var(--font-scale)); }
        #cvPreview .text-5xl { font-size: calc(3rem * var(--font-scale)); }
        #cvPreview .text-6xl { font-size: calc(3.75rem * var(--font-scale)); }
    </style>
    `;

    const data = {
        photo: getVal('photo'),
        name: getVal('fullName'),
        job: getVal('jobTitle'),
        email: getVal('email'),
        phone: getVal('phone'),
        address: getVal('address'),
        summary: getVal('summary'),
        videoUrl: getVal('videoUrl'),
        skills: getVal('skills').split(',').map(s => s.trim()).filter(s => s)
    };

    // --- Dynamic Experience Data Gathering ---
    data.experiences = [];
    document.querySelectorAll('.experience-item').forEach(item => {
        const role = item.querySelector('[name="exp_role"]').value;
        if (role) {
            data.experiences.push({
                role,
                comp: item.querySelector('[name="exp_comp"]').value,
                date: item.querySelector('[name="exp_date"]').value,
                desc: item.querySelector('[name="exp_desc"]').value,
            });
        }
    });

    // --- Dynamic Education Data Gathering ---
    data.educations = [];
    document.querySelectorAll('.education-item').forEach(item => {
        const school = item.querySelector('[name="edu_school"]').value;
        if (school) {
            data.educations.push({
                school,
                degree: item.querySelector('[name="edu_degree"]').value,
                date: item.querySelector('[name="edu_date"]').value,
            });
        }
    });

    // --- Dynamic Portfolio Data Gathering ---
    const portfolioItems = [];
    document.querySelectorAll('.portfolio-item').forEach(item => {
        const name = item.querySelector('[name="portfolio_name"]').value;
        const url = item.querySelector('[name="portfolio_url"]').value;
        const desc = item.querySelector('[name="portfolio_desc"]').value;
        if (name) { // Only add if project name exists
            portfolioItems.push({ name, url, desc });
        }
    });

    // --- Dynamic Document Data Gathering ---
    data.documents = [];
    document.querySelectorAll('.document-item').forEach(item => {
        const name = item.querySelector('[name="doc_name"]').value;
        const url = item.querySelector('[name="doc_url"]').value;
        if (name && url) {
            data.documents.push({ name, url });
        }
    });

    const addressInput = document.getElementById('address');
    const lat = addressInput.dataset.lat;
    const lng = addressInput.dataset.lng;

    let mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`;
    if (lat && lng) {
        // If we have coordinates, use them for a more precise link
        mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    }

    let html = '';

    // --- Reusable Video Embed Generator ---
    const getVideoEmbedUrl = (url) => {
        if (!url) return null;

        // YouTube
        const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const ytMatch = url.match(ytRegex);
        if (ytMatch && ytMatch[2].length === 11) {
            return `https://www.youtube.com/embed/${ytMatch[2]}`;
        }

        // Google Drive
        const gdRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
        const gdMatch = url.match(gdRegex);
        if (gdMatch && gdMatch[1]) {
            return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
        }

        return null;
    };

    const videoEmbedUrl = getVideoEmbedUrl(data.videoUrl);
    const generateVideoHTML = (containerClass = '', titleClass = '', containerStyle = '') => {
        if (!videoEmbedUrl) return '';
        const isGoogleDrive = videoEmbedUrl.includes('drive.google.com');
        return `
            <section class="${containerClass}" style="${containerStyle}">
                <h2 class="${titleClass}">${getText('video')}</h2>
                <div class="video-container rounded-lg overflow-hidden shadow-md border">
                    <iframe src="${videoEmbedUrl}" frameborder="0" allow="${isGoogleDrive ? 'autoplay; fullscreen' : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'}" allowfullscreen></iframe>
                </div>
            </section>`;
    };

    // --- Reusable Portfolio HTML Generator ---
    const generatePortfolioHTML = (itemClass, titleClass, linkClass, descClass) => {
        return portfolioItems.map(p => {
            if (!p.name) return '';
            const link = p.url ? `<a href="${p.url}" target="_blank" class="${linkClass}" style="color: var(--primary-color);">${p.url.replace(/^(https?:\/\/)?(www\.)?/, '')} <i class="fas fa-external-link-alt text-xs opacity-50"></i></a>` : '';
            return `
                <div class="${itemClass}">
                    <h3 class="${titleClass}" style="font-family: var(--font-heading); color: var(--text-color);">${p.name}</h3>
                    ${link}
                    <p class="${descClass}" style="color: var(--text-color); opacity: 0.9;">${p.desc}</p>
                </div>
            `;
        }).join('');
    };

    const hasPortfolio = portfolioItems.length > 0;

    // --- TEMPLATE 1: MODERN SIDEBAR ---
    if (state.template === 'modern') {
        html = `
            <div class="flex h-full min-h-[297mm]" style="font-family: var(--font-body);">
                <!-- Sidebar -->
                <div class="w-1/3 flex flex-col" style="background-color: var(--sidebar-bg-color); color: var(--sidebar-text-color); padding: calc(var(--page-margin) * 0.8);">
                    ${data.photo ? `<div class="mb-8"><img src="${data.photo}" class="w-36 h-36 rounded-full object-cover border-4 mx-auto shadow-lg" style="border-color: var(--sidebar-text-color);" onerror="this.style.display='none'"></div>` : ''}
                    
                    <div style="margin-bottom: var(--section-spacing);">
                        <h3 class="text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2" style="opacity: 0.7; border-color: var(--sidebar-text-color); border-opacity: 0.3;">${getText('contact')}</h3>
                        <div class="space-y-4 text-sm" style="opacity: 0.9;">
                            <div class="flex items-start gap-3"><i class="fas fa-envelope mt-1" style="opacity: 0.7;"></i> <span class="break-all">${data.email}</span></div>
                            <div class="flex items-start gap-3"><i class="fas fa-phone mt-1" style="opacity: 0.7;"></i> <span>${data.phone}</span></div>
                            <div class="flex items-start gap-3"><i class="fas fa-map-marker-alt mt-1" style="opacity: 0.7;"></i> <a href="${mapsUrl}" target="_blank" class="hover:underline">${data.address}</a></div>
                        </div>
                    </div>

                    <div style="margin-bottom: var(--section-spacing);">
                        <h3 class="text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2" style="opacity: 0.7; border-color: var(--sidebar-text-color); border-opacity: 0.3;">${getText('skills')}</h3>
                        <div class="flex flex-wrap gap-2">
                            ${data.skills.map(s => `<span class="text-xs px-3 py-1.5 rounded-full border" style="color: var(--sidebar-text-color); background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); opacity: 0.9;">${s}</span>`).join('')}
                        </div>
                    </div>

                    <div style="margin-bottom: var(--section-spacing);">
                        <h3 class="text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2" style="opacity: 0.7; border-color: var(--sidebar-text-color); border-opacity: 0.3;">${getText('edu')}</h3>
                        ${data.educations.map(edu => `
                            <div class="mb-4">
                                <h4 class="font-bold text-sm">${edu.school}</h4>
                                <p class="text-xs italic" style="opacity: 0.9;">${edu.degree}</p>
                                <p class="text-xs mt-1" style="opacity: 0.7;">${edu.date}</p>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-bottom: var(--section-spacing);">
                        <h3 class="text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2" style="opacity: 0.7; border-color: var(--sidebar-text-color); border-opacity: 0.3;">${getText('documents')}</h3>
                        <div class="space-y-3">
                        ${data.documents.map(doc => `
                            <a href="${doc.url}" target="_blank" class="flex items-center gap-3 text-sm transition-colors hover:opacity-100" style="opacity: 0.9;">
                                <i class="fas fa-file-pdf w-4 text-center" style="opacity: 0.7;"></i>
                                <span class="flex-1 underline underline-offset-2 decoration-dotted">${doc.name}</span>
                            </a>
                        `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="w-2/3 bg-white" style="color: var(--text-color); padding: var(--page-margin);">
                    <header style="margin-bottom: var(--section-spacing);">
                        <h1 class="text-5xl font-bold uppercase tracking-tight mb-3 leading-none" style="font-family: var(--font-heading); color: var(--text-color);">${data.name}</h1>
                        <p class="text-xl font-medium tracking-wide uppercase" style="color: var(--primary-color); font-family: var(--font-heading);">${data.job}</p>
                    </header>

                    <section style="margin-bottom: var(--section-spacing);">
                        <h2 class="text-lg font-bold uppercase border-b-2 border-slate-100 mb-5 pb-2 flex items-center gap-2" style="font-family: var(--font-heading); color: var(--text-color);">
                            <span class="w-2 h-6 inline-block rounded-sm" style="background-color: var(--primary-color);"></span> ${getText('summary')}
                        </h2>
                        <p class="leading-relaxed text-justify">${data.summary}</p>
                    </section>

                    <section style="margin-bottom: var(--section-spacing);">
                        <h2 class="text-lg font-bold uppercase border-b-2 border-slate-100 mb-6 pb-2 flex items-center gap-2" style="font-family: var(--font-heading); color: var(--text-color);">
                            <span class="w-2 h-6 inline-block rounded-sm" style="background-color: var(--primary-color);"></span> ${getText('exp')}
                        </h2>
                        
                        ${data.experiences.map(exp => `
                            <div class="mb-6 pl-4 border-l-2 border-slate-200 transition-colors" style="border-left-color: var(--primary-color-light);">
                                <div class="flex justify-between items-baseline mb-1">
                                    <h3 class="font-bold text-lg" style="color: var(--text-color);">${exp.role}</h3>
                                    <span class="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">${exp.date}</span>
                                </div>
                                <div class="text-sm font-semibold mb-2" style="color: var(--primary-color);">${exp.comp}</div>
                                <p class="text-sm leading-relaxed">${exp.desc}</p>
                            </div>
                        `).join('')}
                    </section>

                    ${hasPortfolio ? `
                    <section>
                        <h2 class="text-lg font-bold uppercase text-slate-800 border-b-2 border-slate-100 mb-6 pb-2 flex items-center gap-2">
                            <span class="w-2 h-6 inline-block rounded-sm" style="background-color: var(--primary-color);"></span> ${getText('portfolio')}
                        </h2>
                        <div class="space-y-6">
                            ${generatePortfolioHTML('pl-4 border-l-2 border-slate-200', 'font-bold text-lg mb-1', 'text-sm font-semibold mb-2 block', 'text-sm leading-relaxed')}
                        </div>
                    </section>` : ''}

                    ${generateVideoHTML('', 'text-lg font-bold uppercase text-slate-800 border-b-2 border-slate-100 mb-6 pb-2 flex items-center gap-2', 'margin-top: var(--section-spacing);')}
                </div>
            </div>
        `;
    } 
    
    // --- TEMPLATE 2: CLEAN MINIMAL ---
    else if (state.template === 'minimal') {
        html = `
            <div class="h-full min-h-[297mm] bg-white" style="color: var(--text-color); font-family: var(--font-body); padding: var(--page-margin);">
                <header class="text-center pb-8 border-b" style="border-color: var(--primary-color); margin-bottom: var(--section-spacing);">
                    <h1 class="text-5xl font-bold mb-3 tracking-wide" style="font-family: var(--font-heading);">${data.name}</h1>
                    <p class="text-sm uppercase tracking-[0.2em] mb-6" style="color: var(--text-color); opacity: 0.7;">${data.job}</p>
                    <div class="flex justify-center flex-wrap gap-6 text-sm italic" style="color: var(--text-color); opacity: 0.7;">
                        <span>${data.email}</span>
                        <span>${data.phone}</span>
                        <a href="${mapsUrl}" target="_blank" class="hover:underline">${data.address}</a>
                    </div>
                </header>

                <section style="margin-bottom: var(--section-spacing);">
                     <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">--- ${getText('summary')} ---</h2>
                     <p class="leading-relaxed text-justify max-w-2xl mx-auto text-lg font-light">${data.summary}</p>
                </section>

                <section class="max-w-3xl mx-auto" style="margin-bottom: var(--section-spacing);">
                    <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-200 pb-2" style="font-family: var(--font-heading);">${getText('exp')}</h2>
                    
                    ${data.experiences.map(exp => `
                        <div class="mb-8 grid grid-cols-4 gap-4">
                            <div class="col-span-1 text-right pt-1">
                                <span class="text-sm block" style="color: var(--text-color); opacity: 0.7;">${exp.date}</span>
                            </div>
                            <div class="col-span-3 border-l border-gray-200 pl-6 pb-2">
                                <h3 class="font-bold text-xl" style="font-family: var(--font-heading);">${exp.role}</h3>
                                <div class="italic mb-2" style="color: var(--text-color); opacity: 0.9;">${exp.comp}</div>
                                <p class="text-sm leading-relaxed">${exp.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </section>

                <div class="grid grid-cols-2 gap-12 max-w-3xl mx-auto border-t border-gray-200 pt-8">
                    <div>
                        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4" style="font-family: var(--font-heading);">${getText('edu')}</h2>
                        ${data.educations.map(edu => `
                            <div class="mb-4">
                                <h3 class="font-bold text-lg" style="font-family: var(--font-heading);">${edu.school}</h3>
                                <p class="text-md italic" style="color: var(--text-color); opacity: 0.9;">${edu.degree}</p>
                                <p class="text-sm mt-1" style="color: var(--text-color); opacity: 0.6;">${edu.date}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div>
                        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4" style="font-family: var(--font-heading);">${getText('skills')}</h2>
                        <div class="flex flex-wrap gap-x-2 gap-y-1 text-sm" style="color: var(--text-color); opacity: 0.9;">
                            ${data.skills.map(s => `<span>• ${s}</span>`).join('')}
                        </div>
                    </div>
                </div>

                ${hasPortfolio ? `
                <section class="max-w-3xl mx-auto" style="margin-top: var(--section-spacing);">
                    <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-200 pb-2">${getText('portfolio')}</h2>
                    <div class="space-y-8">
                        ${generatePortfolioHTML('grid grid-cols-4 gap-4', 'font-bold text-xl col-span-3 col-start-2', 'italic mb-2 col-span-3 col-start-2 block', 'text-sm leading-relaxed col-span-3 col-start-2')}
                    </div>
                </section>
                ` : ''}

                ${generateVideoHTML('max-w-3xl mx-auto', 'text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-200 pb-2', 'margin-top: var(--section-spacing);')}

            </div>
        `;
    }

    // --- TEMPLATE 3: CORPORATE PRO ---
    else if (state.template === 'corporate') {
        html = `
            <div class="h-full min-h-[297mm] bg-white" style="color: var(--text-color); font-family: var(--font-body); padding: var(--page-margin);">
                <!-- Header -->
                <div class="flex justify-between items-end border-b-4 pb-6" style="border-color: var(--primary-color); margin-bottom: var(--section-spacing);">
                    <div>
                        <h1 class="text-6xl font-bold uppercase tracking-tighter mb-1" style="font-family: var(--font-heading);">${data.name}</h1>
                        <p class="text-2xl italic" style="color: var(--text-color); opacity: 0.8;">${data.job}</p>
                    </div>
                    <div class="text-right text-sm font-medium space-y-1">
                        <div class="block">${data.email}</div>
                        <div class="block">${data.phone}</div>
                        <a href="${mapsUrl}" target="_blank" class="block hover:underline">${data.address}</a>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-8">
                    
                    <!-- Left Col -->
                    <div class="col-span-8 pr-6 border-r border-gray-200">
                        <!-- Summary -->
                        <div style="margin-bottom: var(--section-spacing);">
                            <h2 class="text-2xl font-bold uppercase mb-4 tracking-wider flex items-center" style="font-family: var(--font-heading);">
                                <i class="fas fa-quote-left text-gray-300 mr-3 text-sm"></i> ${getText('summary')}
                            </h2>
                            <p class="leading-7 text-justify text-lg" style="color: var(--text-color); opacity: 0.9;">${data.summary}</p>
                        </div>

                        <!-- Experience -->
                        <div>
                            <h2 class="text-2xl font-bold uppercase mb-6 tracking-wider bg-gray-100 p-2" style="font-family: var(--font-heading);">${getText('exp')}</h2>
                            
                            ${data.experiences.map(exp => `
                                <div class="mb-8">
                                    <div class="flex justify-between mb-1 items-center">
                                        <h3 class="font-bold text-xl">${exp.role}</h3>
                                        <span class="font-bold text-sm border-b" style="border-color: var(--text-color);">${exp.date}</span>
                                    </div>
                                    <div class="italic mb-3 text-lg" style="color: var(--text-color); opacity: 0.8;">${exp.comp}</div>
                                    <p class="text-base leading-relaxed" style="color: var(--text-color); opacity: 0.9;">${exp.desc}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Right Col -->
                    <div class="col-span-4">
                        <!-- Education -->
                        <div class="space-y-4" style="margin-bottom: var(--section-spacing);">
                            <h2 class="text-xl font-bold uppercase mb-4 pb-2 border-b-2" style="font-family: var(--font-heading); border-color: var(--text-color);">${getText('edu')}</h2>
                            ${data.educations.map(edu => `
                                <div>
                                    <h3 class="font-bold text-lg leading-tight mb-1">${edu.school}</h3>
                                    <p class="italic text-gray-600 mb-2">${edu.degree}</p>
                                    <p class="text-sm font-bold text-gray-400 bg-gray-50 inline-block px-2 py-1">${edu.date}</p>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Skills -->
                        <div>
                            <h2 class="text-xl font-bold uppercase mb-4 pb-2 border-b-2" style="font-family: var(--font-heading); border-color: var(--text-color);">${getText('skills')}</h2>
                            <div class="flex flex-col gap-2">
                                ${data.skills.map(s => `<span class="flex items-center text-sm font-medium"><i class="fas fa-square text-[6px] mr-2 text-gray-400"></i> ${s}</span>`).join('')}
                            </div>
                        </div>

                        ${hasPortfolio ? `
                        <div style="margin-top: var(--section-spacing);">
                            <h2 class="text-xl font-bold uppercase mb-4 pb-2 border-b-2" style="font-family: var(--font-heading); border-color: var(--text-color);">${getText('portfolio')}</h2>
                            <div class="space-y-4">
                                ${generatePortfolioHTML('', 'font-bold text-lg', 'text-gray-600 italic mb-1 block text-sm', 'text-gray-600 text-sm leading-relaxed')}
                            </div>
                        </div>
                        ` : ''}

                    </div>

                    ${generateVideoHTML('', 'text-xl font-bold uppercase mb-4 pb-2 border-b-2 border-gray-900', 'margin-top: var(--section-spacing);')}

                </div>
            </div>
        `;
    }

    // --- TEMPLATE 4: CREATIVE BOLD ---
    else if (state.template === 'creative') {
        html = `
            <div class="h-full min-h-[297mm] bg-white relative overflow-hidden" style="color: var(--text-color); font-family: var(--font-body);">
                <!-- Design Element -->
                <div class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full translate-x-1/3 -translate-y-1/3 z-0" style="background-color: var(--primary-color); opacity: 0.1;"></div>
                
                <div class="relative z-10 h-full flex flex-col" style="padding: var(--page-margin);">
                    
                    <!-- Header -->
                    <div class="flex gap-8 items-center" style="margin-bottom: var(--section-spacing);">
                        ${data.photo ? `<div class="relative"><div class="absolute inset-0 rounded-2xl transform rotate-6" style="background-color: var(--primary-color);"></div><img src="${data.photo}" class="w-32 h-32 rounded-2xl object-cover shadow-lg relative bg-white z-10" onerror="this.style.display='none'"></div>` : ''}
                        <div>
                            <h1 class="text-5xl font-extrabold mb-2" style="color: var(--primary-color); font-family: var(--font-heading);">${data.name}</h1>
                            <div class="flex items-center gap-4">
                                <p class="text-xl font-bold px-3 py-1 rounded inline-block" style="background-color: var(--primary-color); color: white;">${data.job}</p>
                                <div class="h-px bg-gray-300 flex-1 w-20"></div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-10 flex-1">
                        <!-- Sidebar Info (Left) -->
                        <div class="col-span-4 flex flex-col" style="row-gap: var(--section-spacing);">
                            <div class="p-6 rounded-2xl shadow-xl" style="background-color: var(--sidebar-bg-color); color: var(--sidebar-text-color);">
                                <h3 class="text-sm font-bold uppercase mb-4 tracking-wider" style="color: var(--primary-color); opacity: 0.8;">Contact</h3>
                                <div class="space-y-4 text-sm">
                                    <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: var(--sidebar-text-color); color: var(--sidebar-bg-color); opacity: 0.2;"><i class="fas fa-envelope"></i></div> <span class="flex-1 break-all">${data.email}</span></div>
                                    <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: var(--sidebar-text-color); color: var(--sidebar-bg-color); opacity: 0.2;"><i class="fas fa-phone"></i></div> <a href="tel:${data.phone}" class="hover:underline">${data.phone}</a></div>
                                    <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: var(--sidebar-text-color); color: var(--sidebar-bg-color); opacity: 0.2;"><i class="fas fa-map-marker-alt"></i></div> <a href="${mapsUrl}" target="_blank" class="hover:underline">${data.address}</a></div>
                                </div>
                            </div>

                            <div>
                                <h3 class="text-lg font-bold mb-4 flex items-center gap-2" style="font-family: var(--font-heading);">
                                    <i class="fas fa-graduation-cap" style="color: var(--primary-color);"></i> ${getText('edu')}
                                </h3>
                                ${data.educations.map(edu => `
                                    <div class="bg-white border-l-4 p-4 shadow-sm mb-4" style="border-color: var(--primary-color);">
                                        <h3 class="font-bold">${edu.school}</h3>
                                        <p class="text-sm font-medium mb-1" style="color: var(--primary-color);">${edu.degree}</p>
                                        <p class="text-xs text-gray-400">${edu.date}</p>
                                    </div>
                                `).join('')}
                            </div>

                            <div>
                                <h3 class="text-lg font-bold mb-4 flex items-center gap-2" style="font-family: var(--font-heading);">
                                    <i class="fas fa-bolt" style="color: var(--primary-color);"></i> ${getText('skills')}
                                </h3>
                                <div class="flex flex-wrap gap-2">
                                    ${data.skills.map(s => `<span class="px-3 py-1 rounded-full text-xs font-bold border" style="background-color: var(--primary-color); color: white; border-color: var(--primary-color);">${s}</span>`).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Main Body (Right) -->
                        <div class="col-span-8 flex flex-col" style="row-gap: var(--section-spacing);">
                            <section>
                                <h2 class="text-2xl font-bold mb-4 pb-2 border-b border-gray-100" style="font-family: var(--font-heading);">${getText('summary')}</h2>
                                <p class="leading-relaxed text-lg" style="color: var(--text-color); opacity: 0.9;">${data.summary}</p>
                            </section>

                            <section>
                                <h2 class="text-2xl font-bold mb-6 pb-2 border-b border-gray-100" style="font-family: var(--font-heading);">${getText('exp')}</h2>
                                
                                <div class="space-y-8">
                                    ${data.experiences.map((exp, index) => `
                                        <div class="relative pl-8">
                                            <div class="absolute left-0 top-1 w-3 h-3 rounded-full ring-4" style="background-color: var(--primary-color); ring-color: var(--primary-color); opacity: 0.2;"></div>
                                            ${index < data.experiences.length - 1 ? `<div class="absolute left-[5px] top-4 bottom-[-20px] w-0.5 bg-gray-200"></div>` : ''}
                                            <h3 class="font-bold text-xl">${exp.role}</h3>
                                            <div class="flex items-center gap-3 text-sm mb-2">
                                                <span class="font-bold" style="color: var(--primary-color);">${exp.comp}</span>
                                                <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span class="text-gray-500 bg-gray-100 px-2 rounded">${exp.date}</span>
                                            </div>
                                            <p class="text-gray-600 leading-relaxed">${exp.desc}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>

                            ${hasPortfolio ? `
                            <section>
                                <h2 class="text-2xl font-bold mb-4 pb-2 border-b border-gray-100" style="font-family: var(--font-heading);">${getText('portfolio')}</h2>
                                <div class="space-y-6">
                                    ${generatePortfolioHTML('relative pl-8', 'font-bold text-xl', 'font-bold text-sm mb-2 block', 'leading-relaxed')}
                                </div>
                            </section>
                            ` : ''}

                        </div>

                        ${generateVideoHTML('', 'text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100', 'margin-top: var(--section-spacing);')}
                    </div>
                </div>
            </div>
        `;
    }

    // --- TEMPLATE 5: PROFESSIONAL (Green/Emerald, Clean Grid) ---
    else if (state.template === 'professional') {
        html = `
            <div class="h-full min-h-[297mm] bg-white" style="color: var(--text-color); font-family: var(--font-body);">
                <!-- Top Header -->
                <div class="text-white flex items-center gap-8" style="background-color: var(--primary-color); padding: calc(var(--page-margin) * 0.8);">
                    ${data.photo ? `<img src="${data.photo}" class="w-32 h-32 rounded-full object-cover border-4 bg-white shadow-md" style="border-color: white;" onerror="this.style.display='none'">` : ''}
                    <div class="flex-1">
                        <h1 class="text-4xl font-bold mb-1" style="font-family: var(--font-heading);">${data.name}</h1>
                        <p class="text-xl font-medium mb-4" style="opacity: 0.8;">${data.job}</p>
                        <div class="flex flex-wrap gap-4 text-sm text-emerald-50">
                            <span><i class="fas fa-envelope mr-1"></i> ${data.email}</span>
                            <a href="tel:${data.phone}" class="hover:underline"><i class="fas fa-phone mr-1"></i> ${data.phone}</a>
                            <a href="${mapsUrl}" target="_blank" class="hover:underline"><i class="fas fa-map-marker-alt mr-1"></i> ${data.address}</a>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-8" style="padding: var(--page-margin);">
                    <!-- Left Sidebar (Skills & Education) -->
                    <div class="col-span-4 flex flex-col border-r border-gray-200 pr-8" style="row-gap: var(--section-spacing);">
                        <section>
                            <h2 class="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 pb-1" style="color: var(--primary-color); border-color: var(--primary-color); opacity: 0.2; font-family: var(--font-heading);">${getText('edu')}</h2>
                            ${data.educations.map(edu => `
                                <div class="mb-4">
                                    <div class="font-bold">${edu.school}</div>
                                    <div class="text-sm font-semibold" style="color: var(--primary-color);">${edu.degree}</div>
                                    <div class="text-gray-500 text-xs mt-1">${edu.date}</div>
                                </div>
                            `).join('')}
                        </section>

                        <section>
                            <h2 class="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 pb-1" style="color: var(--primary-color); border-color: var(--primary-color); opacity: 0.2; font-family: var(--font-heading);">${getText('skills')}</h2>
                            <div class="space-y-2">
                                ${data.skills.map(s => `
                                    <div class="text-sm font-medium bg-gray-50 p-2 rounded border-l-4" style="border-color: var(--primary-color);">${s}</div>
                                `).join('')}
                            </div>
                        </section>
                    </div>

                    <!-- Right Main (Summary & Experience) -->
                    <div class="col-span-8 flex flex-col" style="row-gap: var(--section-spacing);">
                        <section>
                            <h2 class="text-xl font-bold mb-3 flex items-center" style="font-family: var(--font-heading);">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm" style="background-color: var(--primary-color); color: white; opacity: 0.2; color: var(--primary-color);"><i class="fas fa-user"></i></span>
                                ${getText('summary')}
                            </h2>
                            <p class="leading-relaxed" style="color: var(--text-color); opacity: 0.9;">${data.summary}</p>
                        </section>

                        <section>
                            <h2 class="text-xl font-bold mb-6 flex items-center" style="font-family: var(--font-heading);">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm" style="background-color: var(--primary-color); color: white; opacity: 0.2; color: var(--primary-color);"><i class="fas fa-briefcase"></i></span>
                                ${getText('exp')}
                            </h2>
                            ${data.experiences.map(exp => `
                                <div class="mb-8">
                                    <div class="flex justify-between items-baseline mb-1">
                                        <h3 class="font-bold text-lg">${exp.role}</h3>
                                        <span class="text-sm font-bold" style="color: var(--primary-color);">${exp.date}</span>
                                    </div>
                                    <div class="text-sm text-gray-500 font-semibold mb-2 uppercase tracking-wide">${exp.comp}</div>
                                    <p class="text-sm leading-relaxed" style="color: var(--text-color); opacity: 0.9;">${exp.desc}</p>
                                </div>
                            `).join('')}
                        </section>

                        ${hasPortfolio ? `
                        <section>
                            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm" style="background-color: var(--primary-color); color: white; opacity: 0.2; color: var(--primary-color);"><i class="fas fa-link"></i></span>
                                ${getText('portfolio')}
                            </h2>
                            ${generatePortfolioHTML('mb-6', 'font-bold text-lg', 'text-sm font-semibold mb-2 uppercase tracking-wide block', 'text-sm leading-relaxed')}
                        </section>
                        ` : ''}

                        ${videoEmbedUrl ? (() => {
                            const isGoogleDrive = videoEmbedUrl.includes('drive.google.com');
                            return `
                            <section>
                                <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span class="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm" style="background-color: var(--primary-color); color: white; opacity: 0.2; color: var(--primary-color);"><i class="fas fa-video"></i></span>
                                    ${getText('video')}
                                </h2>
                                <div class="video-container rounded-lg overflow-hidden shadow-md border">
                                    <iframe src="${videoEmbedUrl}" frameborder="0" allow="${isGoogleDrive ? 'autoplay; fullscreen' : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'}" allowfullscreen></iframe>
                                </div>
                            </section>
                            `;
                        })() : ''}

                    </div>

                </div>
            </div>
        `;
    }

    // --- TEMPLATE 6: ELEGANT (Gold/Black, Serif, Bordered) ---
    else if (state.template === 'elegant') {
        html = `
            <div class="p-4 h-full min-h-[297mm] bg-white flex items-stretch" style="color: var(--text-color); font-family: var(--font-body);">
                <!-- Border Container -->
                <div class="border-2 flex-1 relative flex flex-col items-center" style="border-color: var(--primary-color); padding: var(--page-margin);">
                    
                    <!-- Header -->
                    <div class="text-center w-full max-w-2xl border-b pb-8" style="border-color: var(--primary-color); margin-bottom: var(--section-spacing);">
                        <h1 class="text-4xl font-bold uppercase tracking-widest mb-2" style="font-family: var(--font-heading);">${data.name}</h1>
                        <p class="text-lg italic mb-4" style="color: var(--primary-color);">${data.job}</p>
                        <div class="flex justify-center gap-6 text-sm" style="color: var(--text-color); opacity: 0.8;">
                            <span>${data.email}</span>
                            <span>•</span>
                            <span>${data.phone}</span>
                            <span>•</span>
                            <a href="${mapsUrl}" target="_blank" class="hover:underline">${data.address}</a>
                        </div>
                    </div>

                    <div class="w-full grid grid-cols-2 gap-12">
                        <!-- Col 1 -->
                        <div>
                            <section style="margin-bottom: var(--section-spacing);">
                                <h2 class="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">${getText('summary')}</h2>
                                <p class="text-justify text-sm leading-relaxed" style="color: var(--text-color); opacity: 0.9;">${data.summary}</p>
                            </section>

                            <section style="margin-bottom: var(--section-spacing);">
                                <h2 class="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">${getText('exp')}</h2>
                                
                                ${data.experiences.map(exp => `
                                    <div class="mb-6 text-center">
                                        <h3 class="font-bold">${exp.role}</h3>
                                        <p class="text-xs uppercase mb-1" style="color: var(--primary-color);">${exp.comp}</p>
                                        <p class="text-xs text-gray-400 mb-2">${exp.date}</p>
                                        <p class="text-sm text-gray-600">${exp.desc}</p>
                                    </div>
                                `).join('')}
                            </section>
                        </div>

                        <!-- Col 2 -->
                        <div>
                            <section class="text-center" style="margin-bottom: var(--section-spacing);">
                                <h2 class="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">${getText('edu')}</h2>
                                ${data.educations.map(edu => `
                                    <div class="mb-2">
                                        <h3 class="font-bold">${edu.school}</h3>
                                        <p class="italic text-sm" style="color: var(--text-color); opacity: 0.9;">${edu.degree}</p>
                                        <p class="text-xs text-gray-400 mt-1">${edu.date}</p>
                                    </div>
                                `).join('')}
                            </section>

                            <section class="text-center">
                                <h2 class="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-4" style="font-family: var(--font-heading);">${getText('skills')}</h2>
                                <ul class="space-y-1 text-sm text-gray-700">
                                    ${data.skills.map(s => `<li>${s}</li>`).join('')}
                                </ul>
                            </section>

                            ${hasPortfolio ? `
                            <section class="text-center" style="margin-top: var(--section-spacing);">
                                <h2 class="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-4" style="font-family: var(--font-heading);">${getText('portfolio')}</h2>
                                <div class="space-y-4">
                                    ${generatePortfolioHTML('', 'font-bold', 'text-xs uppercase mb-1 block', 'text-sm')}
                                </div>
                            </section>
                            ` : ''}

                        </div>
                    </div>

                    ${generateVideoHTML('w-full max-w-2xl', 'text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-4', 'margin-top: var(--section-spacing);')}

                </div>
            </div>
        `;
    }

    // --- TEMPLATE 7: TECH SAVVY ---
    else if (state.template === 'tech') {
        html = `
            <div class="h-full min-h-[297mm]" style="background-color: var(--sidebar-bg-color); color: var(--sidebar-text-color); font-family: var(--font-body); padding: var(--page-margin);">
                <header class="flex items-center gap-8" style="margin-bottom: var(--section-spacing);">
                    ${data.photo ? `<img src="${data.photo}" class="w-28 h-28 rounded-full object-cover border-4" style="border-color: var(--sidebar-text-color);" onerror="this.style.display='none'">` : ''}
                    <div class="flex-1">
                        <h1 class="text-4xl font-bold mb-1" style="font-family: var(--font-heading); color: var(--sidebar-text-color);">${data.name}</h1>
                        <p class="text-lg font-mono" style="color: var(--primary-color);">${data.job}</p>
                    </div>
                </header>

                <div class="grid grid-cols-3 gap-10">
                    <div class="col-span-1 flex flex-col" style="row-gap: var(--section-spacing);">
                        <section>
                            <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="opacity: 0.6;">// ${getText('contact')}</h2>
                            <div class="space-y-3 text-sm">
                                <div class="flex items-center gap-3" style="opacity: 0.8;"><i class="fas fa-envelope w-4 text-center" style="opacity: 0.6;"></i><span class="break-all">${data.email}</span></div>
                                <div class="flex items-center gap-3" style="opacity: 0.8;"><i class="fas fa-phone w-4 text-center" style="opacity: 0.6;"></i><span>${data.phone}</span></div>
                                <div class="flex items-center gap-3"><i class="fas fa-map-marker-alt w-4 text-center text-gray-500"></i><a href="${mapsUrl}" target="_blank" class="hover:underline" style="color: var(--primary-color);">${data.address}</a></div>
                            </div>
                        </section>
                        <section>
                            <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="opacity: 0.6;">// ${getText('skills')}</h2>
                            <div class="flex flex-wrap gap-2">
                                ${data.skills.map(s => `<span class="text-xs font-mono px-2 py-1 rounded" style="background-color: rgba(255, 255, 255, 0.08); color: var(--primary-color);">${s}</span>`).join('')}
                            </div>
                        </section>
                        <section>
                            <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="opacity: 0.6;">// ${getText('edu')}</h2>
                            ${data.educations.map(edu => `
                                <div class="mb-3">
                                    <h3 class="font-bold" style="color: var(--sidebar-text-color);">${edu.school}</h3>
                                    <p class="text-sm" style="opacity: 0.8;">${edu.degree}</p>
                                    <p class="text-xs font-mono" style="opacity: 0.6;">${edu.date}</p>
                                </div>
                            `).join('')}
                        </section>
                    </div>
                    <div class="col-span-2 flex flex-col" style="row-gap: var(--section-spacing);">
                        <section>
                            <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="opacity: 0.6;">// ${getText('summary')}</h2>
                            <p class="leading-relaxed" style="opacity: 0.8;">${data.summary}</p>
                        </section>
                        <section>
                            <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="opacity: 0.6;">// ${getText('exp')}</h2>
                            <div class="space-y-6">
                            ${data.experiences.map(exp => `
                                <div>
                                    <div class="flex justify-between items-baseline">
                                        <h3 class="font-bold text-lg" style="font-family: var(--font-heading); color: var(--sidebar-text-color);">${exp.role}</h3>
                                        <span class="text-xs font-mono" style="opacity: 0.6;">${exp.date}</span>
                                    </div>
                                    <p class="font-semibold mb-2" style="color: var(--primary-color);">${exp.comp}</p>
                                    <p class="text-sm leading-relaxed" style="opacity: 0.8;">${exp.desc}</p>
                                </div>
                            `).join('')}
                            </div>
                        </section>
                        ${hasPortfolio ? `
                        <section>
                            <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="opacity: 0.6;">// ${getText('portfolio')}</h2>
                            <div class="space-y-6">
                                ${generatePortfolioHTML('', 'text-lg font-bold', 'text-sm mb-2 block', 'text-sm opacity-80')}
                            </div>
                        </section>
                        ` : ''}
                        ${generateVideoHTML('', 'text-sm font-bold uppercase text-gray-500 tracking-widest mb-4')}
                    </div>
                </div>
            </div>
        `;
    }

    // --- TEMPLATE 8: COMPACT INFO ---
    else if (state.template === 'compact') {
        html = `
            <div class="h-full min-h-[297mm] bg-white flex" style="color: var(--text-color); font-family: var(--font-body);">
                <div class="w-[65%]" style="padding: var(--page-margin);">
                    <header style="margin-bottom: var(--section-spacing);">
                        <h1 class="text-5xl font-extrabold mb-1" style="font-family: var(--font-heading);">${data.name}</h1>
                        <p class="text-xl font-semibold" style="color: var(--primary-color);">${data.job}</p>
                    </header>
                    <section style="margin-bottom: var(--section-spacing);">
                        <h2 class="font-bold border-b-2 inline-block pb-1 mb-3 uppercase tracking-wider text-sm" style="color: var(--primary-color); border-color: var(--primary-color);">${getText('summary')}</h2>
                        <p class="leading-relaxed" style="color: var(--text-color); opacity: 0.9;">${data.summary}</p>
                    </section>
                    <section>
                        <h2 class="font-bold border-b-2 inline-block pb-1 mb-4 uppercase tracking-wider text-sm" style="color: var(--primary-color); border-color: var(--primary-color);">${getText('exp')}</h2>
                        <div class="space-y-6">
                        ${data.experiences.map(exp => `
                            <div>
                                <h3 class="font-bold text-lg">${exp.role} <span class="text-gray-500 font-medium">at ${exp.comp}</span></h3>
                                <p class="text-xs text-gray-400 font-semibold uppercase mb-2">${exp.date}</p>
                                <p class="text-sm leading-relaxed" style="color: var(--text-color); opacity: 0.9;">${exp.desc}</p>
                            </div>
                        `).join('')}
                        </div>
                    </section>
                </div>
                <div class="w-[35%] border-l flex flex-col" style="background-color: var(--sidebar-bg-color); color: var(--sidebar-text-color); border-color: rgba(0,0,0,0.05); padding: var(--page-margin); row-gap: var(--section-spacing);">
                    ${data.photo ? `<img src="${data.photo}" class="w-full rounded-lg object-cover mb-6" onerror="this.style.display='none'">` : ''}
                    <section>
                        <h2 class="font-bold uppercase tracking-wider text-xs mb-3" style="opacity: 0.7;">${getText('contact')}</h2>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-start gap-2" style="opacity: 0.9;"><i class="fas fa-envelope mt-1" style="opacity: 0.7;"></i><span class="break-all">${data.email}</span></div>
                            <div class="flex items-start gap-2" style="opacity: 0.9;"><i class="fas fa-phone mt-1" style="opacity: 0.7;"></i><span>${data.phone}</span></div>
                            <div class="flex items-start gap-2"><i class="fas fa-map-marker-alt mt-1 text-gray-400"></i><a href="${mapsUrl}" target="_blank" class="hover:underline" style="color: var(--primary-color);">${data.address}</a></div>
                        </div>
                    </section>
                    <section>
                        <h2 class="font-bold text-gray-500 uppercase tracking-wider text-xs mb-3">${getText('skills')}</h2>
                        <div class="flex flex-wrap gap-2">
                            ${data.skills.map(s => `<span class="text-xs font-medium px-2.5 py-0.5 rounded-full" style="background-color: var(--primary-color); color: white;">${s}</span>`).join('')}
                        </div>
                    </section>
                    <section>
                        <h2 class="font-bold uppercase tracking-wider text-xs mb-3" style="opacity: 0.7;">${getText('edu')}</h2>
                        ${data.educations.map(edu => `
                            <div class="mb-3">
                                <h3 class="font-semibold text-sm">${edu.school}</h3>
                                <p class="text-xs" style="opacity: 0.8;">${edu.degree}</p>
                                <p class="text-xs" style="opacity: 0.6;">${edu.date}</p>
                            </div>
                        `).join('')}
                    </section>
                </div>
            </div>
        `;
    }

    // --- TEMPLATE 9: MONOCHROME ---
    else if (state.template === 'monochrome') {
        html = `
            <div class="h-full min-h-[297mm] bg-white" style="color: var(--text-color); font-family: var(--font-body); padding: var(--page-margin);">
                <header class="text-center" style="margin-bottom: var(--section-spacing);">
                    <h1 class="text-6xl font-black uppercase tracking-tighter mb-2" style="font-family: var(--font-heading);">${data.name}</h1>
                    <p class="text-lg font-medium tracking-widest" style="color: var(--text-color); opacity: 0.7;">${data.job}</p>
                </header>

                <div class="max-w-3xl mx-auto">
                    <section style="margin-bottom: var(--section-spacing);">
                        <h2 class="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4" style="font-family: var(--font-heading);">Profil</h2>
                        <p class="leading-relaxed" style="color: var(--text-color); opacity: 0.9;">${data.summary}</p>
                    </section>

                    <section style="margin-bottom: var(--section-spacing);">
                        <h2 class="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Pengalaman</h2>
                        <div class="space-y-6">
                        ${data.experiences.map(exp => `
                            <div class="grid grid-cols-4 gap-4">
                                <div class="col-span-1">
                                    <p class="font-semibold text-gray-800">${exp.comp}</p>
                                    <p class="text-xs text-gray-500">${exp.date}</p>
                                </div>
                                <div class="col-span-3">
                                    <h3 class="font-bold text-lg" style="font-family: var(--font-heading);">${exp.role}</h3>
                                    <p class="text-sm leading-relaxed" style="color: var(--text-color); opacity: 0.9;">${exp.desc}</p>
                                </div>
                            </div>
                        `).join('')}
                        </div>
                    </section>

                    <div class="grid grid-cols-2 gap-12 border-t border-gray-200 pt-8">
                        <section>
                            <h2 class="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Pendidikan</h2>
                            ${data.educations.map(edu => `
                                <div class="mb-3">
                                    <h3 class="font-semibold">${edu.school}</h3>
                                    <p class="text-sm text-gray-500">${edu.degree} • ${edu.date}</p>
                                </div>
                            `).join('')}
                        </section>
                        <section>
                            <h2 class="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Keahlian</h2>
                            <ul class="list-disc list-inside columns-2" style="color: var(--text-color); opacity: 0.9;">
                                ${data.skills.map(s => `<li>${s}</li>`).join('')}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        `;
    }

    preview.innerHTML = dynamicStyles + html;
}

// --- Dynamic Item Functions (Portfolio) ---
function addPortfolioItem() {
    const list = document.getElementById('portfolio-list');
    const newItem = document.createElement('div');
    newItem.className = 'portfolio-item bg-gray-50 p-3 rounded-lg border border-gray-200 relative group';
    newItem.innerHTML = `
        <button type="button" onclick="removeItem(this)" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100">
            <i class="fas fa-trash-alt text-xs"></i>
        </button>
        <div class="absolute -left-1 top-3 w-1 h-6 bg-gray-300 group-hover:bg-blue-400 rounded-r transition"></div>
        <input type="text" name="portfolio_name" placeholder="Nama Proyek" class="text-sm border-b bg-transparent focus:border-blue-500 outline-none py-1 font-semibold text-gray-800 w-full mb-2 pr-8">
        <input type="text" name="portfolio_url" placeholder="URL Proyek (opsional)" class="text-xs text-gray-500 mb-2 w-full bg-transparent outline-none">
        <textarea name="portfolio_desc" rows="2" placeholder="Deskripsi singkat proyek..." class="text-sm w-full bg-transparent border border-gray-200 rounded p-2 focus:bg-white focus:border-blue-500 outline-none"></textarea>
    `;
    list.appendChild(newItem);
}

// --- Dynamic Item Functions (Generic) ---
function addExperienceItem() {
    const list = document.getElementById('experience-list');
    const newItem = document.createElement('div');
    newItem.className = 'experience-item bg-gray-50 p-3 rounded-lg border border-gray-200 relative group';
    newItem.innerHTML = `
        <button type="button" onclick="removeItem(this)" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100"><i class="fas fa-trash-alt text-xs"></i></button>
        <div class="absolute -left-1 top-3 w-1 h-6 bg-gray-300 group-hover:bg-blue-400 rounded-r transition"></div>
        <div class="grid grid-cols-2 gap-2 mb-2">
            <input type="text" name="exp_role" placeholder="Posisi" class="text-sm border-b bg-transparent focus:border-blue-500 outline-none py-1 font-semibold text-gray-800 pr-8">
            <input type="text" name="exp_comp" placeholder="Perusahaan" class="text-sm border-b bg-transparent focus:border-blue-500 outline-none py-1 text-gray-600">
        </div>
        <input type="text" name="exp_date" placeholder="Tahun" class="text-xs text-gray-500 mb-2 w-full bg-transparent outline-none">
        <textarea name="exp_desc" rows="2" placeholder="Deskripsi pekerjaan..." class="text-sm w-full bg-transparent border border-gray-200 rounded p-2 focus:bg-white focus:border-blue-500 outline-none"></textarea>
    `;
    list.appendChild(newItem);
}

function addEducationItem() {
    const list = document.getElementById('education-list');
    const newItem = document.createElement('div');
    newItem.className = 'education-item bg-gray-50 p-3 rounded-lg border border-gray-200 relative group';
    newItem.innerHTML = `
        <button type="button" onclick="removeItem(this)" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100"><i class="fas fa-trash-alt text-xs"></i></button>
        <input type="text" name="edu_school" placeholder="Universitas" class="text-sm font-semibold w-full bg-transparent border-b border-dashed border-gray-300 mb-1 focus:border-blue-500 outline-none pr-8">
        <input type="text" name="edu_degree" placeholder="Jurusan" class="text-sm w-full bg-transparent mb-1 outline-none">
        <input type="text" name="edu_date" placeholder="Tahun" class="text-xs text-gray-500 w-full bg-transparent outline-none">
    `;
    list.appendChild(newItem);
}

function addDocumentItem() {
    const list = document.getElementById('document-list');
    const newItem = document.createElement('div');
    newItem.className = 'document-item bg-gray-50 p-3 rounded-lg border border-gray-200 relative group';
    newItem.innerHTML = `
        <button type="button" onclick="removeItem(this)" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100"><i class="fas fa-trash-alt text-xs"></i></button>
        <input type="text" name="doc_name" placeholder="Nama Dokumen" class="text-sm font-semibold w-full bg-transparent border-b border-dashed border-gray-300 mb-2 focus:border-blue-500 outline-none pr-8">
        <input type="text" name="doc_url" placeholder="URL Google Drive" class="text-xs text-gray-500 w-full bg-transparent outline-none">
    `;
    list.appendChild(newItem);
}

function removeItem(button) {
    button.parentElement.remove();
    renderCV();
}

// --- Map Modal Functions ---
let map = null;
let marker = null;

function openMapModal() {
    document.getElementById('map-modal').classList.remove('hidden');
    document.getElementById('map-modal').classList.add('flex');

    // Initialize map only once
    if (!map) {
        map = L.map('map-container').setView([-2.548926, 118.0148634], 5); // Center of Indonesia

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        marker = L.marker([-2.548926, 118.0148634], { draggable: true }).addTo(map);

        map.on('click', function(e) {
            marker.setLatLng(e.latlng);
        });

        // --- ADD SEARCH CONTROL ---
        const searchControl = new GeoSearch.GeoSearchControl({
            provider: new GeoSearch.OpenStreetMapProvider(),
            style: 'bar', // Menggunakan gaya bar pencarian
            showMarker: false, // Kita akan menggunakan marker kita sendiri
            autoClose: true, // Otomatis tutup hasil setelah dipilih
            searchLabel: 'Cari alamat...',
        });
        map.addControl(searchControl);

        // Pindahkan marker kita ke hasil pencarian
        map.on('geosearch/showlocation', function (result) {
            marker.setLatLng(result.location);
        });
    }
    
    // Invalidate size to fix rendering issues when modal is shown
    setTimeout(() => {
        map.invalidateSize();
        // Try to center on existing coordinates if they exist
        const addressInput = document.getElementById('address');
        const lat = addressInput.dataset.lat;
        const lng = addressInput.dataset.lng;
        if (lat && lng) {
            const existingLatLng = [parseFloat(lat), parseFloat(lng)];
            marker.setLatLng(existingLatLng);
            map.setView(existingLatLng, 13);
        }
    }, 10);
}

function closeMapModal() {
    document.getElementById('map-modal').classList.add('hidden');
    document.getElementById('map-modal').classList.remove('flex');
}

async function saveMapLocation() {
    const latlng = marker.getLatLng();
    const addressInput = document.getElementById('address');
    
    // Store coordinates in data attributes
    addressInput.dataset.lat = latlng.lat;
    addressInput.dataset.lng = latlng.lng;

    // Fetch human-readable address from Nominatim (Reverse Geocoding)
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data && data.display_name) {
            addressInput.value = data.display_name;
        } else {
            addressInput.value = `Lat: ${latlng.lat.toFixed(5)}, Lng: ${latlng.lng.toFixed(5)}`;
        }
    } catch (error) {
        console.error("Could not fetch address: ", error);
        addressInput.value = `Lat: ${latlng.lat.toFixed(5)}, Lng: ${latlng.lng.toFixed(5)}`;
    }

    closeMapModal();
    renderCV(); // Update the CV with the new address
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation tidak didukung oleh browser Anda.");
        return;
    }

    const btn = document.getElementById('get-location-btn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Mencari...`;

    const options = {
        enableHighAccuracy: true, // Meminta posisi paling akurat
        timeout: 10000,           // Batas waktu 10 detik
        maximumAge: 0             // Jangan gunakan posisi dari cache
    };

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const latlng = [lat, lng];

            console.log(`Akurasi: ${position.coords.accuracy} meter.`);

            map.setView(latlng, 16); // Zoom lebih dekat ke lokasi akurat
            marker.setLatLng(latlng);
            
            btn.disabled = false;
            btn.innerHTML = originalText;
        },
        (error) => {
            console.error("Error getting location: ", error);
            alert(`Tidak bisa mendapatkan lokasi: ${error.message}`);
            btn.disabled = false;
            btn.innerHTML = originalText;
        },
        options // Menambahkan opsi akurasi tinggi
    );
}

// --- Mobile View Toggle ---
function toggleMobileView(view) {
    if (state.mobileView === view) return;

    state.mobileView = view;
    const editorPanel = document.getElementById('editor-panel');
    const previewPanel = document.getElementById('preview-panel');
    const editorBtn = document.getElementById('btn-show-editor');
    const previewBtn = document.getElementById('btn-show-preview');

    if (view === 'editor') {
        editorPanel.classList.remove('hidden');
        editorPanel.classList.add('flex');
        previewPanel.classList.add('hidden');
        editorBtn.classList.add('bg-blue-100', 'text-blue-700');
        previewBtn.classList.remove('bg-blue-100', 'text-blue-700');
    } else { // preview
        previewPanel.classList.remove('hidden');
        previewPanel.classList.add('flex');
        editorPanel.classList.add('hidden');
        previewBtn.classList.add('bg-blue-100', 'text-blue-700');
        editorBtn.classList.remove('bg-blue-100', 'text-blue-700');
    }
}

// --- OCR Import Functions ---
function openImportModal() {
    document.getElementById('import-modal').classList.remove('hidden');
    document.getElementById('import-modal').classList.add('flex');
}

function closeImportModal() {
    document.getElementById('import-modal').classList.add('hidden');
    document.getElementById('import-modal').classList.remove('flex');
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const progressDiv = document.getElementById('import-progress');
    const progressBar = document.getElementById('import-progress-bar');
    const statusP = document.getElementById('import-status');
    const resultTextarea = document.getElementById('import-result');

    progressDiv.classList.remove('hidden');
    resultTextarea.value = '';
    statusP.textContent = 'Mempersiapkan gambar...';

    try {
        const worker = await Tesseract.createWorker({
            logger: m => {
                if (m.status === 'recognizing text') {
                    const progress = Math.round(m.progress * 100);
                    progressBar.style.width = `${progress}%`;
                    statusP.textContent = `Mengenali teks... (${progress}%)`;
                } else {
                    statusP.textContent = m.status.replace(/_/g, ' ');
                }
            }
        });

        await worker.loadLanguage('ind+eng'); // Load Indonesian and English
        await worker.initialize('ind+eng');
        const { data: { text } } = await worker.recognize(file);
        
        resultTextarea.value = text;
        statusP.textContent = 'Ekstraksi selesai. Silakan salin teks di bawah ini.';
        
        await worker.terminate();
    } catch (error) {
        console.error(error);
        statusP.textContent = 'Terjadi kesalahan saat memproses gambar.';
    } finally {
        // Hide progress bar after a delay
        setTimeout(() => progressDiv.classList.add('hidden'), 2000);
    }
}

// Initialize with default state
document.addEventListener('DOMContentLoaded', () => {
    setTemplate('modern'); 
    updateUILabels();

    // Add event listeners for the add buttons
    document.getElementById('add-portfolio-btn').addEventListener('click', addPortfolioItem);
    document.getElementById('add-experience-btn').addEventListener('click', addExperienceItem);
    document.getElementById('add-education-btn').addEventListener('click', addEducationItem);
    document.getElementById('add-document-btn').addEventListener('click', addDocumentItem);

    // Populate color presets
    const presetsContainer = document.getElementById('color-presets-container');
    colorPresets.forEach(preset => {
        const button = document.createElement('button');
        button.className = 'w-full h-10 rounded-md flex items-center justify-center gap-1 p-1 border-2 border-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all';
        button.title = preset.name;
        button.onclick = () => applyPreset(preset);
        button.innerHTML = `
            <span class="block w-1/3 h-full rounded-sm" style="background-color: ${preset.primary};"></span>
            <span class="block w-1/3 h-full rounded-sm" style="background-color: ${preset.sidebarBg};"></span>
            <span class="block w-1/3 h-full rounded-sm" style="background-color: ${preset.text};"></span>
        `;
        presetsContainer.appendChild(button);
    });

    // Design panel listeners
    document.getElementById('primary-color').addEventListener('input', (e) => {
        state.design.primaryColor = e.target.value;
        renderCV();
    });
    document.getElementById('text-color').addEventListener('input', (e) => {
        state.design.textColor = e.target.value;
        renderCV();
    });
    document.getElementById('sidebar-bg-color').addEventListener('input', (e) => {
        state.design.sidebarBgColor = e.target.value;
        renderCV();
    });
    document.getElementById('sidebar-text-color').addEventListener('input', (e) => {
        state.design.sidebarTextColor = e.target.value;
        renderCV();
    });
    document.getElementById('font-heading').addEventListener('change', (e) => {
        state.design.fontHeading = e.target.value;
        renderCV();
    });
    document.getElementById('font-body').addEventListener('change', (e) => {
        state.design.fontBody = e.target.value;
        renderCV();
    });

    // Typography listeners
    document.getElementById('font-scale').addEventListener('input', (e) => {
        const scale = parseFloat(e.target.value);
        state.design.fontScale = scale;
        document.getElementById('font-scale-value').textContent = `${Math.round(scale * 100)}%`;
        renderCV();
    });
    document.getElementById('line-height').addEventListener('input', (e) => {
        const height = parseFloat(e.target.value);
        state.design.lineHeight = height;
        document.getElementById('line-height-value').textContent = height.toFixed(1);
        renderCV();
    });

    // Layout listeners
    document.getElementById('page-margin').addEventListener('input', (e) => {
        const margin = parseFloat(e.target.value);
        state.design.pageMargin = margin;
        document.getElementById('page-margin-value').textContent = `${margin.toFixed(2)}rem`;
        renderCV();
    });
    document.getElementById('section-spacing').addEventListener('input', (e) => {
        const spacing = parseFloat(e.target.value);
        state.design.sectionSpacing = spacing;
        document.getElementById('section-spacing-value').textContent = `${spacing.toFixed(2)}rem`;
        renderCV();
    });

    // Add event listener for image uploader
    document.getElementById('image-uploader').addEventListener('change', handleImageUpload);

    // Live photo preview in editor
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photo-preview');

    photoInput.addEventListener('input', () => {
        // Update the editor's preview image source with the new URL
        photoPreview.src = photoInput.value || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'; // Fallback to a default if empty
    });
});