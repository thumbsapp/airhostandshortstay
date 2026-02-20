// js/listings/listings.js
// Listings grid rendering and management, listens to state changes and pagination

window.AHSS = window.AHSS || {};
window.AHSS.listings = window.AHSS.listings || {};

(function() {
    const listings = {
        container: null,
        template: null,
        currentListings: [],

        init: function(containerSelector = '.grid-cards') {
            this.container = document.querySelector(containerSelector);
            if (!this.container) return;

            // Subscribe to state changes
            window.AHSS.app?.on(window.AHSS.constants.EVENTS.LISTINGS_UPDATED, (listingsData) => {
                this.currentListings = listingsData;
                this.render();
            });

            // Subscribe to pagination
            window.AHSS.app?.on('pagination_changed', (pageInfo) => {
                this.renderPage(pageInfo.page, pageInfo.limit);
            });

            // Initial load: if state already has filtered listings
            if (window.AHSS.state?.filteredListings) {
                this.currentListings = window.AHSS.state.filteredListings;
                this.render();
            }
        },

        render: function() {
            if (!this.container) return;
            // Get paginated items from pagination module if exists
            let itemsToRender = this.currentListings;
            if (window.AHSS.search.pagination) {
                const page = window.AHSS.search.pagination.currentPage;
                const limit = window.AHSS.search.pagination.itemsPerPage;
                itemsToRender = window.AHSS.search.pagination.getCurrentPageItems(this.currentListings);
            }

            if (itemsToRender.length === 0) {
                this.container.innerHTML = '<div class="no-results">No properties match your filters</div>';
                return;
            }

            let html = '';
            itemsToRender.forEach(listing => {
                html += window.AHSS.listings.card?.render(listing) || this.renderCard(listing);
            });
            this.container.innerHTML = html;

            // Attach wishlist/comparison listeners (delegated)
            this.attachCardListeners();
        },

        renderPage: function(page, limit) {
            // Re-render with current listings but new page
            this.render();
        },

        renderCard: function(listing) {
            // Fallback card render if listing-card module not present
            return `
                <div class="listing-card-enhanced" data-id="${listing.id}">
                    <img src="${listing.images?.[0] || 'https://picsum.photos/300/200'}" alt="${listing.title}">
                    <div class="card-details">
                        <h4>${listing.title}</h4>
                        <div class="price">$${listing.price}/night</div>
                        <div class="incentive-badge">+$${listing.bonusValue || 0} bonus</div>
                    </div>
                </div>
            `;
        },

        attachCardListeners: function() {
            // Wishlist clicks
            this.container.querySelectorAll('.wishlist-icon').forEach(icon => {
                icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const card = e.target.closest('[data-id]');
                    if (card) {
                        const id = parseInt(card.dataset.id);
                        window.AHSS.state?.toggleWishlist(id);
                        // Update icon state
                        const wishlist = window.AHSS.state?.wishlist || [];
                        if (wishlist.includes(id)) {
                            icon.classList.add('active');
                        } else {
                            icon.classList.remove('active');
                        }
                    }
                });
            });

            // Compare checkboxes
            this.container.querySelectorAll('.compare-checkbox').forEach(cb => {
                cb.addEventListener('change', (e) => {
                    const card = e.target.closest('[data-id]');
                    if (card) {
                        const id = parseInt(card.dataset.id);
                        if (e.target.checked) {
                            window.AHSS.state?.toggleComparison(id);
                        } else {
                            // Remove from comparison (toggle will remove if present)
                            window.AHSS.state?.toggleComparison(id);
                        }
                    }
                });
            });

            // Card click to show preview (if on search page)
            this.container.querySelectorAll('.listing-card-enhanced').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.tagName === 'INPUT' || e.target.classList.contains('wishlist-icon')) return;
                    const id = card.dataset.id;
                    const listing = window.AHSS.data?.getListingById(parseInt(id));
                    if (listing && window.AHSS.state) {
                        window.AHSS.state.selectedProperty = listing;
                    }
                });
            });
        }
    };

    window.AHSS.listings.grid = listings;

    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.grid-cards')) {
            listings.init();
        }
    });
})();