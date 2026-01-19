import AsyncStorage from '@react-native-async-storage/async-storage';
import ICAL from 'ical.js';
import { format } from 'date-fns';
import staticEvents from '../data/events.json';

const EVENTS_STORAGE_KEY = 'stevenson_events_data';
const CALENDAR_URL = 'https://www.d125.org/data/calendar/icalcache/feed_E96D4A2A781C43699D5A4645042A0F79.ics';

/**
 * Fetches events from AsyncStorage, falling back to static data if not found.
 * Then attempts to fetch refreshing data from the network in the background.
 * @returns {Promise<{data: Object, isRemote: boolean}>}
 */
export const getEvents = async () => {
    let events = staticEvents;
    let isRemote = false;

    try {
        const cachedEvents = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
        if (cachedEvents) {
            events = JSON.parse(cachedEvents);
            isRemote = true;
        }
    } catch (error) {
        console.error('Error loading cached events:', error);
    }

    return { data: events, isRemote };
};

/**
 * Fetches the latest events from the D125 calendar feed.
 * Parses and saves them to AsyncStorage.
 * @returns {Promise<Object>} The fresh events object
 */
export const fetchAndCacheEvents = async () => {
    try {
        const response = await fetch(CALENDAR_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch calendar: ${response.status}`);
        }

        const icsText = await response.text();
        const parsedEvents = parseIcsData(icsText);

        // Only save if we got valid data
        if (Object.keys(parsedEvents).length > 0) {
            await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(parsedEvents));
            return parsedEvents;
        }
    } catch (error) {
        console.error('Error fetching/parsing events:', error);
        throw error;
    }
    return null;
};

/**
 * Parses raw ICS text into the app's event structure.
 * Logic mirrored from scraper/events.js
 */
const parseIcsData = (icsText) => {
    try {
        const jcalData = ICAL.parse(icsText);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');

        const processedEvents = {};

        vevents.forEach((vevent) => {
            const event = new ICAL.Event(vevent);

            // Skip recurring expansion for now as per original scraper logic which seemed to just take base events 
            // OR the feed handles expansion. The original scraper used ical.js simple parsing.
            // We will stick to the basic properties extraction.

            const startDate = event.startDate;
            const endDate = event.endDate;

            const processedEvent = {
                allDay: startDate.isDate,
                start: startDate.toJSDate().getTime(),
                end: endDate.toJSDate().getTime(),
                name: event.summary,
                description: (event.description || '').trim(),
                location: event.location,
                categories: []
            };

            // Extract categories
            // ical.Event higher level object might not expose categories array directly in the same way 
            // depending on version, so we fallback to component property access if needed.
            // But ICAL.Event usually mirrors the component.
            // The original scraper used: component.getAllProperties('categories')

            const categoryProps = vevent.getAllProperties('categories');
            const categories = [];

            categoryProps.forEach(prop => {
                const values = prop.getValues();
                values.forEach(v => categories.push(v));
            });

            processedEvent.categories = Array.from(new Set(categories));

            // Create date key (M/D/YYYY)
            // Use date-fns to ensure consistent "M/d/yyyy" format regardless of locale
            const dateKey = format(startDate.toJSDate(), 'M/d/yyyy');

            if (!processedEvents[dateKey]) {
                processedEvents[dateKey] = [];
            }
            processedEvents[dateKey].push(processedEvent);
        });

        return processedEvents;

    } catch (e) {
        console.error("Failed to parse ICS data", e);
        return {};
    }
};
