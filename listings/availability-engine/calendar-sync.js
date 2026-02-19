// listings/availability-engine/calendar-sync.js
// Sync availability with external calendars (iCal, etc.)

window.AHSS = window.AHSS || {};
window.AHSS.listings = window.AHSS.listings || {};
window.AHSS.listings.availability = window.AHSS.listings.availability || {};

(function() {
    // Parse iCal feed (simplified)
    function parseICal(icalData) {
        // Mock: extract events
        const events = [];
        // Regex to find VEVENT blocks
        const veventRegex = /BEGIN:VEVENT(.*?)END:VEVENT/gs;
        let match;
        while ((match = veventRegex.exec(icalData)) !== null) {
            const block = match[1];
            const dtStart = block.match(/DTSTART(?:;VALUE=DATE)?:?(\d{8})/)?.[1];
            const dtEnd = block.match(/DTEND(?:;VALUE=DATE)?:?(\d{8})/)?.[1];
            if (dtStart && dtEnd) {
                events.push({
                    start: dtStart,
                    end: dtEnd
                });
            }
        }
        return events;
    }

    // Merge external calendar into listing's availability
    function mergeExternalCalendar(listing, externalEvents) {
        if (!listing.availabilityCalendar) listing.availabilityCalendar = {};
        externalEvents.forEach(event => {
            // Mark dates as unavailable
            // Simplified: store as blocked ranges
            if (!listing.availabilityCalendar.blocked) listing.availabilityCalendar.blocked = [];
            listing.availabilityCalendar.blocked.push({ start: event.start, end: event.end });
        });
    }

    window.AHSS.listings.availability.calendarSync = {
        parseICal,
        mergeExternalCalendar
    };
})();