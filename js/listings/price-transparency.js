// js/listings/price-transparency.js
// Price breakdown: per night, total stay, savings, installment options

window.AHSS = window.AHSS || {};
window.AHSS.listings = window.AHSS.listings || {};

(function() {
    const priceTransparency = {
        // Calculate total stay price based on nights
        calculateTotal: function(pricePerNight, nights = 7) {
            return pricePerNight * nights;
        },

        // Calculate savings if crossed price exists
        calculateSavings: function(price, crossedPrice) {
            if (!crossedPrice || crossedPrice <= price) return 0;
            return crossedPrice - price;
        },

        // Render price breakdown block (used in property page)
        renderBreakdown: function(listing, nights = 7) {
            if (!listing) return '';
            const total = this.calculateTotal(listing.price, nights);
            const savings = this.calculateSavings(listing.price, listing.priceCrossed);
            const effectiveTotal = total - (listing.bonusValue || 0);

            return `
                <div class="price-breakdown">
                    <h4>Price details</h4>
                    <div class="breakdown-row">
                        <span>$${listing.price} x ${nights} nights</span>
                        <span>$${total}</span>
                    </div>
                    ${savings > 0 ? `
                    <div class="breakdown-row savings-row">
                        <span>✨ Savings</span>
                        <span>-$${savings}</span>
                    </div>` : ''}
                    ${listing.bonusValue ? `
                    <div class="breakdown-row bonus-row">
                        <span>🎁 Instant bonus</span>
                        <span>-$${listing.bonusValue}</span>
                    </div>` : ''}
                    <div class="breakdown-row total-row">
                        <strong>Total after bonus</strong>
                        <strong>$${effectiveTotal}</strong>
                    </div>
                    <div class="lipa-mdogo-prompt">
                        <p>Or pay in 4 installments of <strong>$${(effectiveTotal/4).toFixed(2)}</strong> with Lipa Mdogo</p>
                        <button class="lipa-btn-small" onclick="window.AHSS.payments?.lipaMdogo?.showModal(${effectiveTotal})">💰 Lipa Mdogo</button>
                    </div>
                </div>
            `;
        },

        // Update any price display with real-time (if needed)
        updatePrices: function() {
            // Could be used for dynamic pricing updates
        }
    };

    window.AHSS.listings.priceTransparency = priceTransparency;

    // Auto-attach to property page if exists
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.price-breakdown-placeholder')) {
            const listingId = new URLSearchParams(window.location.search).get('id');
            if (listingId) {
                const listing = window.AHSS.data?.getListingById(parseInt(listingId));
                if (listing) {
                    document.querySelector('.price-breakdown-placeholder').innerHTML = priceTransparency.renderBreakdown(listing);
                }
            }
        }
    });
})();