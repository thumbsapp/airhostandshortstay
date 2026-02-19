// engagement/favorites/local-storage-sync.js
// LocalStorage sync for favorites

window.AHSS = window.AHSS || {};
window.AHSS.engagement = window.AHSS.engagement || {};
window.AHSS.engagement.favorites = window.AHSS.engagement.favorites || {};

(function() {
    const STORAGE_KEY = window.AHSS.config?.storageKeys?.wishlist || 'ahss_favorites';

    function load() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn('Failed to load favorites', e);
            return [];
        }
    }

    function save(favorites) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        } catch (e) {
            console.warn('Failed to save favorites', e);
        }
    }

    function clear() {
        localStorage.removeItem(STORAGE_KEY);
    }

    window.AHSS.engagement.favorites.localStorageSync = {
        load,
        save,
        clear
    };
})();