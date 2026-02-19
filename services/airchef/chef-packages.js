// services/airchef/chef-packages.js
// AirChef package definitions and management

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};
window.AHSS.services.airchef = window.AHSS.services.airchef || {};

(function() {
    const chefPackages = [
        {
            id: 'breakfast',
            name: 'Breakfast Delight',
            description: 'Continental or full English breakfast',
            price: 15,
            perPerson: true,
            minGuests: 1,
            maxGuests: 10,
            dietary: ['vegetarian', 'vegan', 'gluten-free']
        },
        {
            id: 'lunch',
            name: 'Gourmet Lunch',
            description: '3-course lunch with local ingredients',
            price: 35,
            perPerson: true,
            minGuests: 2,
            maxGuests: 8
        },
        {
            id: 'dinner',
            name: 'Chef’s Dinner',
            description: '5-course tasting menu',
            price: 65,
            perPerson: true,
            minGuests: 2,
            maxGuests: 6
        },
        {
            id: 'private-chef',
            name: 'Private Chef Full Day',
            description: 'Personal chef for the day, all meals included',
            price: 250,
            perPerson: false,
            maxGuests: 6,
            details: 'Chef will prepare breakfast, lunch, and dinner'
        }
    ];

    function getPackages() {
        return chefPackages;
    }

    function getPackage(id) {
        return chefPackages.find(p => p.id === id);
    }

    // Calculate price based on number of guests
    function calculatePrice(packageId, guests) {
        const pkg = getPackage(packageId);
        if (!pkg) return 0;
        if (pkg.perPerson) {
            return pkg.price * guests;
        }
        return pkg.price; // flat rate
    }

    window.AHSS.services.airchef.packages = {
        getPackages,
        getPackage,
        calculatePrice
    };
})();