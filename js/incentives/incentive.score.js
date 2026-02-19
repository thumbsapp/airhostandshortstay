// js/incentives/incentive.score.js
// Standalone incentive score calculator and display formatter

window.AHSS = window.AHSS || {};
window.AHSS.incentives = window.AHSS.incentives || {};

(function() {
    const scoreModule = {
        // Calculate score using config weights
        calculate: function(incentives) {
            if (!incentives || incentives.length === 0) return 0;
            const weights = window.AHSS.incentives.config.weights;
            let total = 0;
            incentives.forEach(inc => {
                const weight = weights[inc.category] || 0.1;
                total += (inc.value || 1) * weight;
            });
            return Math.min(100, Math.round(total));
        },

        // Get color based on score range
        getScoreColor: function(score) {
            if (score >= 80) return '#10b981'; // green
            if (score >= 60) return '#f59e0b'; // amber
            return '#94a3b8'; // gray
        },

        // Render a score badge (circular or chip)
        renderBadge: function(score, size = 'small') {
            const color = this.getScoreColor(score);
            if (size === 'large') {
                return `<div class="incentive-score-large" style="background: conic-gradient(${color} 0deg ${score*3.6}deg, #334155 ${score*3.6}deg);">
                    <span class="score-value">${score}</span>
                </div>`;
            } else {
                return `<span class="badge" style="background:${color}20; color:${color};">⭐ ${score}</span>`;
            }
        },

        // Breakdown of score by category
        breakdown: function(incentives) {
            const categories = {};
            incentives.forEach(inc => {
                const cat = inc.category;
                if (!categories[cat]) categories[cat] = 0;
                categories[cat] += inc.value || 0;
            });
            return categories;
        }
    };

    window.AHSS.incentives.score = scoreModule;
})();