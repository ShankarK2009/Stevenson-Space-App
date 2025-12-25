import { schedules } from "../data/schedules";

function parseDate(dateStr) {
  const [month, day, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function dateMatchesSchedule(date, scheduleDates) {
  const dayOfWeek = date.getDay();
  const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  for (const datePattern of scheduleDates) {
    if (datePattern === "weekdays" && dayOfWeek >= 1 && dayOfWeek <= 5) {
      return true;
    }

    if (datePattern === "weekends" && (dayOfWeek === 0 || dayOfWeek === 6)) {
      return true;
    }

    if (datePattern.includes("-")) {
      const [startStr, endStr] = datePattern.split("-");
      const start = parseDate(startStr);
      const end = parseDate(endStr);
      if (date >= start && date <= end) {
        return true;
      }
    }

    if (datePattern === dateString) {
      return true;
    }
  }

  return false;
}

export function getScheduleForDate(date = new Date()) {
  const specialSchedules = schedules.filter(
    (s) => s.isSpecial && dateMatchesSchedule(date, s.dates),
  );
  const regularSchedules = schedules.filter(
    (s) => !s.isSpecial && dateMatchesSchedule(date, s.dates),
  );

  const matchingSchedule = specialSchedules[0] || regularSchedules[0];

  if (!matchingSchedule || matchingSchedule.modes.length === 0) {
    return null;
  }

  const mode = matchingSchedule.modes[0];

  return {
    name: matchingSchedule.name,
    isSpecial: matchingSchedule.isSpecial,
    mode: mode.name,
    periods: mode.periods,
    startTimes: mode.start,
    endTimes: mode.end,
  };
}

function parseTime(timeStr, date) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function getCurrentPeriodInfo(date = new Date()) {
  const schedule = getScheduleForDate(date);

  if (!schedule) {
    return {
      currentPeriod: null,
      nextPeriod: null,
      timeRemaining: null,
      timeUntilNext: null,
      isSchoolDay: false,
      schedule: null,
    };
  }

  const now = date;
  const periodData = [];

  for (let i = 0; i < schedule.periods.length; i++) {
    const period = Array.isArray(schedule.periods[i])
      ? schedule.periods[i][0]
      : schedule.periods[i];
    const startTime = parseTime(schedule.startTimes[i], now);
    const endTime = parseTime(schedule.endTimes[i], now);

    periodData.push({
      period,
      startTime,
      endTime,
      index: i,
    });
  }

  let currentPeriod = null;
  let nextPeriod = null;

  for (let i = 0; i < periodData.length; i++) {
    const pd = periodData[i];

    if (now >= pd.startTime && now < pd.endTime) {
      currentPeriod = pd;
      nextPeriod = periodData[i + 1] || null;
      break;
    } else if (now < pd.startTime) {
      nextPeriod = pd;
      break;
    }
  }

  let timeRemaining = null;
  let timeUntilNext = null;

  if (currentPeriod) {
    const msRemaining = currentPeriod.endTime - now;
    timeRemaining = Math.floor(msRemaining / 1000);
  }

  if (nextPeriod && !currentPeriod) {
    const msUntilNext = nextPeriod.startTime - now;
    timeUntilNext = Math.floor(msUntilNext / 1000);
  }

  return {
    currentPeriod: currentPeriod ? currentPeriod.period : null,
    nextPeriod: nextPeriod ? nextPeriod.period : null,
    timeRemaining,
    timeUntilNext,
    isSchoolDay: true,
    schedule,
    allPeriods: periodData,
  };
}

export function formatTime(seconds) {
  if (seconds === null || seconds < 0) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function formatDisplayTime(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function getLunchDayNumber(date = new Date()) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24));
  return (dayOfYear % 26) + 1;
}
