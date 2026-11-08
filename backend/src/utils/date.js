// Day boundaries follow the user's wall clock (default Asia/Jakarta), never UTC.
export const APP_TIMEZONE = process.env.APP_TIMEZONE || 'Asia/Jakarta';

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: APP_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** YYYY-MM-DD of an instant in the app timezone. */
export const dayKey = (date = new Date()) => dayFormatter.format(date);

const offsetMs = (instant) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TIMEZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
};

/** [start, end) instants covering the given YYYY-MM-DD in the app timezone. */
export const dayRange = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d));
  const start = new Date(guess.getTime() - offsetMs(guess));
  const nextGuess = new Date(Date.UTC(y, m - 1, d + 1));
  const end = new Date(nextGuess.getTime() - offsetMs(nextGuess));
  return { start, end };
};

/** Shift a YYYY-MM-DD key by n calendar days. */
export const addDays = (key, n) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};

/** 0=Sunday … 6=Saturday for a YYYY-MM-DD key. */
export const weekdayOf = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
};
