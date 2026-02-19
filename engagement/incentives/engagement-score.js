// engagement/incentives/engagement-score.js
// Engagement score – measures user activity (bookings, reviews, wishlist)

window.AHSS = window.AHSS || {};
window.AHSS.engagement = window.AHSS.engagement || {};
window.AHSS.engagement.incentives = window.AHSS.engagement.incentives || {};

(function() {
    // Calculate engagement score for a user (0-100)
    function calculateScore(user) {
        let score = 0;
        // Bookings completed
        if (user.bookingCount) score += Math.min(30, user.bookingCount * 5);
        // Reviews left
        if (user.reviewCount) score += Math.min(20, user.reviewCount * 2);
        // Wishlist items
        if (user.wishlistCount) score += Math.min(15, user.wishlistCount);
        // Loyalty tier (from loyalty-points)
        if (user.loyaltyTier === 'Gold') score += 15;
        if (user.loyaltyTier === 'Platinum') score += 25;
        // Account age
        if (user.accountAgeMonths > 12) score += 10;
        else if (user.accountAgeMonths > 6) score += 5;
        return Math.min(100, score);
    }

    // Get badge based on engagement score
    function getEngagementBadge(score) {
        if (score >= 80) return { text: '🏆 Super Host', color: '#f59e0b' };
        if (score >= 50) return { text: '⭐ Engaged', color: '#10b981' };
        return { text: '🌱 New', color: '#94a3b8' };
    }

    window.AHSS.engagement.incentives.engagementScore = {
        calculateScore,
        getEngagementBadge
    };
})();