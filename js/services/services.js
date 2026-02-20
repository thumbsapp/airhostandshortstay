// js/services/services.js
// Core services module – manages all lifestyle services (AirChef, AirRide, AirRelax, AirDuka)

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};

(function() {
    // Service definitions
    const serviceDefinitions = {
        airchef: {
            name: 'AirChef',
            icon: '🍽️',
            description: 'Personal chef experience',
            basePrice: 50,
            unit: 'per meal'
        },
        airride: {
            name: 'AirRide',
            icon: '🚗',
            description: 'Airport transfers and local rides',
            basePrice: 20,
            unit: 'per ride'
        },
        airrelax: {
            name: 'AirRelax',
            icon: '🧘',
            description: 'Spa and wellness packages',
            basePrice: 35,
            unit: 'per session'
        },
        airduka: {
            name: 'AirDuka',
            icon: '🛍️',
            description: 'Local market delivery',
            basePrice: 15,
            unit: 'per order'
        }
    };

    // Selected services for current booking
    let selectedServices = [];

    // Get service info
    function getServiceInfo(serviceKey) {
        return serviceDefinitions[serviceKey] || null;
    }

    // Get all services
    function getAllServices() {
        return serviceDefinitions;
    }

    // Add a service to current selection
    function addService(serviceKey, options = {}) {
        const service = getServiceInfo(serviceKey);
        if (!service) return false;
        selectedServices.push({
            key: serviceKey,
            name: service.name,
            price: options.price || service.basePrice,
            quantity: options.quantity || 1,
            details: options.details || {}
        });
        return true;
    }

    // Remove service
    function removeService(index) {
        if (index >= 0 && index < selectedServices.length) {
            selectedServices.splice(index, 1);
            return true;
        }
        return false;
    }

    // Get selected services
    function getSelectedServices() {
        return selectedServices;
    }

    // Calculate total cost of selected services
    function getTotalCost() {
        return selectedServices.reduce((sum, s) => sum + (s.price * s.quantity), 0);
    }

    // Clear all selected services
    function clearServices() {
        selectedServices = [];
    }

    // Render service options in a given container (for booking panel)
    function renderServiceOptions(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        let html = '<div class="services-grid">';
        Object.keys(serviceDefinitions).forEach(key => {
            const s = serviceDefinitions[key];
            html += `
                <div class="service-card" data-service="${key}">
                    <span class="service-icon">${s.icon}</span>
                    <span class="service-name">${s.name}</span>
                    <span class="service-price">$${s.basePrice} ${s.unit}</span>
                    <button class="add-service-btn" data-service="${key}">Add</button>
                </div>
            `;
        });
        html += '</div>';
        html += '<div class="selected-services-list"></div>';
        container.innerHTML = html;

        // Attach add buttons
        container.querySelectorAll('.add-service-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = btn.dataset.service;
                addService(key);
                updateSelectedServicesUI(container);
            });
        });
    }

    // Update the UI showing selected services
    function updateSelectedServicesUI(container) {
        const listContainer = container.querySelector('.selected-services-list');
        if (!listContainer) return;
        if (selectedServices.length === 0) {
            listContainer.innerHTML = '<p>No services added</p>';
            return;
        }
        let html = '<h4>Added services</h4>';
        selectedServices.forEach((s, index) => {
            html += `
                <div class="service-addon">
                    <span>${s.name} x${s.quantity}</span>
                    <span>$${s.price * s.quantity}</span>
                    <button class="remove-service" data-index="${index}">✕</button>
                </div>
            `;
        });
        html += `<div class="service-total">Total: $${getTotalCost()}</div>`;
        listContainer.innerHTML = html;

        // Attach remove handlers
        listContainer.querySelectorAll('.remove-service').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                removeService(index);
                updateSelectedServicesUI(container);
            });
        });
    }

    // Public API
    window.AHSS.services.core = {
        getServiceInfo,
        getAllServices,
        addService,
        removeService,
        getSelectedServices,
        getTotalCost,
        clearServices,
        renderServiceOptions
    };
})();