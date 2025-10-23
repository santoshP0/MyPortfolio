export const MS_PER_MINUTE = 60 * 1000;
export const DEFAULT_MINUTES_PER_XP = 60 * 24;

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const getLevelFromDates = (startDate, currentDate) => {
  if (!startDate || Number.isNaN(startDate.getTime())) {
    return 1;
  }
  if (!currentDate || Number.isNaN(currentDate.getTime()) || currentDate <= startDate) {
    return 1;
  }

  const startMonth = startDate.getUTCMonth();
  const startDay = startDate.getUTCDate();
  const currentYear = currentDate.getUTCFullYear();

  let level = currentYear - startDate.getUTCFullYear();
  const anniversaryThisYear = new Date(Date.UTC(currentYear, startMonth, startDay));

  if (currentDate < anniversaryThisYear) {
    level -= 1;
  }

  return Math.max(level + 1, 1);
};

const getLevelBoundaries = (startDate, currentDate) => {
  const safeStart = startDate ?? new Date();
  const month = safeStart.getUTCMonth();
  const day = safeStart.getUTCDate();
  const referenceYear = (currentDate && !Number.isNaN(currentDate.getTime()))
    ? currentDate.getUTCFullYear()
    : safeStart.getUTCFullYear();

  let levelStartUtc = Date.UTC(referenceYear, month, day);
  const currentTime = currentDate ? currentDate.getTime() : safeStart.getTime();

  if (currentTime < levelStartUtc) {
    levelStartUtc = Date.UTC(referenceYear - 1, month, day);
  }

  if (levelStartUtc < safeStart.getTime()) {
    levelStartUtc = safeStart.getTime();
  }

  const levelStart = new Date(levelStartUtc);
  const nextLevelStart = new Date(Date.UTC(levelStart.getUTCFullYear() + 1, month, day));

  return { levelStart, nextLevelStart };
};

const minutesBetween = (end, start) => {
  if (!end || !start || Number.isNaN(end.getTime()) || Number.isNaN(start.getTime())) {
    return 0;
  }
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / MS_PER_MINUTE));
};

export const computeExperience = (startDateInput, currentDateInput, minutesPerXpInput) => {
  const startDate = parseDate(startDateInput);
  const currentDate = currentDateInput ? new Date(currentDateInput) : new Date();
  const minutesPerXp = minutesPerXpInput && minutesPerXpInput > 0 ? minutesPerXpInput : DEFAULT_MINUTES_PER_XP;

  if (!startDate || currentDate <= startDate) {
    const baseline = startDate ?? new Date();
    const { nextLevelStart } = getLevelBoundaries(baseline, baseline);
    const levelDurationMinutes = Math.max(minutesBetween(nextLevelStart, baseline), minutesPerXp);
    const xpPerLevel = Math.max(Math.floor(levelDurationMinutes / minutesPerXp), 1);
    return {
      totalXp: 0,
      level: 1,
      xpIntoLevel: 0,
      xpRemaining: xpPerLevel,
      xpPerLevel,
      percent: 0,
      startDate: baseline,
      currentDate,
    };
  }

  const totalMinutes = minutesBetween(currentDate, startDate);
  const totalXp = Math.floor(totalMinutes / minutesPerXp);
  const level = getLevelFromDates(startDate, currentDate);

  const { levelStart, nextLevelStart } = getLevelBoundaries(startDate, currentDate);
  const levelElapsedMinutes = minutesBetween(currentDate, levelStart);
  const levelDurationMinutes = Math.max(minutesBetween(nextLevelStart, levelStart), minutesPerXp);
  const xpPerLevel = Math.max(Math.floor(levelDurationMinutes / minutesPerXp), 1);
  const xpIntoLevel = Math.min(Math.floor(levelElapsedMinutes / minutesPerXp), xpPerLevel);
  const xpRemaining = Math.max(xpPerLevel - xpIntoLevel, 0);
  const percent = xpPerLevel > 0 ? (xpIntoLevel / xpPerLevel) * 100 : 0;

  return {
    totalXp,
    level,
    xpIntoLevel,
    xpRemaining,
    xpPerLevel,
    percent,
    startDate,
    currentDate,
    levelStart,
    nextLevelStart,
  };
};
