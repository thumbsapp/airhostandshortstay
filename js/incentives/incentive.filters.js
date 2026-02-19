// js/incentives/incentive.filters.js
// Filter UI for incentive-related filters (cashback, score, etc.)

window.AHSS = window.AHSS || {};
window.AHSS.incentives = window.AHSS.incentives || {};

(function() {
    const filters = {
        init: function() {
            // Add incentive filter controls to filters sidebar
            const sidebar = document.querySelector('.filters-sidebar');
            if (!sidebar) return;

            // Check if already added
            if (document.getElementById('incentive-filters')) return;

            const html = `
                <div id="incentive-filters" class="filter-group">
                    <label>Incentive type</label>
                    <div class="incentive-type-chips">
                        <span class="filter-chip" data-inc="financial">💰 Cashback</span>
                        <span class="filter-chip" data-inc="physical">🎁 Physical</span>
                        <span class="filter-chip" data-inc="experience">🧘 Experience</span>
                        <span class="filter-chip" data-inc="occasion">🎂 Occasion</span>
                        <span class="filter-chip" data-inc="business">💼 Business</span>
                    </div>
                    <label style="margin-top:10px;">Min incentive score</label>
                    <input type="range" min="0" max="100" value="0" id="incentive-score-slider" class="slider-amber">
                    <div class="range-values">Score: <span id="incentive-score-value">0+</span></div>
                </div>
            `;
            // Insert after price range or at appropriate position
            const priceGroup = sidebar.querySelector('.filter-group');
            if (priceGroup) {
                priceGroup.insertAdjacentHTML('afterend', html);
            } else {
                sidebar.insertAdjacentHTML('beforeend', html);
            }

            this.attachEvents();
        },

        attachEvents: function() {
            const chips = document.querySelectorAll('.incentive-type-chips .filter-chip');
            chips.forEach(chip => {
                chip.addEventListener('click', () => {
                    chip.classList.toggle('active');
                    this.applyIncentiveFilters();
                });
            });

            const slider = document.getElementById('incentive-score-slider');
            if (slider) {
                slider.addEventListener('input', (e) => {
                    document.getElementById('incentive-score-value').textContent = e.target.value + '+';
                });
                slider.addEventListener('change', () => this.applyIncentiveFilters());
            }
        },

        applyIncentiveFilters: function() {
            const selectedCategories = [];
            document.querySelectorAll('.incentive-type-chips .filter-chip.active').forEach(chip => {
                selectedCategories.push(chip.dataset.inc);
            });
            const minScore = parseInt(document.getElementById('incentive-score-slider')?.value || 0);

            // Update state
            if (window.AHSS.state) {
                window.AHSS.state.setFilter('incentiveCategories', selectedCategories);
                window.AHSS.state.setFilter('incentiveScoreMin', minScore);
            }
        },

        // Reset filters
        reset: function() {
            document.querySelectorAll('.incentive-type-chips .filter-chip').forEach(c => c.classList.remove('active'));
            const slider = document.getElementById('incentive-score-slider');
            if (slider) {
                slider.value = 0;
                document.getElementById('incentive-score-value').textContent = '0+';
            }
        }
    };

    window.AHSS.incentives.filters = filters;

    // Auto-init when DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.filters-sidebar')) {
            filters.init();
        }
    });
})();