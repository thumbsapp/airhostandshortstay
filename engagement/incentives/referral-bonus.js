// engagement/incentives/referral-bonus.js
// Referral program – track referrals and award bonuses

window.AHSS = window.AHSS || {};
window.AHSS.engagement = window.AHSS.engagement || {};
window.AHSS.engagement.incentives = window.AHSS.engagement.incentives || {};

(function() {
    const REFERRAL_BONUS_AMOUNT = 20; // $20 credit for referrer
    const REFERRED_BONUS_AMOUNT = 10; // $10 credit for new user

    let referrals = []; // { referrerId, referredEmail, status, date }

    // Generate referral link/code
    function generateReferralCode(userId) {
        return btoa(`${userId}-${Date.now()}`).substring(0, 8);
    }

    // Track a new referral when someone signs up with code
    function trackReferral(referrerId, referredEmail) {
        referrals.push({
            referrerId,
            referredEmail,
            status: 'pending', // pending, completed (after first booking)
            date: new Date().toISOString()
        });
        save();
    }

    // Mark referral as completed when referred user makes first booking
    function completeReferral(referredEmail) {
        const referral = referrals.find(r => r.referredEmail === referredEmail && r.status === 'pending');
        if (referral) {
            referral.status = 'completed';
            // Award bonuses (simulate)
            awardBonus(referral.referrerId, REFERRAL_BONUS_AMOUNT);
            awardBonus(referredEmail, REFERRED_BONUS_AMOUNT);
            save();
            return true;
        }
        return false;
    }

    function awardBonus(userId, amount) {
        console.log(`Awarded $${amount} to ${userId}`);
        // In real app, would update user's wallet or points
        window.AHSS.app?.emit('bonus_awarded', { userId, amount });
    }

    function save() {
        localStorage.setItem('referrals', JSON.stringify(referrals));
    }

    function load() {
        try {
            const stored = localStorage.getItem('referrals');
            if (stored) referrals = JSON.parse(stored);
        } catch (e) {}
    }

    window.AHSS.engagement.incentives.referralBonus = {
        generateReferralCode,
        trackReferral,
        completeReferral,
        load
    };

    load();
})();