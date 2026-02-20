// js/listings/badges.js
// Dynamic badge rendering: verification, escrow, incentive, fraud, etc.

window.AHSS = window.AHSS || {};
window.AHSS.listings = window.AHSS.listings || {};

(function() {
    const badges = {
        // Verified host badge
        verifiedHost: function(host) {
            if (!host || !host.verified) return '';
            return `<span class="verified-badge" title="Verified host">✅ Verified</span>`;
        },

        // Escrow protected badge
        escrowProtected: function(hasEscrow = true) {
            if (!hasEscrow) return '';
            return `<span class="escrow-badge" title="Your payment is held in escrow">🛡️ Escrow</span>`;
        },

        // Incentive score badge (circular or chip)
        incentiveScore: function(score, size = 'small') {
            if (!score) return '';
            const sizeClass = size === 'large' ? 'score-large' : 'score-small';
            return `
                <div class="incentive-score-badge ${sizeClass}" title="Incentive score">
                    <div class="score-circle" style="background: conic-gradient(#f59e0b 0deg ${score*3.6}deg, #334155 ${score*3.6}deg);">
                        <span class="score-value">${score}</span>
                    </div>
                </div>
            `;
        },

        // Fraud risk indicator (if high)
        fraudRisk: function(riskScore) {
            if (!riskScore || riskScore < 70) return '';
            return `<span class="fraud-risk-badge">⚠️ Risk ${riskScore}</span>`;
        },

        // Tier badge (Silver, Gold, Diamond)
        tier: function(tier) {
            if (!tier) return '';
            const tierLower = tier.toLowerCase();
            return `<span class="badge ${tierLower}">${tier}</span>`;
        },

        // Availability pulse badge
        availability: function(status) {
            const statusMap = {
                'available': { class: 'green', text: 'Available' },
                'almost_gone': { class: 'amber', text: 'Almost gone' },
                'booked': { class: 'red', text: 'Booked' }
            };
            const s = statusMap[status] || statusMap.available;
            return `<span class="availability-pulse ${s.class}">⚡ ${s.text}</span>`;
        },

        // Real-time countdown badge (for Hot Homes)
        countdown: function(remaining) {
            if (!remaining) return '';
            return `<span class="countdown-badge">⏳ ${remaining} left</span>`;
        },

        // Stack multiple badges
        renderAll: function(listing) {
            const host = listing.host || {};
            return `
                <div class="badge-container">
                    ${this.verifiedHost(host)}
                    ${this.escrowProtected(true)}
                    ${this.tier(listing.tier)}
                    ${this.availability(listing.availability)}
                    ${this.fraudRisk(listing.fraudRiskScore)}
                    ${this.incentiveScore(listing.incentiveScore)}
                </div>
            `;
        }
    };

    window.AHSS.listings.badges = badges;
})();