// pricing/tier-pricing/tier-display.js
// UI for displaying tier information on cards and property pages

window.AHSS = window.AHSS || {};
window.AHSS.pricing = window.AHSS.pricing || {};
window.AHSS.pricing.tier = window.AHSS.pricing.tier || {};

(function() {
    // Add tier badge to listing card (if not already present)
    function enhanceCard(cardElement, listing) {
        const tier = listing.tier || window.AHSS.pricing.tier.logic.assignTier(listing);
        const badgeHtml = window.AHSS.pricing.tier.benefits.renderTierBadge(tier);
        // Insert into card header
        const header = cardElement.querySelector('.card-header');
        if (header) {
            header.insertAdjacentHTML('beforeend', badgeHtml);
        }
    }

    // Render full tier breakdown on property page
    function renderTierBreakdown(container, listing) {
        const tier = listing.tier || window.AHSS.pricing.tier.logic.assignTier(listing);
        const benefits = window.AHSS.pricing.tier.benefits.getBenefits(tier);
        let html = `
            <div class="tier-breakdown">
                <h3>${benefits.badge} Benefits</h3>
                <ul>
        `;
        benefits.perks.forEach(perk => {
            html += `<li>${perk}</li>`;
        });
        html += `</ul></div>`;
        container.innerHTML = html;
    }

    // Apply tier styling to map pins (e.g., color)
    function getPinColor(tier) {
        const benefits = window.AHSS.pricing.tier.benefits.getBenefits(tier);
        return benefits.color;
    }

    window.AHSS.pricing.tier.display = {
        enhanceCard,
        renderTierBreakdown,
        getPinColor
    };
})();