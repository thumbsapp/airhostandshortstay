// js/core/app.js
// APP.JS – Main application initializer, global event bus, and service worker

window.AHSS = window.AHSS || {};

(function() {
    'use strict';

    // App state (initialized empty, will be populated by state-manager)
    window.AHSS.app = {
        initialized: false,
        version: window.AHSS.config?.version || '1.0.0',
        eventListeners: {},
        
        // Event emitter (simple pub/sub)
        on: function(event, callback) {
            if (!this.eventListeners[event]) this.eventListeners[event] = [];
            this.eventListeners[event].push(callback);
        },
        
        off: function(event, callback) {
            if (!this.eventListeners[event]) return;
            this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
        },
        
        emit: function(event, data) {
            if (!this.eventListeners[event]) return;
            this.eventListeners[event].forEach(callback => {
                try { callback(data); } catch (e) { console.error(e); }
            });
        },
        
        // Initialize the entire app
        init: function() {
            if (this.initialized) return;
            console.log('AirHost&ShortStay app initializing...');
            
            // Load core modules in order
            // (Assuming scripts are loaded in correct order; we just trigger)
            
            // Set up service worker if supported
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('service-worker.js')
                    .then(reg => console.log('Service Worker registered', reg))
                    .catch(err => console.error('SW registration failed', err));
            }
            
            // Load cached data
            if (window.AHSS.cache) {
                window.AHSS.cache.loadCachedData();
            }
            
            // Initialize state with default filters
            if (window.AHSS.state) {
                window.AHSS.state.init();
            }
            
            // Set up global listeners (e.g., beforeunload to save state)
            window.addEventListener('beforeunload', () => {
                if (window.AHSS.state) {
                    window.AHSS.state.persist();
                }
            });
            
            // Detect page and run page-specific init
            this.initPage();
            
            this.initialized = true;
            this.emit('app_initialized');
            console.log('App ready');
        },
        
        // Page-specific initialization based on current URL
        initPage: function() {
            const path = window.location.pathname.split('/').pop() || 'index.html';
            
            if (path === 'index.html' || path === '') {
                this.emit('page:home');
            } else if (path === 'search.html') {
                this.emit('page:search');
            } else if (path === 'property.html') {
                this.emit('page:property');
            } else if (path === 'compare.html') {
                this.emit('page:compare');
            } else if (path === 'dashboard-host.html') {
                this.emit('page:dashboard_host');
            } else if (path === 'dashboard-guest.html') {
                this.emit('page:dashboard_guest');
            } else if (path === 'dispute-center.html') {
                this.emit('page:dispute');
            }
        }
    };

    // Auto-initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        window.AHSS.app.init();
    });
})();