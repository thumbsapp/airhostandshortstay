// listings/native-hosts/verification-badge.js
// Verification badge for native hosts (ID verified, phone, etc.)

window.AHSS = window.AHSS || {};
window.AHSS.listings = window.AHSS.listings || {};
window.AHSS.listings.native = window.AHSS.listings.native || {};

(function() {
    // Verification levels: 'verified', 'plus', 'pro'
    function getBadge(host, level = 'verified') {
        if (!host || !host.verified) return '';
        let icon = '✅';
        let text = 'Verified';
        let color = '#10b981';
        if (level === 'plus') {
            icon = '⭐';
            text = 'Verified Plus';
            color = '#f59e0b';
        } else if (level === 'pro') {
            icon = '👑';
            text = 'Pro Host';
            color = '#a855f7';
        }
        return `<span class="verified-badge" style="background:${color}20; color:${color};" title="Identity verified">${icon} ${text}</span>`;
    }

    // Add to card
    function addToCard(cardElement, host) {
        if (host?.verified) {
            const badge = getBadge(host);
            const header = cardElement.querySelector('.card-header') || cardElement;
            header.insertAdjacentHTML('beforeend', badge);
        }
    }

    window.AHSS.listings.native.verificationBadge = {
        getBadge,
        addToCard
    };
})();