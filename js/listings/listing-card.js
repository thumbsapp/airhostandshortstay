// js/listings/listing-card.js
// Individual listing card renderer with all incentives, badges, price transparency

window.AHSS = window.AHSS || {};
window.AHSS.listings = window.AHSS.listings || {};

(function() {
    const cardRenderer = {
        render: function(listing) {
            if (!listing) return '';

            // Determine availability class for badge
            const availabilityClass = listing.availability || 'available';
            const availabilityColor = availabilityClass === 'available' ? 'green' : (availabilityClass === 'almost_gone' ? 'amber' : 'red');

            // Incentive chips (max 3)
            const incentives = listing.incentives || [];
            const incentiveChips = incentives.slice(0, 3).map(inc => 
                `<span class="badge incentive-badge ${inc.category || 'financial'}">🎁 ${inc.title}</span>`
            ).join('');
            const extraIncentives = incentives.length > 3 ? `<span class="badge">+${incentives.length-3} more</span>` : '';

            // Tier badge
            const tierClass = listing.tier ? listing.tier.toLowerCase() : '';

            // Wishlist state
            const inWishlist = window.AHSS.state?.wishlist?.includes(listing.id) ? 'active' : '';

            // Price transparency: crossed price if available
            const crossedPrice = listing.priceCrossed ? `<span class="price-crossed">$${listing.priceCrossed}</span>` : '';
            const savings = listing.priceCrossed ? `<span class="savings">Save $${listing.priceCrossed - listing.price}</span>` : '';

            // Incentive score badge
            const score = listing.incentiveScore || 0;
            const scoreBadge = score > 0 ? `<span class="badge amber incentive-score">⭐ ${score}</span>` : '';

            // Fraud alert (if risk high)
            const fraudAlert = listing.fraudRiskScore && listing.fraudRiskScore > 70 ? 
                '<span class="fraud-alert">⚠️ High risk</span>' : '';

            return `
                <div class="listing-card-enhanced" data-id="${listing.id}">
                    <div class="card-image">
                        <img src="${listing.images?.[0] || 'https://picsum.photos/300/200?random='+listing.id}" alt="${listing.title}">
                        <span class="availability-badge ${availabilityColor}">${listing.availability?.replace('_',' ') || 'Available'}</span>
                        <span class="wishlist-icon ${inWishlist}">❤️</span>
                    </div>
                    <div class="card-content">
                        <div class="card-header">
                            <h4>${listing.title}</h4>
                            <span class="badge ${tierClass}">${listing.tier || 'Standard'}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-per-night">$${listing.price}</span> <span class="per-night">/night</span>
                            ${crossedPrice}
                            ${savings}
                        </div>
                        <div class="bonus-row">
                            <span class="bonus-chip">+$${listing.bonusValue || 0} bonus</span>
                            ${scoreBadge}
                            ${fraudAlert}
                        </div>
                        <div class="incentive-strip">
                            ${incentiveChips}
                            ${extraIncentives}
                        </div>
                        <div class="card-footer">
                            <div class="rating">⭐ ${listing.rating || 'New'} (${listing.reviewCount || 0})</div>
                            <label class="compare-label">
                                <input type="checkbox" class="compare-checkbox" value="${listing.id}" ${window.AHSS.state?.comparison?.includes(listing.id) ? 'checked' : ''}> Compare
                            </label>
                        </div>
                    </div>
                </div>
            `;
        }
    };

    window.AHSS.listings.card = cardRenderer;
})();