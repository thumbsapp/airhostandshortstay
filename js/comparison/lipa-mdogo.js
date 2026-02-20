// js/payments/lipa-mdogo.js
// Lipa Mdogo Mdogo – installment payment calculator and UI

window.AHSS = window.AHSS || {};
window.AHSS.payments = window.AHSS.payments || {};

(function() {
    const lipaMdogo = {
        modalElement: null,
        currentAmount: 0,

        init: function() {
            this.createModal();
            this.attachEvents();
        },

        createModal: function() {
            if (document.querySelector('#lipa-mdogo-modal')) return;
            this.modalElement = document.createElement('div');
            this.modalElement.id = 'lipa-mdogo-modal';
            this.modalElement.className = 'negotiation-modal'; // reuse style
            this.modalElement.style.display = 'none';
            this.modalElement.innerHTML = `
                <div class="negotiation-card">
                    <span class="close-modal">&times;</span>
                    <h3>💰 Lipa Mdogo Mdogo</h3>
                    <p>Pay in 4 interest-free installments</p>
                    <div id="installment-breakdown"></div>
                    <button id="lipa-now" class="lipa-btn">Proceed with Lipa Mdogo</button>
                    <button id="lipa-cancel" class="btn-outline">Cancel</button>
                </div>
            `;
            document.body.appendChild(this.modalElement);

            this.modalElement.querySelector('.close-modal').addEventListener('click', () => this.hide());
            document.getElementById('lipa-cancel')?.addEventListener('click', () => this.hide());
            document.getElementById('lipa-now')?.addEventListener('click', () => {
                alert('You have chosen Lipa Mdogo. You will be redirected to payment. (simulated)');
                this.hide();
            });
        },

        showModal: function(amount) {
            this.currentAmount = amount;
            this.calculateAndRender();
            this.modalElement.style.display = 'flex';
        },

        hide: function() {
            this.modalElement.style.display = 'none';
        },

        calculateAndRender: function() {
            const months = 4;
            const monthly = this.currentAmount / months;
            const breakdown = document.getElementById('installment-breakdown');
            let html = `<p><strong>Total: $${this.currentAmount.toFixed(2)}</strong></p>`;
            html += '<div class="installment-schedule">';
            for (let i = 1; i <= months; i++) {
                html += `<div class="installment-row">Month ${i}: $${monthly.toFixed(2)}</div>`;
            }
            html += '</div>';
            breakdown.innerHTML = html;
        },

        attachEvents: function() {
            // Attach to Lipa Mdogo buttons on property page and listing cards
            document.querySelectorAll('.lipa-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Try to get amount from context
                    let amount = 0;
                    const priceEl = document.querySelector('.price-per-night');
                    if (priceEl) {
                        const price = parseFloat(priceEl.textContent.replace('$', ''));
                        amount = price * 7; // assume 7 nights
                    }
                    if (amount === 0) amount = 180; // fallback
                    this.showModal(amount);
                });
            });
        }
    };

    window.AHSS.payments.lipaMdogo = lipaMdogo;

    document.addEventListener('DOMContentLoaded', () => {
        lipaMdogo.init();
    });
})();