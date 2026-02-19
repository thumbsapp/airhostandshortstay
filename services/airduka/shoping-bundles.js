// services/airduka/shoping-bundles.js
// Shopping bundles – combine multiple shop packages or custom orders

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};
window.AHSS.services.airduka = window.AHSS.services.airduka || {};

(function() {
    const shoppingBundles = [
        {
            id: 'full-pantry',
            name: 'Full Pantry Stock',
            price: 120,
            includes: ['Welcome Basket', 'Breakfast Bundle', 'Gourmet Dinner Kit', 'Kids Snack Pack'],
            description: 'Everything for a week'
        },
        {
            id: 'date-night',
            name: 'Date Night Special',
            price: 75,
            includes: ['Gourmet Dinner Kit', 'Wine (premium)', 'Chocolate'],
            description: 'Romance package'
        }
    ];

    function getBundles() {
        return shoppingBundles;
    }

    function getBundle(id) {
        return shoppingBundles.find(b => b.id === id);
    }

    // Create custom bundle from selected packages
    function createCustomBundle(packageIds) {
        const packages = packageIds.map(id => window.AHSS.services.airduka.shopPackages.getPackage(id)).filter(p => p);
        const total = packages.reduce((sum, p) => sum + p.price, 0);
        const items = packages.flatMap(p => p.items);
        return {
            name: 'Custom Bundle',
            price: total,
            items: items,
            packageCount: packages.length
        };
    }

    window.AHSS.services.airduka.shoppingBundles = {
        getBundles,
        getBundle,
        createCustomBundle
    };
})();