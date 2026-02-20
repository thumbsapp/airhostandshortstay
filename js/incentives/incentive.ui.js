// js/incentives/incentive.ui.js
// UI rendering for incentives: badges, breakdowns, tooltips

window.AHSS = window.AHSS || {};
window.AHSS.incentives = window.AHSS.incentives || {};

(function() {
    const ui = {
        // Render incentive chips for a listing (max 3)
        renderChips: function(incentives, limit = 3) {
            if (!incentives || incentives.length === 0) return '';
            const chips = incentives.slice(0, limit).map(inc => {
                const cat = inc.category;
                return `<span class="badge incentive-badge ${cat}" title="${inc.description || inc.title}">🎁 ${inc.title || inc.value}</span>`;
            }).join('');
            const extra = incentives.length > limit ? `<span class="badge">+${incentives.length-limit}</span>` : '';
            return `<div class="incentive-strip">${chips}${extra}</div>`;
        },

        // Render full incentive breakdown for property page
        renderBreakdown: function(incentives) {
            if (!incentives || incentives.length === 0) return '<p>No incentives available</p>';
            let html = '<ul class="incentive-breakdown-list">';
            incentives.forEach(inc => {
                html += `<li><span class="inc-cat ${inc.category}">${inc.category}</span> <strong>${inc.title}</strong> – value $${inc.value}</li>`;
            });
            html += '</ul>';
            return html;
        },

        // Render total bonus value
        renderTotalBonus: function(incentives) {
            const total = incentives.reduce((sum, inc) => sum + (inc.value || 0), 0);
            return `<div class="total-bonus">🎁 Total bonus value: $${total}</div>`;
        },

        // Attach tooltips to incentive badges
        attachTooltips: function() {
            // Simple implementation: show title attribute
            // Could be enhanced with custom tooltips
        }
    };

    window.AHSS.incentives.ui = ui;
})();