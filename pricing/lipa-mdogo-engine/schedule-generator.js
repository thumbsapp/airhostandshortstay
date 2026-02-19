// pricing/lipa-mdogo-engine/schedule-generator.js
// Generate payment schedule with due dates

window.AHSS = window.AHSS || {};
window.AHSS.pricing = window.AHSS.pricing || {};
window.AHSS.pricing.lipaMdogo = window.AHSS.pricing.lipaMdogo || {};

(function() {
    function generateSchedule(totalAmount, startDate = new Date(), numInstallments = 4, intervalDays = 30) {
        const base = window.AHSS.pricing.lipaMdogo.installmentCalculator.calculateInstallments(totalAmount, numInstallments);
        const schedule = [];
        let dueDate = new Date(startDate);
        for (let i = 0; i < numInstallments; i++) {
            schedule.push({
                installment: i + 1,
                amount: base.installmentAmount,
                dueDate: new Date(dueDate),
                status: 'pending'
            });
            dueDate.setDate(dueDate.getDate() + intervalDays);
        }
        return {
            ...base,
            schedule
        };
    }

    // Format dates for display
    function formatSchedule(schedule) {
        return schedule.map(item => ({
            ...item,
            dueDateFormatted: item.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }));
    }

    window.AHSS.pricing.lipaMdogo.scheduleGenerator = {
        generateSchedule,
        formatSchedule
    };
})();