// pricing/tier-pricing/tier-benefits.js
// Tier benefits – what each tier gets (discounts, perks, visibility)

window.AHSS = window.AHSS || {};
window.AHSS.pricing = window.AHSS.pricing || {};
window.AHSS.pricing.tier = window.AHSS.pricing.tier || {};

(function() {
    const TIER_BENEFITS = {
        Diamond: {
            badge: '💎 Diamond',
            color: '#a855f7',
            perks: [
                '5% cashback on all bookings',
                'Free airport transfer (once per stay)',
                'Priority customer support',
                'Exclusive access to Diamond-only homes'
            ],
            discount: 0.05,
            visibilityBoost: 1.5
        },
        Gold: {
            badge: '🥇 Gold',
            color: '#f59e0b',
            perks: [
                '3% cashback on bookings',
                'Free spa kit',
                'Early check-in (subject to availability)'
            ],
            discount: 0.03,
            visibilityBoost: 1.2
        },
        Silver: {
            badge: '🥈 Silver',
            color: '#94a3b8',
            perks: [
                '1% cashback on bookings',
                'Welcome drink'
            ],
            discount: 0.01,
            visibilityBoost: 1.0
        }
    };

    function getBenefits(tier) {
        return TIER_BENEFITS[tier] || TIER_BENEFITS.Silver;
    }

    // Apply tier discount to price (e.g., for cashback)
    function applyDiscount(price, tier) {
        const benefits = getBenefits(tier);
        return price * (1 - benefits.discount);
    }

    // Render tier badge with tooltip
    function renderTierBadge(tier, withTooltip = true) {
        const benefits = getBenefits(tier);
        const tooltipAttr = withTooltip ? `title="${benefits.perks.join(' · ')}"` : '';
        return `<span class="tier-badge ${tier.toLowerCase()}" ${tooltipAttr} style="background:${benefits.color}20; color:${benefits.color};">${benefits.badge}</span>`;
    }

    window.AHSS.pricing.tier.benefits = {
        getBenefits,
        applyDiscount,
        renderTierBadge
    };
})();