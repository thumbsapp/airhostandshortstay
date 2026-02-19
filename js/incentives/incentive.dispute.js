// js/incentives/incentive.dispute.js
// Dispute center integration for incentive-related issues

window.AHSS = window.AHSS || {};
window.AHSS.incentives = window.AHSS.incentives || {};

(function() {
    const dispute = {
        init: function() {
            if (!document.querySelector('.dispute-container')) return;
            this.addIncentiveDisputeInfo();
        },

        addIncentiveDisputeInfo: function() {
            const container = document.querySelector('.dispute-container');
            const disputeList = container?.querySelector('.dispute-list') || container;

            const incentiveBlock = document.createElement('div');
            incentiveBlock.className = 'incentive-dispute-section';
            incentiveBlock.innerHTML = `
                <h3>Incentive disputes</h3>
                <p>If an incentive was not honored, you can report it here.</p>
                <button id="report-incentive-issue" class="btn-outline">Report incentive issue</button>
                <div id="incentive-dispute-modal" style="display:none;">
                    <select id="dispute-listing">
                        <option>Select booking</option>
                    </select>
                    <textarea placeholder="Describe the issue..."></textarea>
                    <button id="submit-incentive-dispute">Submit</button>
                </div>
            `;
            container?.appendChild(incentiveBlock);

            document.getElementById('report-incentive-issue')?.addEventListener('click', () => {
                const modal = document.getElementById('incentive-dispute-modal');
                modal.style.display = 'block';
            });

            document.getElementById('submit-incentive-dispute')?.addEventListener('click', () => {
                alert('Dispute submitted (simulated)');
                document.getElementById('incentive-dispute-modal').style.display = 'none';
            });
        },

        // Check if a booking has incentive disputes
        getDisputeStatus: function(bookingId) {
            // Mock
            return { hasDispute: false };
        }
    };

    window.AHSS.incentives.dispute = dispute;

    document.addEventListener('DOMContentLoaded', () => {
        dispute.init();
    });
})();