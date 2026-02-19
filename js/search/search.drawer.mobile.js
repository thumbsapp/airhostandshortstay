// js/search/search.drawer.mobile.js
// Mobile bottom sheet for filters, fullscreen map toggle, swipeable cards

window.AHSS = window.AHSS || {};
window.AHSS.search = window.AHSS.search || {};

(function() {
    const mobileDrawer = {
        sheetElement: null,
        mapToggleBtn: null,
        sheetOpen: false,

        init: function() {
            this.createBottomSheet();
            this.attachEvents();
        },

        createBottomSheet: function() {
            // Check if already exists
            if (document.querySelector('.bottom-sheet')) return;

            const sheet = document.createElement('div');
            sheet.className = 'bottom-sheet';
            sheet.innerHTML = `
                <div class="sheet-handle"></div>
                <div class="sheet-content">
                    <h3>Filters</h3>
                    <div class="filter-chips">
                        <span class="filter-chip active">Price</span>
                        <span class="filter-chip">Incentive</span>
                        <span class="filter-chip">Tier</span>
                        <span class="filter-chip">Amenities</span>
                    </div>
                    <div class="sheet-filters-placeholder">
                        <!-- Filter options would be dynamically loaded -->
                        <p>Filter options appear here</p>
                    </div>
                    <button class="btn-apply">Apply filters</button>
                </div>
            `;
            document.body.appendChild(sheet);
            this.sheetElement = sheet;

            // Add fullscreen map toggle
            const mapToggle = document.createElement('button');
            mapToggle.className = 'fullscreen-map-btn';
            mapToggle.innerHTML = '🗺️';
            document.body.appendChild(mapToggle);
            this.mapToggleBtn = mapToggle;
        },

        attachEvents: function() {
            // Handle sheet drag (simplified: click handle toggles)
            const handle = this.sheetElement?.querySelector('.sheet-handle');
            handle?.addEventListener('click', () => this.toggleSheet());

            // Map toggle
            this.mapToggleBtn?.addEventListener('click', () => {
                document.querySelector('.map-panel')?.classList.toggle('fullscreen');
                this.mapToggleBtn.classList.toggle('active');
            });

            // Close sheet when clicking apply
            this.sheetElement?.querySelector('.btn-apply')?.addEventListener('click', () => {
                this.closeSheet();
            });

            // Swipeable cards (simplified: add touch events)
            const cardsContainer = document.querySelector('.grid-cards');
            if (cardsContainer) {
                let touchStartX = 0;
                cardsContainer.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                }, { passive: true });
                cardsContainer.addEventListener('touchend', (e) => {
                    const diff = e.changedTouches[0].clientX - touchStartX;
                    if (Math.abs(diff) > 50) {
                        // Swipe left/right – could navigate pagination or carousel
                        if (diff > 0) {
                            console.log('swipe right');
                        } else {
                            console.log('swipe left');
                        }
                    }
                });
            }
        },

        toggleSheet: function() {
            if (this.sheetOpen) {
                this.closeSheet();
            } else {
                this.openSheet();
            }
        },

        openSheet: function() {
            this.sheetElement?.classList.add('open');
            this.sheetOpen = true;
        },

        closeSheet: function() {
            this.sheetElement?.classList.remove('open');
            this.sheetOpen = false;
        }
    };

    window.AHSS.search.mobileDrawer = mobileDrawer;

    // Initialize on mobile (if viewport width < 768)
    function checkMobile() {
        if (window.innerWidth < 768) {
            mobileDrawer.init();
        }
    }

    window.addEventListener('load', checkMobile);
    window.addEventListener('resize', () => {
        if (window.innerWidth < 768 && !document.querySelector('.bottom-sheet')) {
            mobileDrawer.init();
        }
    });
})();