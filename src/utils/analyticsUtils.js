import { posthog } from '../config/posthog';

/**
 * Enhanced analytics utility for Stevenson Space App.
 * Provides standardized methods for event tracking and error reporting.
 */

export const Analytics = {
    /**
     * Tracks a custom event with properties.
     * @param {string} eventName - Name of the event to track.
     * @param {Object} properties - Additional metadata for the event.
     */
    capture: (eventName, properties = {}) => {
        try {
            posthog.capture(eventName, properties);
        } catch (error) {
            console.warn('Analytics capture failed:', error);
        }
    },

    /**
     * Tracks an error event.
     * @param {Error|string} error - The error object or message.
     * @param {Object} context - Additional context where the error occurred.
     */
    trackError: (error, context = {}) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : null;

        console.error(`[Analytics Error] ${errorMessage}`, context);

        try {
            posthog.capture('app_error_occurred', {
                error_message: errorMessage,
                error_stack: errorStack,
                ...context,
            });
        } catch (captureError) {
            console.warn('Analytics error tracking failed:', captureError);
        }
    },

    /**
     * Standardized tracking for external link clicks.
     * @param {string} url - The URL being opened.
     * @param {string} name - Desciprtive name for the link.
     * @param {string} type - Category of link (e.g., 'resource', 'document', 'external').
     */
    trackLink: (url, name, type = 'external') => {
        Analytics.capture('external_link_clicked', {
            url,
            link_name: name,
            link_type: type,
        });
    },
};

export default Analytics;
