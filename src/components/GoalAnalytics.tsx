
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

export const GoalAnalytics = () => {
  const { userData, getGoalCompletionTrend } = useUserData();
  const trend = getGoalCompletionTrend();
  const recentAnalytics = userData.goalAnalytics.slice(-7);

  const averageCompletionRate = recentAnalytics.length > 0
    ? Math.round(recentAnalytics.reduce((sum, analytics) => sum + analytics.completionRate, 0) / recentAnalytics.length)
    : 0;

  const totalGoalsThisWeek = recentAnalytics.reduce((sum, analytics) => sum + analytics.totalGoals, 0);
  const completedGoalsThisWeek = recentAnalytics.reduce((sum, analytics) => sum + analytics.completedGoals, 0);

  if (recentAnalytics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Goal Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Complete some daily goals to see analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Goal Analytics (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Weekly Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{completedGoalsThisWeek}</div>
              <div className="text-sm text-gray-600">Goals Completed</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{averageCompletionRate}%</div>
              <div className="text-sm text-gray-600">Avg. Completion Rate</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Weekly Progress</span>
              <span className="text-sm text-gray-600">{completedGoalsThisWeek}/{totalGoalsThisWeek} goals</span>
            </div>
            <Progress value={totalGoalsThisWeek > 0 ? (completedGoalsThisWeek / totalGoalsThisWeek) * 100 : 0} className="h-3" />
          </div>

          {/* Daily Trend */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Daily Completion Trend
            </h4>
            <div className="space-y-2">
              {trend.map((day, index) => (
                <div key={day.date} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1">
                    <Progress value={day.rate} className="h-2" />
                  </div>
                  <div className="w-12 text-xs text-gray-600 text-right">
                    {day.rate}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
