// js/services/airrelax.js
// AirRelax module – spa packages, wellness experiences

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};

(function() {
    const spaPackages = [
        { id: 1, name: 'Relaxing Massage', duration: 60, price: 50, description: 'Full body massage' },
        { id: 2, name: 'Facial Treatment', duration: 45, price: 40, description: 'Rejuvenating facial' },
        { id: 3, name: 'Spa Day Pass', duration: 240, price: 120, description: 'Access to spa facilities' },
        { id: 4, name: 'Couples Massage', duration: 60, price: 90, description: 'For two' }
    ];

    function getPackages() {
        return spaPackages;
    }

    function getPackage(id) {
        return spaPackages.find(p => p.id === id);
    }

    // Render AirRelax options
    function renderOptions(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        let html = '<h3>AirRelax Spa</h3><div class="spa-grid">';
        spaPackages.forEach(pkg => {
            html += `
                <div class="spa-card" data-id="${pkg.id}">
                    <h4>${pkg.name}</h4>
                    <p>${pkg.description}</p>
                    <p>${pkg.duration} min</p>
                    <p class="price">$${pkg.price}</p>
                    <button class="add-spa" data-id="${pkg.id}">Add</button>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;

        container.querySelectorAll('.add-spa').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                const pkg = getPackage(parseInt(id));
                if (pkg) {
                    window.AHSS.services.core.addService('airrelax', {
                        price: pkg.price,
                        quantity: 1,
                        details: pkg
                    });
                    alert(`Added ${pkg.name} to your booking`);
                }
            });
        });
    }

    window.AHSS.services.airrelax = {
        getPackages,
        getPackage,
        renderOptions
    };
})();