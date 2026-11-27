const TZ = "Asia/Kolkata";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Returns today's date in India as 'YYYY-MM-DD'
export function todayIST(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// Returns today's weekday in India as a number: 0 = Sunday ... 6 = Saturday
export function weekdayIST(date = new Date()) {
  const short = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
  }).format(date);
  return WEEKDAYS.indexOf(short);
}
