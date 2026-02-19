// engagement/incentives/loyalty-points.js
// Loyalty points system – earn points from bookings, redeem for rewards

window.AHSS = window.AHSS || {};
window.AHSS.engagement = window.AHSS.engagement || {};
window.AHSS.engagement.incentives = window.AHSS.engagement.incentives || {};

(function() {
    const POINTS_PER_DOLLAR = 10;
    const TIER_THRESHOLDS = {
        Silver: 0,
        Gold: 1000,
        Platinum: 5000
    };

    let userPoints = 0;
    let userTier = 'Silver';

    // Load from storage
    function load(userId) {
        try {
            const stored = localStorage.getItem(`loyalty_${userId}`);
            if (stored) {
                const data = JSON.parse(stored);
                userPoints = data.points || 0;
                userTier = data.tier || 'Silver';
            }
        } catch (e) {}
    }

    function save(userId) {
        localStorage.setItem(`loyalty_${userId}`, JSON.stringify({ points: userPoints, tier: userTier }));
    }

    // Add points from booking
    function addPointsFromBooking(bookingTotal) {
        const points = Math.floor(bookingTotal * POINTS_PER_DOLLAR);
        userPoints += points;
        updateTier();
        return points;
    }

    // Redeem points for discount
    function redeemPoints(points, bookingTotal) {
        if (points > userPoints) return null;
        const discount = points / 100; // 100 points = $1
        if (discount > bookingTotal) return null; // cannot exceed booking total
        userPoints -= points;
        updateTier();
        return discount;
    }

    function updateTier() {
        if (userPoints >= TIER_THRESHOLDS.Platinum) userTier = 'Platinum';
        else if (userPoints >= TIER_THRESHOLDS.Gold) userTier = 'Gold';
        else userTier = 'Silver';
    }

    function getTier() {
        return userTier;
    }

    function getPoints() {
        return userPoints;
    }

    window.AHSS.engagement.incentives.loyaltyPoints = {
        load,
        save,
        addPointsFromBooking,
        redeemPoints,
        getTier,
        getPoints
    };
})();