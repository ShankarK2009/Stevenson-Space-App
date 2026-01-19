import pwcSchedule from "../data/pwcSchedule.json";

export function getPWCStatus(date) {
    const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    // Check exceptions first
    if (pwcSchedule.exceptions[dateString]) {
        const hours = pwcSchedule.exceptions[dateString];
        if (hours === "Closed") {
            return { isOpen: false, hours: "Closed" };
        }
        return { isOpen: true, hours: hours, isSpecial: true };
    }

    // Fallback to regular hours
    const dayOfWeek = date.getDay().toString();
    const hours = pwcSchedule.regularHours[dayOfWeek];

    if (!hours) {
        // Should not happen if all days covered, but assume closed if missing
        return { isOpen: false, hours: "Closed" };
    }

    return { isOpen: true, hours: hours, isSpecial: false };
}
