// pricing/lipa-mdogo-engine/installment-calculator.js
// Calculate installments for Lipa Mdogo (interest‑free, with optional fees)

window.AHSS = window.AHSS || {};
window.AHSS.pricing = window.AHSS.pricing || {};
window.AHSS.pricing.lipaMdogo = window.AHSS.pricing.lipaMdogo || {};

(function() {
    const DEFAULT_INSTALLMENTS = 4;
    const PROCESSING_FEE_PERCENT = 0; // interest‑free

    function calculateInstallments(totalAmount, numInstallments = DEFAULT_INSTALLMENTS) {
        if (numInstallments <= 0) return null;
        const installmentAmount = totalAmount / numInstallments;
        return {
            totalAmount,
            numInstallments,
            installmentAmount: Math.round(installmentAmount * 100) / 100,
            processingFee: 0,
            schedule: []
        };
    }

    // With optional down payment
    function calculateWithDownPayment(totalAmount, downPaymentPercent = 0, numInstallments = DEFAULT_INSTALLMENTS) {
        const downPayment = (totalAmount * downPaymentPercent) / 100;
        const remaining = totalAmount - downPayment;
        const installmentAmount = remaining / numInstallments;
        return {
            totalAmount,
            downPayment: Math.round(downPayment * 100) / 100,
            numInstallments,
            installmentAmount: Math.round(installmentAmount * 100) / 100,
            remaining: Math.round(remaining * 100) / 100
        };
    }

    window.AHSS.pricing.lipaMdogo.installmentCalculator = {
        calculateInstallments,
        calculateWithDownPayment
    };
})();