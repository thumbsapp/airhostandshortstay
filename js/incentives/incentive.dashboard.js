// js/incentives/incentive.dashboard.js
// Host dashboard marketing tab: incentive overview, creation form, AI suggestions

window.AHSS = window.AHSS || {};
window.AHSS.incentives = window.AHSS.incentives || {};

(function() {
    const dashboard = {
        init: function() {
            // Check if we're on host dashboard page and marketing tab is active
            if (!document.querySelector('.dashboard-host')) return;
            this.renderMarketingTab();
        },

        renderMarketingTab: function() {
            const mainPanel = document.querySelector('.main-panel');
            if (!mainPanel) return;

            // Look for Marketing tab click
            const marketingTab = Array.from(document.querySelectorAll('.tab')).find(el => el.textContent.includes('Marketing'));
            if (marketingTab) {
                marketingTab.addEventListener('click', () => {
                    this.showMarketingContent();
                });
            }

            // If already active, show
            if (marketingTab?.classList.contains('active-tab')) {
                this.showMarketingContent();
            }
        },

        showMarketingContent: function() {
            const mainPanel = document.querySelector('.main-panel');
            if (!mainPanel) return;
            mainPanel.innerHTML = this.getMarketingHTML();
            this.attachMarketingEvents();
        },

        getMarketingHTML: function() {
            return `
                <h2>Marketing & Incentives</h2>
                <div class="incentive-overview">
                    <h3>Current incentive score: 92</h3>
                    <p>Conversion boost: +15%</p>
                </div>
                <div class="incentive-form">
                    <h3>Create new incentive</h3>
                    <input type="text" id="inc-title" placeholder="Title (e.g. Free breakfast)" />
                    <select id="inc-category">
                        <option value="financial">Financial</option>
                        <option value="physical">Physical</option>
                        <option value="experience">Experience</option>
                        <option value="occasion">Occasion</option>
                        <option value="business">Business</option>
                    </select>
                    <input type="number" id="inc-value" placeholder="Value in $" />
                    <label><input type="checkbox" id="inc-stackable"> Stackable</label>
                    <button id="inc-submit" class="btn-apply">Add incentive</button>
                </div>
                <div class="ai-suggestion-box">
                    <h3>AI suggestions</h3>
                    <ul>
                        <li>⚡ Add "10% cashback" – similar homes see +30% bookings</li>
                        <li>🎁 Free spa kit increases incentive score by 8 points</li>
                        <li>🚗 Airport transfer discount attracts business travelers</li>
                    </ul>
                </div>
                <div class="cost-estimator">
                    <h3>Cost estimator</h3>
                    <p>Booking price: $180</p>
                    <p>Cashback (10%): $18</p>
                    <p>Platform fee: $27</p>
                    <p>Net revenue: $135</p>
                </div>
            `;
        },

        attachMarketingEvents: function() {
            document.getElementById('inc-submit')?.addEventListener('click', () => {
                const title = document.getElementById('inc-title').value;
                const category = document.getElementById('inc-category').value;
                const value = parseInt(document.getElementById('inc-value').value);
                const stackable = document.getElementById('inc-stackable').checked;
                if (title && category && value) {
                    // In real app, would send to backend
                    alert(`Incentive "${title}" added (simulated)`);
                } else {
                    alert('Please fill all fields');
                }
            });
        }
    };

    window.AHSS.incentives.dashboard = dashboard;

    document.addEventListener('DOMContentLoaded', () => {
        dashboard.init();
    });
})();