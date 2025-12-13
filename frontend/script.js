// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            // Toggle visibility and animation classes
            menu.classList.toggle('hidden');
            // The opacity and transform are now handled by Tailwind's peer-checked state or similar,
            // or simply by adding/removing classes that have transitions.
            // For simplicity, we can just toggle the final state classes.
            menu.classList.toggle('opacity-0');
            menu.classList.toggle('-translate-y-4');
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

    // --- Scroll Animation Logic ---
    const animationObserverOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Use inline style for delay if it exists, otherwise use a default
                const delay = entry.target.style.animationDelay ? parseInt(entry.target.style.animationDelay) : 0;

                setTimeout(() => {
                    entry.target.classList.remove('opacity-0', 'translate-y-8', '-translate-x-8', 'translate-x-8', 'translate-y-4');
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
    const clientLogos = document.querySelectorAll('.client-logo-anim');
    clientLogos.forEach(logo => animationObserver.observe(logo));

    // Observe About Section Elements
    const aboutLeft = document.querySelector('.about-anim-left');
    if (aboutLeft) {
        animationObserver.observe(aboutLeft);
    }
    const aboutRight = document.querySelector('.about-anim-right');
    if (aboutRight) {
        aboutRight.style.animationDelay = '200ms'; // Add a slight delay to the right side
        animationObserver.observe(aboutRight);
    }

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