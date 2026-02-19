// services/airrelax/spa-packages.js
// Spa package definitions and pricing

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};
window.AHSS.services.airrelax = window.AHSS.services.airrelax || {};

(function() {
    const spaPackages = [
        {
            id: 'massage-60',
            name: 'Relaxing Massage (60 min)',
            duration: 60,
            price: 60,
            description: 'Full body Swedish massage',
            includes: ['Aromatherapy oils', 'Hot towel']
        },
        {
            id: 'massage-90',
            name: 'Deep Tissue Massage (90 min)',
            duration: 90,
            price: 90,
            description: 'Intensive muscle relief',
            includes: ['Deep tissue techniques', 'Hot stones']
        },
        {
            id: 'facial',
            name: 'Rejuvenating Facial',
            duration: 45,
            price: 55,
            description: 'Cleansing, exfoliation, mask',
            includes: ['Skin analysis', 'Custom mask']
        },
        {
            id: 'body-scrub',
            name: 'Exfoliating Body Scrub',
            duration: 45,
            price: 50,
            description: 'Salt scrub with moisturizing',
            includes: ['Exfoliation', 'Hydrating lotion']
        },
        {
            id: 'couples-massage',
            name: 'Couples Massage (60 min)',
            duration: 60,
            price: 110,
            description: 'For two, in same room',
            includes: ['Champagne', 'Chocolates']
        }
    ];

    function getPackages() {
        return spaPackages;
    }

    function getPackage(id) {
        return spaPackages.find(p => p.id === id);
    }

    // Calculate total for multiple packages
    function calculateTotal(packageIds, quantities) {
        let total = 0;
        packageIds.forEach((id, index) => {
            const pkg = getPackage(id);
            if (pkg) total += pkg.price * (quantities[index] || 1);
        });
        return total;
    }

    window.AHSS.services.airrelax.spaPackages = {
        getPackages,
        getPackage,
        calculateTotal
    };
})();