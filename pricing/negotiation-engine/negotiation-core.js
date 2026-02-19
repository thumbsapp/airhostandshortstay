// pricing/negotiation-engine/negotiation-core.js
// Core negotiation management – offers, counters, acceptance

window.AHSS = window.AHSS || {};
window.AHSS.pricing = window.AHSS.pricing || {};
window.AHSS.pricing.negotiation = window.AHSS.pricing.negotiation || {};

(function() {
    let activeNegotiations = new Map(); // listingId -> { offers, status }

    function initNegotiation(listingId, initialPrice) {
        activeNegotiations.set(listingId, {
            listingId,
            originalPrice: initialPrice,
            offers: [],
            status: 'open', // open, accepted, rejected, countered
            counterOffer: null
        });
    }

    function submitOffer(listingId, offerAmount, guestId) {
        if (!activeNegotiations.has(listingId)) {
            const listing = window.AHSS.data?.getListingById(listingId);
            if (!listing) return { success: false, error: 'Listing not found' };
            initNegotiation(listingId, listing.price);
        }
        const negotiation = activeNegotiations.get(listingId);
        
        // Validate offer
        const validation = window.AHSS.pricing.negotiation.offerValidation?.validate(offerAmount, negotiation.originalPrice);
        if (!validation.valid) {
            return { success: false, error: validation.reason };
        }

        // Add offer
        const offer = {
            amount: offerAmount,
            guestId,
            timestamp: Date.now(),
            status: 'pending'
        };
        negotiation.offers.push(offer);
        
        // Simulate host response (could be async)
        setTimeout(() => {
            const response = window.AHSS.pricing.negotiation.counterOfferLogic?.generateResponse(negotiation, offer);
            if (response.accepted) {
                negotiation.status = 'accepted';
                window.AHSS.app?.emit('negotiation_accepted', { listingId, amount: offerAmount });
            } else if (response.counterOffer) {
                negotiation.status = 'countered';
                negotiation.counterOffer = response.counterOffer;
                window.AHSS.app?.emit('negotiation_countered', { listingId, counterOffer: response.counterOffer });
            } else {
                negotiation.status = 'rejected';
                window.AHSS.app?.emit('negotiation_rejected', { listingId });
            }
        }, 2000);

        return { success: true, message: 'Offer sent' };
    }

    function acceptCounter(listingId) {
        const negotiation = activeNegotiations.get(listingId);
        if (!negotiation || negotiation.status !== 'countered') return false;
        negotiation.status = 'accepted';
        window.AHSS.app?.emit('negotiation_accepted', { listingId, amount: negotiation.counterOffer });
        return true;
    }

    function rejectCounter(listingId) {
        const negotiation = activeNegotiations.get(listingId);
        if (!negotiation) return false;
        negotiation.status = 'rejected';
        window.AHSS.app?.emit('negotiation_rejected', { listingId });
        return true;
    }

    function getNegotiationStatus(listingId) {
        return activeNegotiations.get(listingId) || null;
    }

    window.AHSS.pricing.negotiation.core = {
        initNegotiation,
        submitOffer,
        acceptCounter,
        rejectCounter,
        getNegotiationStatus
    };
})();