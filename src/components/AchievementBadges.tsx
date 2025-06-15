
import { Badge } from "@/components/ui/badge";
import { Award, Star, StarHalf, StarOff, BadgeCheck } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

export const AchievementBadges = () => {
  const { userData } = useUserData();
  const { studyStreak, studySessions } = userData;

  // Badge for streak
  let streakBadge = null;
  if (studyStreak.currentStreak >= 30) {
    streakBadge = (
      <div className="flex flex-col items-center">
        <Award className="h-8 w-8 text-orange-500 mb-1" />
        <Badge variant="secondary" className="mb-0.5">30+ Day Streak</Badge>
      </div>
    );
  } else if (studyStreak.currentStreak >= 7) {
    streakBadge = (
      <div className="flex flex-col items-center">
        <Star className="h-8 w-8 text-yellow-500 mb-1" />
        <Badge variant="secondary">7+ Day Streak</Badge>
      </div>
    );
  } else if (studyStreak.currentStreak >= 3) {
    streakBadge = (
      <div className="flex flex-col items-center">
        <StarHalf className="h-8 w-8 text-amber-500 mb-1" />
        <Badge variant="secondary">3+ Day Streak</Badge>
      </div>
    );
  } else if (studyStreak.currentStreak > 0) {
    streakBadge = (
      <div className="flex flex-col items-center">
        <StarOff className="h-8 w-8 text-gray-400 mb-1" />
        <Badge variant="secondary">Streak Started</Badge>
      </div>
    );
  }

  // Badge for number of completed sessions
  const totalCompleted = studySessions.filter(s => s.completed).length;
  let sessionBadge = null;
  if (totalCompleted >= 100) {
    sessionBadge = (
      <div className="flex flex-col items-center">
        <BadgeCheck className="h-8 w-8 text-green-600 mb-1" />
        <Badge variant="secondary">100 Sessions</Badge>
      </div>
    );
  } else if (totalCompleted >= 50) {
    sessionBadge = (
      <div className="flex flex-col items-center">
        <BadgeCheck className="h-8 w-8 text-green-500 mb-1" />
        <Badge variant="secondary">50 Sessions</Badge>
      </div>
    );
  } else if (totalCompleted >= 10) {
    sessionBadge = (
      <div className="flex flex-col items-center">
        <BadgeCheck className="h-8 w-8 text-lime-500 mb-1" />
        <Badge variant="secondary">10 Sessions</Badge>
      </div>
    );
  }

  if (!streakBadge && !sessionBadge) return null;

  return (
    <div className="mb-8 text-center">
      <div className="inline-flex gap-6 justify-center items-end">
        {streakBadge}
        {sessionBadge}
      </div>
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Keep it up — your achievements will grow as you progress!
      </div>
    </div>
  );
};
