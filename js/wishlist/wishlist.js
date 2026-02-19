// js/wishlist/wishlist.js
// Wishlist module – manages user's saved properties, sync with localStorage, UI updates

window.AHSS = window.AHSS || {};
window.AHSS.wishlist = window.AHSS.wishlist || {};

(function() {
    const STORAGE_KEY = window.AHSS.config?.storageKeys?.wishlist || 'ahss_wishlist';
    const MAX_ITEMS = window.AHSS.config?.ui?.maxWishlistItems || 5;

    let wishlist = []; // array of listing IDs

    // Load from localStorage
    function load() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            wishlist = stored ? JSON.parse(stored) : [];
            // Ensure it's an array
            if (!Array.isArray(wishlist)) wishlist = [];
        } catch (e) {
            console.warn('Failed to load wishlist', e);
            wishlist = [];
        }
        return wishlist;
    }

    // Save to localStorage
    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
        } catch (e) {
            console.warn('Failed to save wishlist', e);
        }
    }

    // Check if a listing is in wishlist
    function includes(listingId) {
        return wishlist.includes(Number(listingId));
    }

    // Add to wishlist (if not full)
    function add(listingId) {
        const id = Number(listingId);
        if (includes(id)) return false; // already there
        if (wishlist.length >= MAX_ITEMS) {
            alert(`You can only pin up to ${MAX_ITEMS} properties. Remove one first.`);
            return false;
        }
        wishlist.push(id);
        save();
        window.AHSS.app?.emit('wishlist_updated', wishlist);
        return true;
    }

    // Remove from wishlist
    function remove(listingId) {
        const id = Number(listingId);
        const index = wishlist.indexOf(id);
        if (index !== -1) {
            wishlist.splice(index, 1);
            save();
            window.AHSS.app?.emit('wishlist_updated', wishlist);
            return true;
        }
        return false;
    }

    // Toggle
    function toggle(listingId) {
        return includes(listingId) ? remove(listingId) : add(listingId);
    }

    // Get full wishlist array
    function getAll() {
        return [...wishlist];
    }

    // Get detailed wishlist items (listing objects)
    function getListings() {
        const listings = [];
        wishlist.forEach(id => {
            const listing = window.AHSS.data?.getListingById(id);
            if (listing) listings.push(listing);
        });
        return listings;
    }

    // Clear all
    function clear() {
        wishlist = [];
        save();
        window.AHSS.app?.emit('wishlist_updated', wishlist);
    }

    // Render wishlist UI (used in guest dashboard or sidebar)
    function render(containerSelector = '.wishlist-grid') {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const listings = getListings();
        if (listings.length === 0) {
            container.innerHTML = '<p class="empty-wishlist">Your wishlist is empty</p>';
            return;
        }
        let html = '';
        listings.forEach(listing => {
            html += `
                <div class="wishlist-item" data-id="${listing.id}">
                    <img src="${listing.images?.[0] || 'https://picsum.photos/100/100'}" alt="${listing.title}">
                    <div class="wishlist-item-details">
                        <h4>${listing.title}</h4>
                        <p>$${listing.price}/night · ⭐ ${listing.rating || 'New'}</p>
                    </div>
                    <button class="remove-wishlist" data-id="${listing.id}">✕</button>
                </div>
            `;
        });
        container.innerHTML = html;

        // Attach remove handlers
        container.querySelectorAll('.remove-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                remove(id);
                render(containerSelector); // re-render
            });
        });
    }

    // Public API
    window.AHSS.wishlist = {
        load,
        save,
        includes,
        add,
        remove,
        toggle,
        getAll,
        getListings,
        clear,
        render
    };

    // Auto-load on init
    window.AHSS.app?.on('app_initialized', () => {
        load();
    });
})();