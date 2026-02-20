// js/services/airchef.js
// AirChef specific module – chef packages, pricing, menu

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};

(function() {
    const chefPackages = [
        { id: 1, name: 'Breakfast Delight', description: 'Continental breakfast', price: 25, serves: 2 },
        { id: 2, name: 'Lunch Special', description: '3-course lunch', price: 45, serves: 2 },
        { id: 3, name: 'Dinner Gourmet', description: '5-course dinner', price: 80, serves: 2 },
        { id: 4, name: 'Private Chef Full Day', description: 'All meals for the day', price: 200, serves: 4 }
    ];

    function getPackages() {
        return chefPackages;
    }

    function getPackage(id) {
        return chefPackages.find(p => p.id === id);
    }

    // Calculate price for given package and number of guests
    function calculatePrice(packageId, guests) {
        const pkg = getPackage(packageId);
        if (!pkg) return 0;
        // Base price is for 2; adjust proportionally
        const baseServes = pkg.serves || 2;
        return Math.ceil((pkg.price / baseServes) * guests);
    }

    // Render AirChef options in container
    function renderOptions(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        let html = '<h3>AirChef Packages</h3><div class="chef-grid">';
        chefPackages.forEach(pkg => {
            html += `
                <div class="chef-card" data-id="${pkg.id}">
                    <h4>${pkg.name}</h4>
                    <p>${pkg.description}</p>
                    <p class="price">$${pkg.price} (serves ${pkg.serves})</p>
                    <button class="add-chef" data-id="${pkg.id}">Add</button>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;

        container.querySelectorAll('.add-chef').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                // Add to core services
                const pkg = getPackage(parseInt(id));
                if (pkg) {
                    window.AHSS.services.core.addService('airchef', {
                        price: pkg.price,
                        quantity: 1,
                        details: pkg
                    });
                    alert(`Added ${pkg.name} to your booking`);
                }
            });
        });
    }

    window.AHSS.services.airchef = {
        getPackages,
        getPackage,
        calculatePrice,
        renderOptions
    };
})();