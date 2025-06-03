// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled', 'shadow-md', 'bg-white/90', 'backdrop-blur-sm');
    } else {
        navbar.classList.remove('nav-scrolled', 'shadow-md', 'bg-white/90', 'backdrop-blur-sm');
    }
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('.card-icon').classList.add('scale-110', 'rotate-3');
        this.querySelector('.card-content').classList.add('translate-y-[-5px]');
    });

    card.addEventListener('mouseleave', function() {
        this.querySelector('.card-icon').classList.remove('scale-110', 'rotate-3');
        this.querySelector('.card-content').classList.remove('translate-y-[-5px]');
    });
});

// Counter animation for statistics
const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Initialize counters when they come into view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            animateValue(counter, 0, target, 2000);
            observer.unobserve(counter);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-counter').forEach(counter => {
    observer.observe(counter);
});

// Form validation and submission handling
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Add loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        `;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4';
            successMessage.innerHTML = 'Form submitted successfully!';
            form.prepend(successMessage);
            
            // Reset form
            form.reset();
        } catch (error) {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4';
            errorMessage.innerHTML = 'An error occurred. Please try again.';
            form.prepend(errorMessage);
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
const mobileMenu = document.querySelector('#mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
    });
}

// Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.style.opacity = '0';
        img.addEventListener('load', () => {
            img.style.transition = 'opacity 0.5s ease-in-out';
            img.style.opacity = '1';
        });
    });
});

// Theme toggle (if dark mode is supported)
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        });
    }
}

// Tooltip initialization
const tooltips = document.querySelectorAll('[data-tooltip]');
tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', (e) => {
        const tooltipText = e.target.getAttribute('data-tooltip');
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'absolute bg-gray-900 text-white px-2 py-1 rounded text-sm -mt-8 -ml-2 opacity-0 transition-opacity duration-200';
        tooltipEl.textContent = tooltipText;
        e.target.appendChild(tooltipEl);
        setTimeout(() => tooltipEl.classList.add('opacity-100'), 50);
    });

    tooltip.addEventListener('mouseleave', (e) => {
        const tooltipEl = e.target.querySelector('div');
        if (tooltipEl) {
            tooltipEl.classList.remove('opacity-100');
            setTimeout(() => tooltipEl.remove(), 200);
        }
    });
});

// Remove hover animations from Security & Auditing section
document.addEventListener('DOMContentLoaded', () => {
    // Remove hover-related classes
    const securitySection = document.querySelector('.security-section');
    if (securitySection) {
        const elements = securitySection.querySelectorAll('[class*="hover-"], [class*="transform-"]');
        elements.forEach(element => {
            const classList = element.className.split(' ');
            element.className = classList
                .filter(cls => !cls.includes('hover-') && !cls.includes('transform-'))
                .join(' ');
        });

        // Remove transition styles
        const style = document.createElement('style');
        style.textContent = `
            .security-section * {
                transition: none !important;
                transform: none !important;
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }
});

// Remove FAQ animations
document.addEventListener('DOMContentLoaded', () => {
    // Remove animation classes from FAQ section
    const faqSection = document.querySelector('.faqs-section');
    if (faqSection) {
        // Remove animation classes from titles
        const titles = faqSection.querySelectorAll('.title-animation-line');
        titles.forEach(title => {
            title.classList.remove('title-animation-line');
            title.style.opacity = '1';
            title.style.visibility = 'visible';
            title.style.transform = 'none';
        });

        // Remove animation from words and lines
        const animatedElements = faqSection.querySelectorAll('.word, .line');
        animatedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.transform = 'none';
            element.style.transition = 'none';
        });

        // Add static styles
        const style = document.createElement('style');
        style.textContent = `
            .faqs-section * {
                transition: none !important;
                transform: none !important;
                animation: none !important;
            }
            .faqs-section .title,
            .faqs-section .word,
            .faqs-section .line {
                opacity: 1 !important;
                visibility: visible !important;
                transform: none !important;
                display: inline-block !important;
            }
            .faqs-section .accordion-card {
                transition: none !important;
            }
            .faqs-section .toggle-icon {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);

        // Make content immediately visible
        const contents = faqSection.querySelectorAll('.accordion-content');
        contents.forEach(content => {
            content.style.display = 'block';
            content.style.height = 'auto';
            content.style.overflow = 'visible';
        });
    }
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize any global UI handlers here
    
    // Handle mobile menu toggle
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const menuItemsArea = document.querySelector('.menu-items-area');
    
    if (menuToggleBtn && menuItemsArea) {
        menuToggleBtn.addEventListener('click', () => {
            menuItemsArea.classList.toggle('active');
            menuToggleBtn.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuItemsArea?.contains(e.target) && !menuToggleBtn?.contains(e.target)) {
            menuItemsArea?.classList.remove('active');
            menuToggleBtn?.classList.remove('active');
        }
    });
}); 