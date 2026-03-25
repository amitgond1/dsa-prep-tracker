import { differenceInCalendarDays, startOfDay, subDays } from "date-fns";

export const updateStreakOnSolve = (user, now = new Date()) => {
  const today = startOfDay(now);
  const yesterday = subDays(today, 1);

  if (!user.lastActiveDate) {
    user.streak = 1;
    user.bestStreak = Math.max(user.bestStreak || 0, user.streak);
    user.lastActiveDate = now;
    return;
  }

  const last = startOfDay(user.lastActiveDate);
  const diff = differenceInCalendarDays(today, last);

  if (diff === 0) {
    user.lastActiveDate = now;
    return;
  }

  if (last.getTime() === yesterday.getTime()) {
    user.streak += 1;
  } else {
    user.streak = 1;
  }

  user.bestStreak = Math.max(user.bestStreak || 0, user.streak);
  user.lastActiveDate = now;
};
