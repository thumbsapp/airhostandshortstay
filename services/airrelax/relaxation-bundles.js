// services/airrelax/relaxation-bundles.js
// Bundled relaxation experiences (combine spa, yoga, meditation)

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};
window.AHSS.services.airrelax = window.AHSS.services.airrelax || {};

(function() {
    const bundles = [
        {
            id: 'wellness-day',
            name: 'Wellness Day Pass',
            price: 150,
            duration: 'full day',
            includes: ['60-min massage', 'Yoga class', 'Lunch', 'Pool access'],
            savings: 'Save $35'
        },
        {
            id: 'romantic-escape',
            name: 'Romantic Escape for Two',
            price: 250,
            duration: 'half day',
            includes: ['Couples massage', 'Champagne', 'Chocolate dipped strawberries', 'Private jacuzzi'],
            savings: 'Save $60'
        },
        {
            id: 'yoga-retreat',
            name: 'Yoga & Meditation Retreat',
            price: 80,
            duration: '3 hours',
            includes: ['Guided yoga', 'Meditation session', 'Herbal tea', 'Healthy snack'],
            savings: 'Save $20'
        }
    ];

    function getBundles() {
        return bundles;
    }

    function getBundle(id) {
        return bundles.find(b => b.id === id);
    }

    // Calculate discount compared to à la carte
    function calculateSavings(bundleId) {
        const bundle = getBundle(bundleId);
        return bundle ? bundle.savings : '';
    }

    window.AHSS.services.airrelax.relaxationBundles = {
        getBundles,
        getBundle,
        calculateSavings
    };
})();