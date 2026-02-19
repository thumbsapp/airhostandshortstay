// engagement/favorites/favorites-engine.js
// Favorites engine – manage user's favorite listings (wishlist core)

window.AHSS = window.AHSS || {};
window.AHSS.engagement = window.AHSS.engagement || {};
window.AHSS.engagement.favorites = window.AHSS.engagement.favorites || {};

(function() {
    let favorites = []; // array of listing IDs

    // Load from localStorage (delegates to sync module)
    function load() {
        if (window.AHSS.engagement.favorites.localStorageSync) {
            favorites = window.AHSS.engagement.favorites.localStorageSync.load() || [];
        }
        return favorites;
    }

    // Save to localStorage
    function save() {
        if (window.AHSS.engagement.favorites.localStorageSync) {
            window.AHSS.engagement.favorites.localStorageSync.save(favorites);
        }
    }

    // Check if a listing is favorited
    function isFavorite(listingId) {
        return favorites.includes(Number(listingId));
    }

    // Add to favorites
    function add(listingId) {
        const id = Number(listingId);
        if (!isFavorite(id)) {
            favorites.push(id);
            save();
            window.AHSS.app?.emit('favorites_updated', favorites);
            return true;
        }
        return false;
    }

    // Remove from favorites
    function remove(listingId) {
        const id = Number(listingId);
        const index = favorites.indexOf(id);
        if (index !== -1) {
            favorites.splice(index, 1);
            save();
            window.AHSS.app?.emit('favorites_updated', favorites);
            return true;
        }
        return false;
    }

    // Toggle
    function toggle(listingId) {
        return isFavorite(listingId) ? remove(listingId) : add(listingId);
    }

    // Get all favorite listing IDs
    function getAll() {
        return [...favorites];
    }

    // Get full listing objects for favorites
    function getListings() {
        return favorites
            .map(id => window.AHSS.data?.getListingById(id))
            .filter(l => l);
    }

    window.AHSS.engagement.favorites.engine = {
        load,
        save,
        isFavorite,
        add,
        remove,
        toggle,
        getAll,
        getListings
    };

    // Auto-load on init
    window.AHSS.app?.on('app_initialized', load);
})();