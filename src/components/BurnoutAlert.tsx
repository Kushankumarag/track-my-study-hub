
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

const WEEKLY_STUDY_THRESHOLD = 42; // 6h a day * 7
const WEEKLY_SLEEP_MIN = 40; // ~6h/night

export const BurnoutAlert = () => {
  const { getWeeklyActualHours, getWeeklySleepHours } = useUserData();
  const weeklyHours = getWeeklyActualHours();
  const weeklySleep = getWeeklySleepHours?.() ?? 0;

  if (weeklyHours < WEEKLY_STUDY_THRESHOLD || weeklySleep >= WEEKLY_SLEEP_MIN) {
    return null;
  }

  return (
    <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20">
      <CardContent className="p-6 flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Burnout Warning! 🛑
          </h3>
          <p className="text-red-700 dark:text-red-300">
            You studied {weeklyHours.toFixed(1)} hours this week but only slept {weeklySleep} hours.
            Don&apos;t forget to rest and recharge — too little sleep can hurt your performance!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
