// js/ui/animations.js
// Global animation triggers and helpers (countdowns, pulse, scroll effects)

window.AHSS = window.AHSS || {};
window.AHSS.ui = window.AHSS.ui || {};

(function() {
    // Start countdown timers on elements with class 'countdown'
    function initCountdowns() {
        document.querySelectorAll('.countdown').forEach(el => {
            const endTime = new Date(el.dataset.end).getTime();
            updateCountdown(el, endTime);
            setInterval(() => updateCountdown(el, endTime), 1000);
        });
    }

    function updateCountdown(el, endTime) {
        const now = new Date().getTime();
        const diff = endTime - now;
        if (diff <= 0) {
            el.textContent = 'Expired';
            return;
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        el.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }

    // Animate numbers (e.g., price counters)
    function animateNumber(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 10);
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                clearInterval(timer);
                current = end;
            }
            element.textContent = Math.round(current);
        }, 10);
    }

    // Trigger pulse effect on element
    function pulse(element) {
        element.classList.add('pulse-effect');
        setTimeout(() => element.classList.remove('pulse-effect'), 500);
    }

    // Shake element (for error)
    function shake(element) {
        element.classList.add('shake-effect');
        setTimeout(() => element.classList.remove('shake-effect'), 500);
    }

    // Fade in/out
    function fadeIn(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = 1;
    }

    function fadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = 0;
    }

    // Scroll to element smoothly
    function scrollTo(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset + rect.top - offset;
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }

    window.AHSS.ui.animations = {
        initCountdowns,
        animateNumber,
        pulse,
        shake,
        fadeIn,
        fadeOut,
        scrollTo
    };

    // Auto-init countdowns
    document.addEventListener('DOMContentLoaded', initCountdowns);
})();