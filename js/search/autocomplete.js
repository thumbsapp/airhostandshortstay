// js/search/autocomplete.js
// Autocomplete for destination input, with recent searches and popular regions

window.AHSS = window.AHSS || {};
window.AHSS.search = window.AHSS.search || {};

(function() {
    const autocomplete = {
        inputElement: null,
        dropdownElement: null,
        recentSearches: [],
        popularRegions: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Thika', 'Diani', 'Malindi', 'Naivasha'],

        init: function(inputSelector = '#dest-input', dropdownSelector = '#autocomplete-dropdown') {
            this.inputElement = document.querySelector(inputSelector);
            this.dropdownElement = document.querySelector(dropdownSelector);
            if (!this.inputElement || !this.dropdownElement) return;

            this.loadRecentSearches();
            this.attachEvents();
        },

        loadRecentSearches: function() {
            this.recentSearches = window.AHSS.cache?.getRecentSearches() || [];
        },

        attachEvents: function() {
            this.inputElement.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                if (query.length < 2) {
                    this.hide();
                    return;
                }
                const suggestions = this.getSuggestions(query);
                this.renderDropdown(suggestions);
                this.show();
            });

            this.inputElement.addEventListener('focus', () => {
                if (this.inputElement.value.length >= 2) {
                    const suggestions = this.getSuggestions(this.inputElement.value.toLowerCase());
                    this.renderDropdown(suggestions);
                    this.show();
                }
            });

            document.addEventListener('click', (e) => {
                if (!this.inputElement.contains(e.target) && !this.dropdownElement.contains(e.target)) {
                    this.hide();
                }
            });
        },

        getSuggestions: function(query) {
            // Combine recent searches and popular regions that match query
            const all = [...this.recentSearches, ...this.popularRegions];
            const unique = [...new Set(all)];
            return unique.filter(item => item.toLowerCase().includes(query)).slice(0, 8);
        },

        renderDropdown: function(suggestions) {
            if (!this.dropdownElement) return;
            if (suggestions.length === 0) {
                this.dropdownElement.innerHTML = '<div class="autocomplete-item disabled">No matches</div>';
                return;
            }
            this.dropdownElement.innerHTML = suggestions.map(s => `
                <div class="autocomplete-item" data-value="${s}">
                    <span>📍 ${s}</span>
                    ${this.recentSearches.includes(s) ? '<span class="recent-badge">recent</span>' : ''}
                </div>
            `).join('');

            // Add click handlers
            this.dropdownElement.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', () => {
                    const value = item.dataset.value;
                    this.inputElement.value = value;
                    this.hide();
                    // Update search bar and add to recent
                    window.AHSS.search.advanced?.updateValues(value, null, null);
                    window.AHSS.cache?.addRecentSearch(value);
                });
            });
        },

        show: function() {
            if (this.dropdownElement) this.dropdownElement.style.display = 'block';
        },

        hide: function() {
            if (this.dropdownElement) this.dropdownElement.style.display = 'none';
        }
    };

    window.AHSS.search.autocomplete = autocomplete;

    // Auto-init if input exists
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('#dest-input') || document.querySelector('.search-segment[data-segment="destination"]')) {
            // For advanced search bar we might need to attach to hidden input
            // We'll create a hidden input if not present
            if (!document.querySelector('#dest-input')) {
                const input = document.createElement('input');
                input.id = 'dest-input';
                input.type = 'hidden';
                document.body.appendChild(input);
            }
            if (!document.querySelector('#autocomplete-dropdown')) {
                const dropdown = document.createElement('div');
                dropdown.id = 'autocomplete-dropdown';
                dropdown.className = 'autocomplete-dropdown';
                dropdown.style.display = 'none';
                document.body.appendChild(dropdown);
            }
            autocomplete.init('#dest-input', '#autocomplete-dropdown');
        }
    });
})();