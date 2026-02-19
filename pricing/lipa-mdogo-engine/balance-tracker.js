// pricing/lipa-mdogo-engine/balance-tracker.js
// Track remaining balance and payment status for Lipa Mdogo

window.AHSS = window.AHSS || {};
window.AHSS.pricing = window.AHSS.pricing || {};
window.AHSS.pricing.lipaMdogo = window.AHSS.pricing.lipaMdogo || {};

(function() {
    let activePlans = new Map(); // bookingId -> plan details

    function createPlan(bookingId, totalAmount, numInstallments = 4) {
        const schedule = window.AHSS.pricing.lipaMdogo.scheduleGenerator.generateSchedule(totalAmount, new Date(), numInstallments);
        const plan = {
            bookingId,
            totalAmount,
            paidAmount: 0,
            remaining: totalAmount,
            schedule: schedule.schedule,
            status: 'active' // active, completed, defaulted
        };
        activePlans.set(bookingId, plan);
        return plan;
    }

    function recordPayment(bookingId, amount) {
        const plan = activePlans.get(bookingId);
        if (!plan) return false;
        plan.paidAmount += amount;
        plan.remaining -= amount;

        // Update the next pending installment
        const nextPending = plan.schedule.find(s => s.status === 'pending');
        if (nextPending) {
            nextPending.status = 'paid';
            nextPending.paidDate = new Date();
        }

        if (plan.remaining <= 0) {
            plan.status = 'completed';
        }
        return true;
    }

    function getRemainingBalance(bookingId) {
        const plan = activePlans.get(bookingId);
        return plan ? plan.remaining : 0;
    }

    function getPlan(bookingId) {
        return activePlans.get(bookingId);
    }

    window.AHSS.pricing.lipaMdogo.balanceTracker = {
        createPlan,
        recordPayment,
        getRemainingBalance,
        getPlan
    };
})();