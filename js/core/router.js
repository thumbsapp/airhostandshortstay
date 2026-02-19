// js/core/router.js
// ROUTER.JS – Simple SPA-style router (orchestrates page navigation and history)

window.AHSS = window.AHSS || {};

(function() {
    // Router instance
    window.AHSS.router = {
        routes: [],
        currentPath: '',
        
        // Register a route: pattern (string or regex) and handler
        addRoute: function(pattern, handler) {
            this.routes.push({ pattern, handler });
        },
        
        // Navigate to a new path (updates URL and calls handlers)
        navigate: function(path, replace = false) {
            if (path === this.currentPath) return;
            
            if (replace) {
                history.replaceState(null, '', path);
            } else {
                history.pushState(null, '', path);
            }
            this.handlePath(path);
        },
        
        // Handle the current path (called on load and popstate)
        handlePath: function(path = window.location.pathname) {
            path = path.replace(window.location.origin, '');
            this.currentPath = path;
            
            // Find matching route
            for (let route of this.routes) {
                if (typeof route.pattern === 'string' && route.pattern === path) {
                    route.handler(path);
                    return;
                } else if (route.pattern instanceof RegExp && route.pattern.test(path)) {
                    const matches = path.match(route.pattern);
                    route.handler(path, matches);
                    return;
                }
            }
            
            // Default route (home)
            if (path === '/' || path === '/index.html') {
                // already handled by home route if registered
            } else {
                console.warn('No route matched for', path);
            }
        },
        
        // Initialize router: listen to popstate and handle initial load
        init: function() {
            window.addEventListener('popstate', (e) => {
                this.handlePath();
            });
            
            // Intercept link clicks for client-side navigation (optional)
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (!link) return;
                const href = link.getAttribute('href');
                if (!href || href.startsWith('http') || href.startsWith('#')) return;
                e.preventDefault();
                this.navigate(href);
            });
            
            this.handlePath();
        }
    };
    
    // Register default routes (these will call appropriate app events)
    window.AHSS.router.addRoute('/', () => window.AHSS.app.emit('page:home'));
    window.AHSS.router.addRoute('/index.html', () => window.AHSS.app.emit('page:home'));
    window.AHSS.router.addRoute('/search.html', () => window.AHSS.app.emit('page:search'));
    window.AHSS.router.addRoute('/property.html', () => window.AHSS.app.emit('page:property'));
    window.AHSS.router.addRoute('/compare.html', () => window.AHSS.app.emit('page:compare'));
    window.AHSS.router.addRoute('/dashboard-host.html', () => window.AHSS.app.emit('page:dashboard_host'));
    window.AHSS.router.addRoute('/dashboard-guest.html', () => window.AHSS.app.emit('page:dashboard_guest'));
    window.AHSS.router.addRoute('/dispute-center.html', () => window.AHSS.app.emit('page:dispute'));
    
    // Initialize router after app
    window.AHSS.app.on('app_initialized', () => {
        window.AHSS.router.init();
    });
})();