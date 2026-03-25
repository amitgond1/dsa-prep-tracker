import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";

const intervals = [3, 7, 14, 30, 60];

export function getNextSolveDate(solveCount, fromDate = new Date()) {
  const normalizedSolveCount = Math.max(1, solveCount);
  const days = intervals[Math.min(normalizedSolveCount - 1, intervals.length - 1)];
  return startOfDay(addDays(fromDate, days));
}

export function getRevisionStatus(nextSolveDate, now = new Date()) {
  if (!nextSolveDate) return "unscheduled";

  const diff = differenceInCalendarDays(startOfDay(nextSolveDate), startOfDay(now));
  if (diff < 0) return "overdue";
  if (diff === 0) return "due-today";
  if (diff <= 3) return "upcoming";
  return "scheduled";
}

export function getDaysSince(date, now = new Date()) {
  if (!date) return Number.MAX_SAFE_INTEGER;
  return differenceInCalendarDays(startOfDay(now), startOfDay(date));
}
