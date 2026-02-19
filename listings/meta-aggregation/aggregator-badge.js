// listings/meta-aggregation/aggregator-badge.js
// Badge indicating whether listing is native or aggregated from external source

window.AHSS = window.AHSS || {};
window.AHSS.listings = window.AHSS.listings || {};
window.AHSS.listings.meta = window.AHSS.listings.meta || {};

(function() {
    // Types: 'native' (direct host) or 'aggregated' (from partner)
    function getBadge(listing) {
        if (listing.source === 'native') {
            return '<span class="badge native-badge" title="Direct from host">🏠 Native</span>';
        } else if (listing.source === 'aggregated') {
            return '<span class="badge aggregated-badge" title="Partner listing">🔗 Aggregated</span>';
        }
        return '';
    }

    // Add badge to card
    function addToCard(cardElement, listing) {
        const badge = getBadge(listing);
        if (badge) {
            const header = cardElement.querySelector('.card-header') || cardElement;
            header.insertAdjacentHTML('beforeend', badge);
        }
    }

    window.AHSS.listings.meta.aggregatorBadge = {
        getBadge,
        addToCard
    };
})();