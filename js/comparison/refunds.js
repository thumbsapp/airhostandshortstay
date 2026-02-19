// js/payments/refunds.js
// Refund logic, cancellation policies, and dispute integration

window.AHSS = window.AHSS || {};
window.AHSS.payments = window.AHSS.payments || {};

(function() {
    const refunds = {
        // Calculate refund amount based on policy and days before check-in
        calculateRefund: function(booking, daysBeforeCheckin) {
            // Simplified: if >7 days, full refund; 3-7 days 50%; <3 days no refund
            if (daysBeforeCheckin > 7) return booking.total;
            if (daysBeforeCheckin >= 3) return booking.total * 0.5;
            return 0;
        },

        // Show refund info on booking page
        renderRefundPolicy: function(container, policy = 'flexible') {
            const policies = {
                flexible: 'Full refund up to 7 days before check-in, 50% up to 3 days.',
                moderate: '50% refund up to 7 days, no refund after.',
                strict: 'No refunds.'
            };
            const html = `<div class="refund-policy"><strong>Cancellation policy:</strong> ${policies[policy] || policies.flexible}</div>`;
            if (container) container.innerHTML = html;
            else document.querySelector('.refund-policy-placeholder')?.innerHTML = html;
        },

        // Initiate refund (simulated)
        requestRefund: function(bookingId, reason) {
            console.log('Refund requested for', bookingId, reason);
            // In real app, would create a dispute or call API
            alert('Refund request submitted (simulated)');
        },

        // Integration with dispute center
        disputeRefund: function(bookingId) {
            window.location.href = `dispute-center.html?booking=${bookingId}`;
        }
    };

    window.AHSS.payments.refunds = refunds;
})();