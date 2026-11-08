// Dates follow the same wall clock as the backend (APP_TIMEZONE), regardless of the browser's zone.
const TZ = 'Asia/Jakarta';
const LOCALE = 'id-ID';

export const formatDate = (date = new Date(), style = 'short') =>
  new Intl.DateTimeFormat(LOCALE, {
    timeZone: TZ,
    weekday: 'long',
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  }).format(new Date(date));

export const formatPublishDate = (date) =>
  new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(date)
  );

export const formatTime = (date) =>
  new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .format(new Date(date))
    .replace(':', '.');

export const getGreeting = (date = new Date()) => {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', hourCycle: 'h23' }).format(date)
  );
  if (hour < 11) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
};

export const formatNumber = (n) => Number(n || 0).toLocaleString(LOCALE);

export const initialsOf = (name = '') => {
  const cleaned = name.replace(/^(dr\.|Coach)\s+/i, '').replace(/,\s*.*$/, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'HL';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const ACTIVITY_ICON_TONE = {
  Olahraga: 'sport',
  Nutrisi: 'food',
  Hidrasi: 'water',
  Langkah: 'sport',
};
export const activityTone = (category) => ACTIVITY_ICON_TONE[category] || 'sport';

/** One-line "20 mnt, 95 kkal" style detail that only mentions what the category actually records. */
export const activityDetail = (a) => {
  if (a.category === 'Hidrasi') return `${formatNumber(a.amountMl)} ml air`;
  if (a.category === 'Nutrisi') return `${formatNumber(a.calories)} kkal asupan`;
  const parts = [];
  if (a.durationMinutes) parts.push(`${a.durationMinutes} mnt`);
  if (a.calories) parts.push(`${formatNumber(a.calories)} kkal terbakar`);
  return parts.join(', ') || 'Tercatat';
};

const dayKeyOf = (date) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date(date));

/** "Hari ini" / "Kemarin" / "7 Nov" */
export const relativeDay = (date) => {
  const key = dayKeyOf(date);
  const now = new Date();
  if (key === dayKeyOf(now)) return 'Hari ini';
  if (key === dayKeyOf(new Date(now.getTime() - 24 * 3600 * 1000))) return 'Kemarin';
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, day: 'numeric', month: 'short' }).format(new Date(date));
};
