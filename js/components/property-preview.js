// /components/property-preview/property-preview.js
// This component dynamically updates the right panel when a listing is selected.
// It listens to state changes and renders the preview.

(function() {
    // Ensure AHSS namespace
    window.AHSS = window.AHSS || {};
    window.AHSS.components = window.AHSS.components || {};

    const previewContainer = document.getElementById('property-preview');

    function renderPreview(listing) {
        if (!previewContainer) return;
        if (!listing) {
            previewContainer.innerHTML = '<div class="preview-placeholder"><p>Select a property to preview</p></div>';
            return;
        }

        // Generate badges using existing modules
        const badges = window.AHSS.listings?.badges?.renderAll(listing) || '';
        const incentiveChips = window.AHSS.incentives?.ui?.renderChips(listing.incentives) || '';

        // Build HTML
        let html = `
            <div class="preview-content">
                <div class="preview-gallery">
                    <img src="${listing.images?.[0] || 'https://picsum.photos/400/300'}" alt="${listing.title}" class="preview-main-image">
                    <div class="thumbnail-strip">
                        ${listing.images?.slice(1,4).map(img => `<img src="${img}" class="thumbnail">`).join('') || ''}
                    </div>
                </div>
                <div class="preview-header">
                    <h3>${listing.title}</h3>
                    <div class="badge-container">${badges}</div>
                </div>
                <div class="preview-price-row">
                    <span class="price-per-night">$${listing.price}</span> <span>/night</span>
                    <span class="bonus-chip">+$${listing.bonusValue || 0} bonus</span>
                </div>
                <div class="preview-incentives">
                    ${incentiveChips}
                </div>
                <div class="preview-services">
                    <h4>Add services</h4>
                    <div class="services-mini">
                        <button class="service-add" data-service="airchef">🍽️ AirChef</button>
                        <button class="service-add" data-service="airride">🚗 AirRide</button>
                        <button class="service-add" data-service="airrelax">🧘 AirRelax</button>
                    </div>
                </div>
                <div class="preview-actions">
                    <button class="lipa-btn" onclick="window.AHSS.payments?.lipaMdogo?.showModal(${listing.price * 7})">💰 Lipa Mdogo</button>
                    <button class="negotiate-btn" onclick="window.AHSS.payments?.negotiation?.show(${listing.id})">🤝 Negotiate</button>
                </div>
            </div>
        `;
        previewContainer.innerHTML = html;
    }

    // Subscribe to state changes
    window.AHSS.app?.on('selected_property_changed', renderPreview);

    // Also expose method
    window.AHSS.components.propertyPreview = {
        render: renderPreview
    };
})();