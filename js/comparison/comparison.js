// js/comparison/comparison.js
// Comparison module core – manages list of properties selected for comparison

window.AHSS = window.AHSS || {};
window.AHSS.comparison = window.AHSS.comparison || {};

(function() {
    const STORAGE_KEY = window.AHSS.config?.storageKeys?.comparison || 'ahss_comparison';
    const MAX_ITEMS = window.AHSS.config?.ui?.maxCompareItems || 4;

    let compareList = []; // array of listing IDs

    // Load from localStorage
    function load() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            compareList = stored ? JSON.parse(stored) : [];
            if (!Array.isArray(compareList)) compareList = [];
        } catch (e) {
            console.warn('Failed to load comparison', e);
            compareList = [];
        }
        return compareList;
    }

    // Save to localStorage
    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
        } catch (e) {
            console.warn('Failed to save comparison', e);
        }
    }

    // Check if listing is in comparison
    function includes(listingId) {
        return compareList.includes(Number(listingId));
    }

    // Add to comparison (if not full)
    function add(listingId) {
        const id = Number(listingId);
        if (includes(id)) return false;
        if (compareList.length >= MAX_ITEMS) {
            alert(`You can compare up to ${MAX_ITEMS} properties. Remove one first.`);
            return false;
        }
        compareList.push(id);
        save();
        window.AHSS.app?.emit('comparison_updated', compareList);
        return true;
    }

    // Remove from comparison
    function remove(listingId) {
        const id = Number(listingId);
        const index = compareList.indexOf(id);
        if (index !== -1) {
            compareList.splice(index, 1);
            save();
            window.AHSS.app?.emit('comparison_updated', compareList);
            return true;
        }
        return false;
    }

    // Toggle
    function toggle(listingId) {
        return includes(listingId) ? remove(listingId) : add(listingId);
    }

    // Get all IDs
    function getAll() {
        return [...compareList];
    }

    // Get detailed listing objects
    function getListings() {
        const listings = [];
        compareList.forEach(id => {
            const listing = window.AHSS.data?.getListingById(id);
            if (listing) listings.push(listing);
        });
        return listings;
    }

    // Clear all
    function clear() {
        compareList = [];
        save();
        window.AHSS.app?.emit('comparison_updated', compareList);
    }

    // Public API
    window.AHSS.comparison.core = {
        load,
        save,
        includes,
        add,
        remove,
        toggle,
        getAll,
        getListings,
        clear
    };

    // Auto-load
    window.AHSS.app?.on('app_initialized', () => {
        load();
    });
})();