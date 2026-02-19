// js/search/search-advanced.js
// Advanced search bar with destination, dates, guests, flexible toggle

window.AHSS = window.AHSS || {};
window.AHSS.search = window.AHSS.search || {};

(function() {
    const advancedSearch = {
        init: function() {
            this.renderAdvancedSearchBar();
            this.attachEvents();
        },

        renderAdvancedSearchBar: function() {
            // Only render on pages with advanced search (homepage, search)
            const container = document.querySelector('.advanced-search-container');
            if (!container) return;

            container.innerHTML = `
                <div class="advanced-search-bar">
                    <div class="search-segment active" data-segment="destination">
                        <span class="segment-label">📍 Destination</span>
                        <span class="segment-value" id="dest-value">Nairobi</span>
                    </div>
                    <div class="search-segment" data-segment="dates">
                        <span class="segment-label">📅 Dates</span>
                        <span class="segment-value" id="dates-value">May 5–12</span>
                    </div>
                    <div class="search-segment" data-segment="guests">
                        <span class="segment-label">👥 Guests</span>
                        <span class="segment-value" id="guests-value">2 guests</span>
                    </div>
                    <div class="search-segment flexible-toggle">
                        <label class="flexible-check">
                            <input type="checkbox" id="flexible-dates"> ± Flexible
                        </label>
                    </div>
                    <button class="btn-search" id="advanced-search-btn">🔍</button>
                </div>
                <div class="autocomplete-dropdown" id="autocomplete-dropdown" style="display:none;"></div>
            `;
        },

        attachEvents: function() {
            document.querySelectorAll('.search-segment').forEach(seg => {
                seg.addEventListener('click', (e) => {
                    // Remove active from all, add to clicked
                    document.querySelectorAll('.search-segment').forEach(s => s.classList.remove('active'));
                    seg.classList.add('active');
                    
                    const segment = seg.dataset.segment;
                    if (segment === 'destination') {
                        window.AHSS.search.autocomplete?.show();
                    } else if (segment === 'dates') {
                        // Simple date picker simulation
                        alert('Date picker would open (simulated)');
                    } else if (segment === 'guests') {
                        alert('Guest selector would open');
                    }
                });
            });

            document.getElementById('advanced-search-btn')?.addEventListener('click', () => {
                const dest = document.getElementById('dest-value')?.innerText;
                const dates = document.getElementById('dates-value')?.innerText;
                const guests = document.getElementById('guests-value')?.innerText;
                console.log('Search with:', { dest, dates, guests });
                // Trigger search (could navigate to search.html with params)
                window.location.href = `search.html?destination=${encodeURIComponent(dest)}&dates=${encodeURIComponent(dates)}&guests=${encodeURIComponent(guests)}`;
            });

            document.getElementById('flexible-dates')?.addEventListener('change', (e) => {
                console.log('Flexible dates:', e.target.checked);
                // Could adjust UI
            });
        },

        updateValues: function(destination, dates, guests) {
            if (destination) document.getElementById('dest-value').innerText = destination;
            if (dates) document.getElementById('dates-value').innerText = dates;
            if (guests) document.getElementById('guests-value').innerText = guests;
        }
    };

    window.AHSS.search.advanced = advancedSearch;

    // Auto-init if container exists
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.advanced-search-container')) {
            advancedSearch.init();
        }
    });
})();