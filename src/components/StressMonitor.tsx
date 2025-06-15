
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Brain, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

export const StressMonitor = () => {
  const { userData, recordStressLevel, getTodayStressLevel, getStressTrend, getAverageStressLevel } = useUserData();
  const [selectedLevel, setSelectedLevel] = useState<number>(5);
  const [notes, setNotes] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const todayStress = getTodayStressLevel();
  const stressTrend = getStressTrend();
  const averageStress = getAverageStressLevel();

  const stressFactors = [
    "Exams", "Assignments", "Personal", "Health", "Social", "Financial", "Family", "Sleep"
  ];

  const getStressColor = (level: number) => {
    if (level <= 3) return "text-green-600 bg-green-50 border-green-200";
    if (level <= 6) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (level <= 8) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getStressLabel = (level: number) => {
    if (level <= 2) return "Very Low";
    if (level <= 4) return "Low";
    if (level <= 6) return "Moderate";
    if (level <= 8) return "High";
    return "Very High";
  };

  const handleFactorToggle = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor)
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  const handleSubmit = () => {
    recordStressLevel(selectedLevel, notes, selectedFactors);
    setNotes("");
    setSelectedFactors([]);
  };

  const getTrendIcon = () => {
    if (stressTrend.length < 2) return <Minus className="h-4 w-4" />;
    
    const recent = stressTrend.slice(-3);
    const avgRecent = recent.reduce((sum, day) => sum + day.level, 0) / recent.length;
    const older = stressTrend.slice(0, -3);
    
    if (older.length === 0) return <Minus className="h-4 w-4" />;
    
    const avgOlder = older.reduce((sum, day) => sum + day.level, 0) / older.length;
    
    if (avgRecent > avgOlder) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (avgRecent < avgOlder) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Stress Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Today's Status */}
          {todayStress ? (
            <div className={`p-4 rounded-lg border ${getStressColor(todayStress.level)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Today's Stress Level</span>
                <Badge variant="outline">
                  {todayStress.level}/10 - {getStressLabel(todayStress.level)}
                </Badge>
              </div>
              {todayStress.factors && todayStress.factors.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {todayStress.factors.map(factor => (
                    <Badge key={factor} variant="secondary" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">Track your stress level today</p>
            </div>
          )}

          {/* Stress Level Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              How stressed do you feel today? ({selectedLevel}/10)
            </label>
            <div className="grid grid-cols-10 gap-1 mb-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`h-8 rounded text-xs font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Stress Factors */}
          <div>
            <label className="block text-sm font-medium mb-2">
              What's causing stress? (optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {stressFactors.map(factor => (
                <button
                  key={factor}
                  onClick={() => handleFactorToggle(factor)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    selectedFactors.includes(factor)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {factor}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional notes (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? What might help reduce stress?"
              className="h-20"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Record Stress Level
          </Button>

          {/* Stats */}
          {userData.stressRecords.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {getTrendIcon()}
                  <span className="text-sm font-medium">7-Day Trend</span>
                </div>
                <div className="text-lg font-semibold">
                  {stressTrend.length > 0 ? stressTrend[stressTrend.length - 1]?.level || 0 : 0}/10
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium mb-1">Average</div>
                <div className="text-lg font-semibold">
                  {averageStress}/10
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
