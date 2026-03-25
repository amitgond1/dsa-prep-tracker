import {
  differenceInCalendarDays,
  format,
  isToday,
  parseISO,
  startOfDay,
  subMonths
} from "date-fns";

const intervals = [3, 7, 14, 30, 60];

export const getNextSolveDate = (solveCount) => {
  const days = intervals[Math.min(Math.max(solveCount, 1) - 1, intervals.length - 1)];
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getRevisionStatus = (nextSolveDate) => {
  if (!nextSolveDate) return "unscheduled";
  const diff = differenceInCalendarDays(startOfDay(parseISO(String(nextSolveDate))), startOfDay(new Date()));
  if (diff < 0) return "overdue";
  if (diff === 0) return "due-today";
  if (diff <= 3) return "upcoming";
  return "scheduled";
};

export const formatDate = (date) => {
  if (!date) return "-";
  return format(new Date(date), "dd MMM yyyy");
};

export const sixMonthsBack = () => subMonths(startOfDay(new Date()), 6);

export const isDateToday = (date) => {
  if (!date) return false;
  return isToday(new Date(date));
};
