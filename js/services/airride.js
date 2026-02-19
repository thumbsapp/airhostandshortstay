// js/services/airride.js
// AirRide module – ride estimates, airport transfers, local transport

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};

(function() {
    const rideOptions = [
        { id: 'airport', name: 'Airport Transfer', basePrice: 25, perKm: 2, type: 'transfer' },
        { id: 'local', name: 'Local Ride', basePrice: 5, perKm: 1.5, type: 'ride' },
        { id: 'hourly', name: 'Hourly Rental', basePrice: 20, perHour: 20, type: 'rental' }
    ];

    function getRideOptions() {
        return rideOptions;
    }

    // Estimate price based on distance (km) and option
    function estimatePrice(optionId, distanceKm = 10, hours = 1) {
        const opt = rideOptions.find(o => o.id === optionId);
        if (!opt) return 0;
        if (opt.type === 'transfer') {
            return opt.basePrice + (distanceKm * opt.perKm);
        } else if (opt.type === 'ride') {
            return opt.basePrice + (distanceKm * opt.perKm);
        } else if (opt.type === 'rental') {
            return opt.basePrice * hours;
        }
        return 0;
    }

    // Simulate ETA calculation (using distance)
    function estimateETA(distanceKm, mode = 'driving') {
        const speed = mode === 'driving' ? 40 : 15; // km/h
        const hours = distanceKm / speed;
        const minutes = Math.round(hours * 60);
        return minutes;
    }

    // Render AirRide options
    function renderOptions(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        let html = '<h3>AirRide</h3><div class="ride-grid">';
        rideOptions.forEach(opt => {
            html += `
                <div class="ride-card" data-id="${opt.id}">
                    <h4>${opt.name}</h4>
                    <p>Base: $${opt.basePrice} + per km $${opt.perKm || 0}</p>
                    <label>Distance (km): <input type="number" class="ride-distance" value="10" min="1"></label>
                    <p class="ride-estimate">Est. $${estimatePrice(opt.id, 10)}</p>
                    <button class="add-ride" data-id="${opt.id}">Add</button>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;

        // Update estimate on distance change
        container.querySelectorAll('.ride-distance').forEach(input => {
            input.addEventListener('input', (e) => {
                const card = e.target.closest('.ride-card');
                const id = card.dataset.id;
                const distance = parseFloat(e.target.value) || 0;
                const price = estimatePrice(id, distance);
                card.querySelector('.ride-estimate').textContent = `Est. $${price}`;
            });
        });

        // Add button
        container.querySelectorAll('.add-ride').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.ride-card');
                const id = card.dataset.id;
                const distance = parseFloat(card.querySelector('.ride-distance').value) || 10;
                const price = estimatePrice(id, distance);
                const opt = rideOptions.find(o => o.id === id);
                window.AHSS.services.core.addService('airride', {
                    price: price,
                    quantity: 1,
                    details: { option: opt, distance }
                });
                alert(`Added ${opt.name} to your booking`);
            });
        });
    }

    window.AHSS.services.airride = {
        getRideOptions,
        estimatePrice,
        estimateETA,
        renderOptions
    };
})();