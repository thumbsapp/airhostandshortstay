// js/ui/loader.js
// Loader / spinner overlay and per‑element loading states

window.AHSS = window.AHSS || {};
window.AHSS.ui = window.AHSS.ui || {};

(function() {
    let loaderOverlay = null;
    let activeRequests = 0;

    function init() {
        if (!document.querySelector('.loader-overlay')) {
            loaderOverlay = document.createElement('div');
            loaderOverlay.className = 'loader-overlay';
            loaderOverlay.innerHTML = '<div class="spinner"></div><div class="loader-text">Loading...</div>';
            loaderOverlay.style.display = 'none';
            document.body.appendChild(loaderOverlay);
        } else {
            loaderOverlay = document.querySelector('.loader-overlay');
        }
    }

    function showLoader(text = 'Loading...') {
        init();
        activeRequests++;
        if (loaderOverlay.style.display === 'none') {
            loaderOverlay.querySelector('.loader-text').textContent = text;
            loaderOverlay.style.display = 'flex';
            setTimeout(() => loaderOverlay.classList.add('visible'), 10);
        }
    }

    function hideLoader() {
        activeRequests--;
        if (activeRequests <= 0) {
            activeRequests = 0;
            loaderOverlay.classList.remove('visible');
            setTimeout(() => loaderOverlay.style.display = 'none', 300);
        }
    }

    // Element‑specific loader (adds spinner inside element)
    function showElementLoader(element) {
        if (!element) return;
        element.classList.add('element-loading');
        // Disable pointer events
        element.style.pointerEvents = 'none';
        // If not already present, add spinner
        if (!element.querySelector('.element-spinner')) {
            const spinner = document.createElement('div');
            spinner.className = 'element-spinner';
            element.appendChild(spinner);
        }
    }

    function hideElementLoader(element) {
        if (!element) return;
        element.classList.remove('element-loading');
        element.style.pointerEvents = '';
        const spinner = element.querySelector('.element-spinner');
        if (spinner) spinner.remove();
    }

    window.AHSS.ui.loader = {
        show: showLoader,
        hide: hideLoader,
        showElement: showElementLoader,
        hideElement: hideElementLoader
    };
})();