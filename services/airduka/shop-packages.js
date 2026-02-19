// services/airduka/shop-packages.js
// AirDuka – local market shop packages (groceries, essentials)

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};
window.AHSS.services.airduka = window.AHSS.services.airduka || {};

(function() {
    const shopPackages = [
        {
            id: 'welcome-basket',
            name: 'Welcome Basket',
            price: 25,
            items: ['Fresh fruit', 'Bottled water', 'Snacks', 'Local coffee'],
            description: 'Perfect arrival package'
        },
        {
            id: 'breakfast-bundle',
            name: 'Breakfast Bundle',
            price: 30,
            items: ['Eggs', 'Bread', 'Milk', 'Cereal', 'Juice', 'Butter'],
            description: 'Enough for 2 days, serves 2'
        },
        {
            id: 'gourmet-dinner',
            name: 'Gourmet Dinner Kit',
            price: 60,
            items: ['Steak (2)', 'Vegetables', 'Wine', 'Dessert kit'],
            description: 'Cook a romantic dinner at home'
        },
        {
            id: 'kids-snack-pack',
            name: 'Kids Snack Pack',
            price: 20,
            items: ['Fruit snacks', 'Juice boxes', 'Cookies', 'Crayons & coloring book'],
            description: 'Keep little ones happy'
        }
    ];

    function getPackages() {
        return shopPackages;
    }

    function getPackage(id) {
        return shopPackages.find(p => p.id === id);
    }

    window.AHSS.services.airduka.shopPackages = {
        getPackages,
        getPackage
    };
})();