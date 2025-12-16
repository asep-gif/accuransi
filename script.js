// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Dark Mode Toggle Logic ---
    const htmlElement = document.documentElement;
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const mobileDarkModeToggle = document.getElementById('mobile-dark-mode-toggle');

    if (darkModeToggle && mobileDarkModeToggle) {
        const desktopMoonIcon = darkModeToggle.querySelector('.fa-moon');
        const desktopSunIcon = darkModeToggle.querySelector('.fa-sun');
        const mobileMoonIcon = mobileDarkModeToggle.querySelector('.fa-moon');
        const mobileSunIcon = mobileDarkModeToggle.querySelector('.fa-sun');

        const applyTheme = (theme) => {
            if (theme === 'dark') {
                htmlElement.classList.add('dark');
                desktopMoonIcon.classList.add('hidden');
                desktopSunIcon.classList.remove('hidden');
                mobileMoonIcon.classList.add('hidden');
                mobileSunIcon.classList.remove('hidden');
            } else {
                htmlElement.classList.remove('dark');
                desktopMoonIcon.classList.remove('hidden');
                desktopSunIcon.classList.add('hidden');
                mobileMoonIcon.classList.remove('hidden');
                mobileSunIcon.classList.add('hidden');
            }
        };

        const toggleTheme = () => {
            const currentTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        };

        darkModeToggle.addEventListener('click', toggleTheme);
        mobileDarkModeToggle.addEventListener('click', toggleTheme);

        // Apply theme on initial load
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);
    }

    // --- Bilingual Logic ---
    const translations = {
        en: {
            nav_home: "Home",
            nav_products: "Products",
            nav_about: "About",
            nav_testimonials: "Testimonials",
            nav_contact: "Contact Us",
            language: "Language",
            dark_mode: "Dark Mode",
            hero_badge: "Software Development Expert",
            hero_title: "Build The Future With <br><span class='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary'>Accuransi Systems</span>",
            hero_subtitle: "We provide comprehensive digital solutions for cooperatives, hotels, and enterprise management. Secure, fast, and reliable.",
            hero_button: "Explore Our Apps",
            products_tagline: "Our Portfolio",
            products_title: "Proven Solutions for Industries",
            product_hms_desc: "An integrated system to manage room bookings, guest services, and hotel operations seamlessly.",
            product_koperasi_desc: "A digital solution for managing savings and loans, membership, and financial reporting for modern cooperatives.",
            product_absensi_desc: "An online attendance application with face recognition and GPS to accurately monitor employee attendance.",
            product_reporting_desc: "A powerful dashboard for data visualization and business intelligence to monitor your performance in real-time.",
            product_journal_desc: "A comprehensive accounting and financial journaling application to track transactions and generate reports.",
            product_kpi_desc: "Manage employee training and track Key Performance Indicators for comprehensive performance evaluation.",
            coming_soon_title: "More Coming Soon",
            coming_soon_desc: "We are constantly innovating.",
            about_tagline: "About Accuransi",
            about_title: "Simplifying Complexity Through Code",
            about_desc: "Accuransi is a dedicated software development team focused on creating tailored solutions for various industries. From cooperative financial systems to complex hospital management, we deliver code that works.",
            about_feature1: "Modern Technology Stack",
            about_feature2: "User-Friendly Interface",
            about_feature3: "Reliable Support",
            testimonials_tagline: "Testimonials",
            testimonials_title: "What Our Clients Say",
            testimonial1_quote: '"The system from Accuransi has greatly helped our hospital operations. The implementation was fast and the support team is very responsive."',
            testimonial1_role: "IT Manager, Sehat Selalu Hospital",
            testimonial2_quote: '"The cooperative application they developed has truly changed the way we work. Everything has become more transparent and efficient."',
            testimonial2_role: "Chairman, Maju Bersama Cooperative",
            testimonial3_quote: '"With Accuransi Attendance, monitoring employee attendance at various project locations has become very easy and accurate. Highly recommended!"',
            testimonial3_role: "HRD, Konstruksi Jaya Corp.",
            faq_tagline: "FAQ",
            faq_title: "Frequently Asked Questions",
            faq1_question: "What technologies do you use?",
            faq1_answer: "We utilize a modern technology stack tailored to each project, including frameworks like Laravel and Vue.js, and robust database solutions to ensure scalability and security.",
            faq2_question: "How long does a project typically take?",
            faq2_answer: "Project timelines vary based on complexity. A standard HMS implementation might take 3-6 months, while smaller custom modules can be delivered in a few weeks. We provide a detailed timeline after the initial consultation.",
            cta_title: "Ready to digitalize your business?",
            cta_subtitle: "Let's discuss how Accuransi can build the perfect solution for your specific needs.",
            cta_whatsapp: "Contact us via WhatsApp for a fast response.",
            footer_desc: "Building robust software for a better future. Specialized in management systems and digital transformation.",
            footer_location: "West Bandung Regency, Indonesia",
            footer_copyright: "© 2026 Accuransi. All rights reserved."
        },
        id: {
            nav_home: "Beranda",
            nav_products: "Produk",
            nav_about: "Tentang",
            nav_testimonials: "Testimoni",
            nav_contact: "Hubungi Kami",
            language: "Bahasa",
            dark_mode: "Mode Gelap",
            hero_badge: "Pakar Pengembangan Perangkat Lunak",
            hero_title: "Bangun Masa Depan Dengan <br><span class='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary'>Sistem Accuransi</span>",
            hero_subtitle: "Kami menyediakan solusi digital komprehensif untuk manajemen koperasi, hotel, dan perusahaan. Aman, cepat, dan andal.",
            hero_button: "Jelajahi Aplikasi Kami",
            products_tagline: "Portofolio Kami",
            products_title: "Solusi Terbukti untuk Industri",
            product_hms_desc: "Sistem terintegrasi untuk mengelola pemesanan kamar, layanan tamu, dan operasional hotel dengan lancar.",
            product_koperasi_desc: "Solusi digital untuk mengelola simpan pinjam, keanggotaan, dan pelaporan keuangan untuk koperasi modern.",
            product_absensi_desc: "Aplikasi absensi online dengan pengenalan wajah dan GPS untuk memantau kehadiran karyawan secara akurat.",
            product_reporting_desc: "Dasbor canggih untuk visualisasi data dan intelijen bisnis untuk memantau kinerja Anda secara real-time.",
            product_journal_desc: "Aplikasi akuntansi dan jurnal keuangan yang komprehensif untuk melacak transaksi dan menghasilkan laporan.",
            product_kpi_desc: "Mengelola pelatihan karyawan dan melacak Indikator Kinerja Utama untuk evaluasi kinerja yang komprehensif.",
            coming_soon_title: "Segera Hadir Lainnya",
            coming_soon_desc: "Kami terus berinovasi.",
            about_tagline: "Tentang Accuransi",
            about_title: "Menyederhanakan Kompleksitas Melalui Kode",
            about_desc: "Accuransi adalah tim pengembang perangkat lunak yang berdedikasi untuk menciptakan solusi yang disesuaikan untuk berbagai industri. Dari sistem keuangan koperasi hingga manajemen rumah sakit yang kompleks, kami memberikan kode yang berfungsi.",
            about_feature1: "Tumpukan Teknologi Modern",
            about_feature2: "Antarmuka yang Ramah Pengguna",
            about_feature3: "Dukungan yang Andal",
            testimonials_tagline: "Testimoni",
            testimonials_title: "Apa Kata Klien Kami",
            testimonial1_quote: '"Sistem dari Accuransi sangat membantu operasional rumah sakit kami. Implementasinya cepat dan tim pendukungnya sangat responsif."',
            testimonial1_role: "Manajer TI, RS Sehat Selalu",
            testimonial2_quote: '"Aplikasi koperasi yang mereka kembangkan benar-benar mengubah cara kami bekerja. Semuanya menjadi lebih transparan dan efisien."',
            testimonial2_role: "Ketua, Koperasi Maju Bersama",
            testimonial3_quote: '"Dengan Absensi Accuransi, memantau kehadiran karyawan di berbagai lokasi proyek menjadi sangat mudah dan akurat. Sangat direkomendasikan!"',
            testimonial3_role: "HRD, PT Konstruksi Jaya",
            faq_tagline: "FAQ",
            faq_title: "Pertanyaan yang Sering Diajukan",
            faq1_question: "Teknologi apa yang Anda gunakan?",
            faq1_answer: "Kami menggunakan tumpukan teknologi modern yang disesuaikan untuk setiap proyek, termasuk kerangka kerja seperti Laravel dan Vue.js, dan solusi basis data yang kuat untuk memastikan skalabilitas dan keamanan.",
            faq2_question: "Berapa lama biasanya sebuah proyek berlangsung?",
            faq2_answer: "Jangka waktu proyek bervariasi berdasarkan kompleksitas. Implementasi HMS standar mungkin memakan waktu 3-6 bulan, sementara modul kustom yang lebih kecil dapat dikirim dalam beberapa minggu. Kami memberikan jadwal terperinci setelah konsultasi awal.",
            cta_title: "Siap mendigitalkan bisnis Anda?",
            cta_subtitle: "Mari diskusikan bagaimana Accuransi dapat membangun solusi yang sempurna untuk kebutuhan spesifik Anda.",
            cta_whatsapp: "Hubungi kami melalui WhatsApp untuk respons cepat.",
            footer_desc: "Membangun perangkat lunak yang tangguh untuk masa depan yang lebih baik. Spesialisasi dalam sistem manajemen dan transformasi digital.",
            footer_location: "Kabupaten Bandung Barat, Indonesia",
            footer_copyright: "© 2026 Accuransi. Hak cipta dilindungi."
        }
    };

    const languages = ['id', 'en'];
    const langToggleButtons = document.querySelectorAll('.lang-toggle-btn');

    const setLanguage = (lang) => {
        htmlElement.lang = lang;
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        localStorage.setItem('language', lang);
    };

    const toggleLanguage = () => {
        const currentLang = localStorage.getItem('language') || 'id';
        const nextLangIndex = (languages.indexOf(currentLang) + 1) % languages.length;
        const nextLang = languages[nextLangIndex];
        setLanguage(nextLang);
    };

    langToggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            toggleLanguage();
        });
    });

    // Apply language on initial load
    const savedLang = localStorage.getItem('language') || 'id'; // Default to Indonesian
    setLanguage(savedLang);

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

    // --- Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});