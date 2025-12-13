// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            // Toggle visibility and animation classes
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
                setTimeout(() => { // Allow display property to apply before transitioning
                    menu.classList.remove('opacity-0', '-translate-y-4');
                }, 10);
            } else {
                menu.classList.add('opacity-0', '-translate-y-4');
                setTimeout(() => { // Wait for transition to finish before hiding
                    menu.classList.add('hidden');
                }, 300);
            }
        });

        // Close menu when a link is clicked
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                btn.click(); // Simulate a click on the menu button to close it
            });
        });
    }

    // Navbar style on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('shadow-md');
            } else {
                navbar.classList.remove('shadow-md');
            }
        });
    }

    // --- Hero Section Animation on Page Load ---
    const heroElements = document.querySelectorAll('.hero-anim');
    heroElements.forEach((el, index) => {
        // Stagger the animation start time
        setTimeout(() => {
            el.classList.remove('opacity-0', 'translate-y-5');
        }, 200 + (index * 150)); // Start after 200ms, with 150ms between elements
    });

    // --- Dynamic Content Loading ---
    async function loadPartners() {
        const grid = document.getElementById('clients-logo-grid');
        if (!grid) return;

        try {
            const response = await fetch('http://localhost:3000/api/partners');
            if (!response.ok) throw new Error('Failed to fetch partners');
            
            const partners = await response.json();
            
            partners.forEach(partner => {
                const logoDiv = document.createElement('div');
                logoDiv.className = 'client-logo opacity-0 transform translate-y-8 transition-all duration-700 ease-out';
                logoDiv.innerHTML = `<img src="${partner.logo_url}" alt="${partner.name}" class="h-10 mx-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition">`;
                grid.appendChild(logoDiv);
            });
        } catch (error) {
            console.error('Error loading partners:', error);
            grid.innerHTML = `<p class="col-span-full text-center text-slate-500">Could not load partner logos.</p>`;
        }
    }

    async function loadProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        const themeClasses = {
            blue: { bg: 'bg-blue-100', text: 'text-primary' },
            purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
            orange: { bg: 'bg-orange-100', text: 'text-orange-500' },
            green: { bg: 'bg-green-100', text: 'text-green-600' },
        };

        try {
            const response = await fetch('http://localhost:3000/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const products = await response.json();
            
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card group transition-all duration-700 ease-out opacity-0 transform translate-y-8';

                if (product.is_featured) {
                    card.classList.add('bg-gradient-to-br', 'from-blue-600', 'to-blue-700', 'rounded-2xl', 'p-8', 'shadow-xl', 'text-white', 'transform', 'md:-translate-y-2');
                    card.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm text-white rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                                <i class="${product.icon_class}"></i>
                            </div>
                            ${product.badge_text ? `<span class="bg-white text-blue-700 text-xs font-bold px-2 py-1 rounded">${product.badge_text}</span>` : ''}
                        </div>
                        <h4 class="text-xl font-bold mb-3">${product.name}</h4>
                        <p class="text-blue-100 mb-6 text-sm leading-relaxed">${product.description}</p>
                        ${product.live_url ? `<a href="${product.live_url}" target="_blank" class="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition">View Live Demo <i class="fas fa-external-link-alt"></i></a>` : ''}
                    `;
                } else {
                    const theme = themeClasses[product.theme] || themeClasses.blue;
                    card.classList.add('bg-slate-50', 'rounded-2xl', 'p-8', 'hover:bg-white', 'hover:shadow-xl', 'border', 'border-transparent', 'hover:border-blue-100');
                    card.innerHTML = `
                        <div class="w-14 h-14 ${theme.bg} ${theme.text} rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                            <i class="${product.icon_class}"></i>
                        </div>
                        <h4 class="text-xl font-bold text-slate-900 mb-3">${product.name}</h4>
                        <p class="text-slate-500 mb-4 text-sm leading-relaxed">${product.description}</p>
                    `;

                    if (product.category) {
                        const categoryEl = product.category_url
                            ? `<a href="${product.category_url}" target="_blank" class="${theme.text} font-semibold text-sm flex items-center hover:underline">${product.category} <i class="fas fa-external-link-alt text-xs ml-1.5"></i></a>`
                            : `<span class="${theme.text} font-semibold text-sm flex items-center">${product.category}</span>`;
                        card.innerHTML += categoryEl;
                    }
                }
                grid.prepend(card);
            });
        } catch (error) {
            console.error('Error loading products:', error);
            grid.innerHTML = `<p class="col-span-full text-center text-slate-500">Could not load products.</p>`;
        }
    }

    async function loadTestimonials() {
        const wrapper = document.querySelector('.testimonial-slider .swiper-wrapper');
        if (!wrapper) return;

        try {
            const response = await fetch('http://localhost:3000/api/testimonials');
            if (!response.ok) throw new Error('Failed to fetch testimonials');
            const testimonials = await response.json();

            if (testimonials.length === 0) {
                wrapper.innerHTML = `<p class="text-center w-full">No testimonials available at the moment.</p>`;
                return;
            }

            testimonials.forEach(testimonial => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide text-center';
                slide.innerHTML = `
                    <div class="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                        <i class="fas fa-quote-left text-primary text-3xl mb-4"></i>
                        <p class="text-slate-600 italic mb-6">"${testimonial.quote}"</p>
                        <img src="${testimonial.image_url}" alt="${testimonial.client_name}" class="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-primary p-1 object-cover">
                        <h4 class="font-bold text-slate-800">${testimonial.client_name}</h4>
                        <p class="text-sm text-slate-400">${testimonial.client_title}</p>
                    </div>
                `;
                wrapper.appendChild(slide);
            });
        } catch (error) {
            console.error('Error loading testimonials:', error);
            wrapper.innerHTML = `<p class="text-center w-full text-slate-500">Could not load testimonials.</p>`;
        }
    }

    // Load dynamic content and then set up animations
    Promise.all([loadPartners(), loadProducts(), loadTestimonials()]).then(() => {
    // --- Scroll Animation Logic ---
    const animationObserverOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Use a data attribute for delay if it exists, otherwise use index
                const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : index * 150;

                setTimeout(() => {
                    entry.target.classList.remove('opacity-0', 'translate-y-8', '-translate-x-8', 'translate-x-8');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, animationObserverOptions);

    // Observe Product Cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => animationObserver.observe(card));

    // Observe Section Titles
    const sectionTitles = document.querySelectorAll('.section-title-anim');
    sectionTitles.forEach(title => animationObserver.observe(title));

    // Observe Client Logos
    const clientLogos = document.querySelectorAll('.client-logo');
    clientLogos.forEach(logo => animationObserver.observe(logo));

    // Observe About Section Elements
    const aboutLeft = document.querySelector('.about-anim-left');
    if (aboutLeft) {
        animationObserver.observe(aboutLeft);
    }
    const aboutRight = document.querySelector('.about-anim-right');
    if (aboutRight) {
        aboutRight.dataset.delay = 200; // Add a slight delay to the right side
        animationObserver.observe(aboutRight);
    }
    });

    // --- Testimonial Slider Initialization ---
    const swiper = new Swiper('.testimonial-slider', {
        // Optional parameters
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = question.classList.contains('open');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.querySelector('.faq-question').classList.remove('open');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If it wasn't already open, open it
            if (!isOpen) {
                question.classList.add('open');
                // Set max-height to the content's scroll height for smooth transition
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- Scroll to Top Button ---
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

    if (scrollToTopBtn) {
        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show after 300px of scrolling
                scrollToTopBtn.classList.remove('opacity-0', 'invisible');
            } else {
                scrollToTopBtn.classList.add('opacity-0', 'invisible');
            }
        });

        // Smooth scroll to top on click
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});