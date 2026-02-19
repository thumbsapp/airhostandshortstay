// js/ui/modals.js
// Central modal management – open, close, stack, and reusable modal components

window.AHSS = window.AHSS || {};
window.AHSS.ui = window.AHSS.ui || {};

(function() {
    let modalStack = [];
    let backdrop = null;

    function init() {
        // Create backdrop if not exists
        if (!document.querySelector('.modal-backdrop')) {
            backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop';
            backdrop.style.display = 'none';
            backdrop.addEventListener('click', closeTopModal);
            document.body.appendChild(backdrop);
        }
    }

    function createBackdrop() {
        if (!backdrop) init();
        return backdrop;
    }

    function showModal(modalElement, options = {}) {
        init();
        if (!modalElement) return;
        
        // Add to stack
        modalStack.push(modalElement);
        
        // Style the modal
        modalElement.classList.add('active');
        modalElement.style.zIndex = 1000 + modalStack.length * 10;
        
        // Show backdrop if it's the first modal
        if (modalStack.length === 1) {
            backdrop.style.display = 'block';
            setTimeout(() => backdrop.classList.add('visible'), 10);
        }
        
        // Add close button if not present and options.allowClose
        if (options.allowClose !== false) {
            if (!modalElement.querySelector('.close-modal')) {
                const closeBtn = document.createElement('span');
                closeBtn.className = 'close-modal';
                closeBtn.innerHTML = '&times;';
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeModal(modalElement);
                });
                modalElement.prepend(closeBtn);
            }
        }
        
        // Emit event
        window.AHSS.app?.emit('modal_opened', modalElement);
    }

    function closeModal(modalElement) {
        const index = modalStack.indexOf(modalElement);
        if (index === -1) return;
        
        modalStack.splice(index, 1);
        modalElement.classList.remove('active');
        
        if (modalStack.length === 0) {
            backdrop.classList.remove('visible');
            setTimeout(() => backdrop.style.display = 'none', 300);
        } else {
            // Adjust z-index of remaining modals
            modalStack.forEach((modal, i) => {
                modal.style.zIndex = 1000 + (i + 1) * 10;
            });
        }
        
        window.AHSS.app?.emit('modal_closed', modalElement);
    }

    function closeTopModal() {
        if (modalStack.length > 0) {
            closeModal(modalStack[modalStack.length - 1]);
        }
    }

    function closeAllModals() {
        while (modalStack.length > 0) {
            closeModal(modalStack[0]);
        }
    }

    // Predefined modals
    function createAlertModal(message, title = 'Alert') {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="btn-apply modal-ok">OK</button>
            </div>
        `;
        modal.querySelector('.modal-ok').addEventListener('click', () => closeModal(modal));
        return modal;
    }

    function createConfirmModal(message, onConfirm, onCancel, title = 'Confirm') {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="modal-actions">
                    <button class="btn-outline modal-cancel">Cancel</button>
                    <button class="btn-apply modal-confirm">Confirm</button>
                </div>
            </div>
        `;
        modal.querySelector('.modal-cancel').addEventListener('click', () => {
            closeModal(modal);
            if (onCancel) onCancel();
        });
        modal.querySelector('.modal-confirm').addEventListener('click', () => {
            closeModal(modal);
            if (onConfirm) onConfirm();
        });
        return modal;
    }

    window.AHSS.ui.modals = {
        show: showModal,
        close: closeModal,
        closeTop: closeTopModal,
        closeAll: closeAllModals,
        alert: (msg, title) => showModal(createAlertModal(msg, title)),
        confirm: (msg, onConfirm, onCancel, title) => showModal(createConfirmModal(msg, onConfirm, onCancel, title))
    };

    // Auto-init
    document.addEventListener('DOMContentLoaded', init);
})();