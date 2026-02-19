// js/search/pagination.js
// Pagination for listings grid (simulated)

window.AHSS = window.AHSS || {};
window.AHSS.search = window.AHSS.search || {};

(function() {
    const pagination = {
        currentPage: 1,
        itemsPerPage: window.AHSS.config?.ui?.itemsPerPage || 12,
        totalItems: 0,
        container: null,
        paginationControls: null,

        init: function(containerSelector = '.grid-cards', controlsSelector = '.pagination-controls') {
            this.container = document.querySelector(containerSelector);
            this.paginationControls = document.querySelector(controlsSelector);
            if (!this.container) return;

            // Listen to listings updates from state
            window.AHSS.app?.on(window.AHSS.constants.EVENTS.LISTINGS_UPDATED, (listings) => {
                this.totalItems = listings.length;
                this.renderPaginationControls();
                this.showPage(1); // reset to first page on new listings
            });

            this.renderPaginationControls();
        },

        renderPaginationControls: function() {
            if (!this.paginationControls) return;
            const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            if (totalPages <= 1) {
                this.paginationControls.innerHTML = '';
                return;
            }

            let html = '<div class="pagination">';
            html += `<button class="page-prev" ${this.currentPage === 1 ? 'disabled' : ''}>‹ Prev</button>`;
            for (let i = 1; i <= totalPages; i++) {
                html += `<button class="page-num ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            html += `<button class="page-next" ${this.currentPage === totalPages ? 'disabled' : ''}>Next ›</button>`;
            html += '</div>';
            this.paginationControls.innerHTML = html;

            // Attach events
            this.paginationControls.querySelectorAll('.page-num').forEach(btn => {
                btn.addEventListener('click', () => this.showPage(parseInt(btn.dataset.page)));
            });
            this.paginationControls.querySelector('.page-prev')?.addEventListener('click', () => this.showPage(this.currentPage - 1));
            this.paginationControls.querySelector('.page-next')?.addEventListener('click', () => this.showPage(this.currentPage + 1));
        },

        showPage: function(page) {
            if (page < 1) return;
            const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            if (page > totalPages) return;
            this.currentPage = page;

            // Emit event for listings to render only this page
            window.AHSS.app?.emit('pagination_changed', { page, limit: this.itemsPerPage });

            // Update active class
            this.renderPaginationControls(); // re-render to reflect active
        },

        getCurrentPageItems: function(allItems) {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return allItems.slice(start, end);
        }
    };

    window.AHSS.search.pagination = pagination;

    document.addEventListener('DOMContentLoaded', () => {
        // If pagination controls exist, init
        if (document.querySelector('.pagination-controls')) {
            pagination.init();
        }
    });
})();