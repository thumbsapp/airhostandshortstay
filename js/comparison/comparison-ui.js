// js/comparison/comparison-ui.js
// Comparison UI – renders comparison modal, bar, and handles user interactions

window.AHSS = window.AHSS || {};
window.AHSS.comparison = window.AHSS.comparison || {};

(function() {
    let modalElement = null;
    let barElement = null;

    // Initialize UI: create comparison bar and modal if not exist
    function init() {
        createComparisonBar();
        createModal();

        // Listen to comparison updates
        window.AHSS.app?.on('comparison_updated', (compareList) => {
            updateBar(compareList.length);
            if (compareList.length > 0) {
                showBar();
            } else {
                hideBar();
            }
        });

        // Also update checkboxes on listings
        window.AHSS.app?.on('listings_updated', () => {
            syncCheckboxes();
        });
    }

    function createComparisonBar() {
        if (document.querySelector('.compare-bar')) return;
        barElement = document.createElement('div');
        barElement.className = 'compare-bar';
        barElement.innerHTML = `
            <span class="compare-count">0 properties selected</span>
            <div class="compare-actions">
                <button id="compare-now" class="btn-primary" disabled>Compare</button>
                <button id="clear-comparison" class="btn-outline">Clear</button>
            </div>
        `;
        barElement.style.display = 'none'; // hidden initially
        document.body.appendChild(barElement);

        document.getElementById('compare-now')?.addEventListener('click', () => {
            showModal();
        });
        document.getElementById('clear-comparison')?.addEventListener('click', () => {
            window.AHSS.comparison.core.clear();
            syncCheckboxes();
        });
    }

    function createModal() {
        if (document.querySelector('.comparison-modal')) return;
        modalElement = document.createElement('div');
        modalElement.className = 'comparison-modal';
        modalElement.style.display = 'none';
        modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Compare Properties</h2>
                <div class="compare-grid" id="compare-grid"></div>
                <button class="btn-apply" id="close-compare">Close</button>
            </div>
        `;
        document.body.appendChild(modalElement);

        modalElement.querySelector('.close-modal').addEventListener('click', hideModal);
        modalElement.querySelector('#close-compare').addEventListener('click', hideModal);
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) hideModal();
        });
    }

    function showBar() {
        if (barElement) barElement.style.display = 'flex';
    }

    function hideBar() {
        if (barElement) barElement.style.display = 'none';
    }

    function updateBar(count) {
        if (!barElement) return;
        const span = barElement.querySelector('.compare-count');
        span.textContent = `${count} property${count !== 1 ? 'ies' : 'y'} selected`;
        const compareBtn = document.getElementById('compare-now');
        if (compareBtn) {
            compareBtn.disabled = count < 2;
        }
    }

    function syncCheckboxes() {
        document.querySelectorAll('.compare-checkbox').forEach(cb => {
            const id = parseInt(cb.value);
            cb.checked = window.AHSS.comparison.core.includes(id);
        });
    }

    function showModal() {
        if (!modalElement) createModal();
        const listings = window.AHSS.comparison.core.getListings();
        if (listings.length < 2) {
            alert('Select at least 2 properties to compare');
            return;
        }

        const grid = document.getElementById('compare-grid');
        grid.innerHTML = '';

        // Get all unique property keys to compare
        const keys = ['title', 'price', 'incentiveScore', 'cashback', 'amenities', 'rating', 'location', 'tier'];
        // Create header row
        let html = '<div class="compare-row header"><div class="compare-feature">Feature</div>';
        listings.forEach(l => {
            html += `<div class="compare-column-header">${l.title}</div>`;
        });
        html += '</div>';

        // For each key, create a row
        keys.forEach(key => {
            html += '<div class="compare-row">';
            html += `<div class="compare-feature">${formatKey(key)}</div>`;
            listings.forEach(l => {
                let value = l[key];
                if (key === 'amenities') value = value ? value.join(', ') : '—';
                if (key === 'price') value = `$${value}`;
                if (key === 'incentiveScore') value = value ? `⭐ ${value}` : '—';
                if (key === 'rating') value = value ? `⭐ ${value}` : 'New';
                html += `<div class="compare-value">${value || '—'}</div>`;
            });
            html += '</div>';
        });

        grid.innerHTML = html;
        modalElement.style.display = 'flex';
    }

    function hideModal() {
        if (modalElement) modalElement.style.display = 'none';
    }

    function formatKey(key) {
        const map = {
            title: 'Property',
            price: 'Price/night',
            incentiveScore: 'Incentive score',
            cashback: 'Cashback',
            amenities: 'Amenities',
            rating: 'Rating',
            location: 'Location',
            tier: 'Tier'
        };
        return map[key] || key;
    }

    // Public API
    window.AHSS.comparison.ui = {
        init,
        showModal,
        hideModal,
        syncCheckboxes
    };

    // Auto-init when DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
})();