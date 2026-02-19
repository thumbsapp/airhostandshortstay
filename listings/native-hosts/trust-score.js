// listings/native-hosts/trust-score.js
// Trust score for hosts based on history, reviews, verification

window.AHSS = window.AHSS || {};
window.AHSS.listings = window.AHSS.listings || {};
window.AHSS.listings.native = window.AHSS.listings.native || {};

(function() {
    // Calculate trust score (0-100)
    function calculateTrustScore(host) {
        let score = 50; // base

        if (host.verified) score += 20;
        if (host.emailVerified) score += 5;
        if (host.phoneVerified) score += 5;

        // Review average
        if (host.reviewAverage) {
            score += host.reviewAverage * 10; // assuming out of 5
        }

        // Number of reviews (more = more trustworthy)
        if (host.reviewCount > 50) score += 10;
        else if (host.reviewCount > 10) score += 5;

        // Years on platform
        if (host.yearsOnPlatform > 3) score += 10;
        else if (host.yearsOnPlatform > 1) score += 5;

        // No cancellations?
        if (host.cancellationRate < 0.05) score += 10;

        return Math.min(100, Math.max(0, Math.round(score)));
    }

    // Get trust level label
    function getTrustLevel(score) {
        if (score >= 90) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Fair';
        return 'New';
    }

    // Render trust badge
    function renderTrustBadge(host) {
        const score = calculateTrustScore(host);
        const level = getTrustLevel(score);
        let color = '#94a3b8';
        if (level === 'Excellent') color = '#10b981';
        else if (level === 'Good') color = '#f59e0b';
        return `<span class="trust-badge" style="background:${color}20; color:${color};" title="Trust score: ${score}">🤝 ${level}</span>`;
    }

    window.AHSS.listings.native.trustScore = {
        calculateTrustScore,
        getTrustLevel,
        renderTrustBadge
    };
})();