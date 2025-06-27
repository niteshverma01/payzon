// Router class to handle client-side routing
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = window.location.pathname;
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname);
        });

        // Intercept all link clicks for routing
        document.addEventListener('click', (e) => {
            if (e.target.matches('a') && e.target.href.startsWith(window.location.origin)) {
                e.preventDefault();
                const path = new URL(e.target.href).pathname;
                this.navigate(path, true);
            }
        });

        // Handle initial route after DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.navigate(this.currentPath);
        });
    }

    async navigate(path, addToHistory = false) {
        // Update browser history
        if (addToHistory) {
            window.history.pushState({}, '', path);
        }

        this.currentPath = path;

        // Special handling for root path
        if (path === '/') {
            // Don't reload the page if we're already on the homepage
            if (!addToHistory) return;
            // Just update the active state for navigation
            this.updateNavigation();
            return;
        }

        // Find the matching route
        const route = this.routes[path] || this.routes['404'];

        try {
            // If route is a function, execute it
            if (typeof route === 'function') {
                const content = await route();
                // Extract only the content inside the #root div
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                const rootContent = tempDiv.querySelector('#root')?.innerHTML || content;
                document.getElementById('root').innerHTML = rootContent;
            } else if (typeof route === 'string') {
                // If route is a string (HTML content)
                document.getElementById('root').innerHTML = route;
            }

            // Update active states in navigation
            this.updateNavigation();
        } catch (error) {
            console.error('Error loading route:', error);
            // Show a user-friendly error message
            document.getElementById('root').innerHTML = `
                <div class="text-center py-10">
                    <h2 class="text-2xl font-bold text-red-600">Oops! Something went wrong</h2>
                    <p class="mt-2 text-gray-600">Please try refreshing the page</p>
                </div>
            `;
        }
    }

    updateNavigation() {
        // Remove all active classes
        document.querySelectorAll('.nav-menu-items a').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current route link
        const currentLink = document.querySelector(`a[href="${this.currentPath}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }
}

// Function to load HTML content from a file
async function loadHTML(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error('Error loading HTML:', error);
        return `
            <div class="text-center py-10">
                <h2 class="text-2xl font-bold text-red-600">Page Not Found</h2>
                <p class="mt-2 text-gray-600">The page you're looking for doesn't exist</p>
                <a href="/" class="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go Home</a>
            </div>
        `;
    }
}

// Initialize router with routes
const router = new Router({
    '/': () => null, // Special handling for homepage
    '/product': async () => await loadHTML('/product.html'),
    '/services': () => `
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-4xl font-bold mb-6">Our Services</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Add your services content here -->
            </div>
        </div>
    `,
    '/contact': () => `
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-4xl font-bold mb-6">Contact Us</h1>
            <div class="max-w-lg mx-auto">
                <!-- Add your contact form here -->
            </div>
        </div>
    `,
    '/digital-marketing': async () => await loadHTML('/digital-marketing.html'),
    '404': () => `
        <div class="text-center py-10">
            <h2 class="text-2xl font-bold text-red-600">Page Not Found</h2>
            <p class="mt-2 text-gray-600">The page you're looking for doesn't exist</p>
            <a href="/" class="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go Home</a>
        </div>
    `
});

// Export router for use in other files
window.router = router; 