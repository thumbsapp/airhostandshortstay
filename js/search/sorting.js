// js/search/sorting.js
// Sorting dropdown logic

window.AHSS = window.AHSS || {};
window.AHSS.search = window.AHSS.search || {};

(function() {
    const sorting = {
        selectElement: null,

        init: function(selector = '#sort-select') {
            this.selectElement = document.querySelector(selector);
            if (!this.selectElement) return;

            this.loadFromState();
            this.attachEvents();
        },

        attachEvents: function() {
            this.selectElement.addEventListener('change', (e) => {
                const sortBy = e.target.value;
                this.applySort(sortBy);
            });
        },

        applySort: function(sortBy) {
            // Map dropdown value to sort key
            let sortKey = 'recommended';
            switch (sortBy) {
                case 'Price low': sortKey = 'price_asc'; break;
                case 'Price high': sortKey = 'price_desc'; break;
                case 'Incentive score': sortKey = 'incentive_desc'; break;
                default: sortKey = 'recommended';
            }

            if (window.AHSS.state) {
                window.AHSS.state.sortBy = sortKey;
                window.AHSS.state.applyFilters(); // re-sort
            }
        },

        loadFromState: function() {
            if (!window.AHSS.state || !this.selectElement) return;
            const sortBy = window.AHSS.state.sortBy;
            let displayText = 'Recommended';
            if (sortBy === 'price_asc') displayText = 'Price low';
            else if (sortBy === 'price_desc') displayText = 'Price high';
            else if (sortBy === 'incentive_desc') displayText = 'Incentive score';
            // Set select value (if options match)
            const option = Array.from(this.selectElement.options).find(opt => opt.text === displayText);
            if (option) option.selected = true;
        }
    };

    window.AHSS.search.sorting = sorting;

    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('#sort-select')) {
            sorting.init();
        }
    });
})();