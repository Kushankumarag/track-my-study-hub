
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, TrendingUp } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

export const StudyStreakTracker = () => {
  const { userData } = useUserData();
  const { studyStreak } = userData;

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥";
    if (streak >= 14) return "🚀";
    if (streak >= 7) return "⭐";
    if (streak >= 3) return "💪";
    return "🌱";
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Incredible dedication!";
    if (streak >= 14) return "You're on fire!";
    if (streak >= 7) return "Great consistency!";
    if (streak >= 3) return "Building momentum!";
    if (streak >= 1) return "Good start!";
    return "Start your streak today!";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Study Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Streak */}
          <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
            <div className="text-4xl mb-2">{getStreakEmoji(studyStreak.currentStreak)}</div>
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {studyStreak.currentStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {studyStreak.currentStreak === 1 ? 'day' : 'days'} streak
            </div>
            <Badge variant="secondary" className="text-xs">
              {getStreakMessage(studyStreak.currentStreak)}
            </Badge>
          </div>

          {/* Streak Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Target className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-blue-600">
                {studyStreak.longestStreak}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Best Streak
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-green-600">
                {studyStreak.streakHistory.filter(h => h.maintained).length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Total Days
              </div>
            </div>
          </div>

          {/* Streak History Visual */}
          {studyStreak.streakHistory.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Last 7 Days</div>
              <div className="flex gap-1">
                {studyStreak.streakHistory.slice(-7).map((day, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-sm ${
                      day.maintained
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    title={`${day.date}: ${day.maintained ? 'Studied' : 'No study'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Motivation */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Study for at least 30 minutes daily to maintain your streak! 🎯
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
