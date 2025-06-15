
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Target, Clock } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import { Link } from "react-router-dom";

const Insights = () => {
  const { userData, metrics } = useUserData();
  const hasData = userData.subjects.length > 0;

  // Generate dynamic insights based on user data
  const generateInsights = () => {
    if (!hasData) return [];

    const insights = [];
    const avgScore = metrics.averageScore;
    const avgAttendance = metrics.averageAttendance;
    const studyHours = userData.studyData.dailyStudyHours;
    const sleepHours = userData.studyData.sleepHours;
    const screenTime = userData.studyData.screenTime;

    // Performance insights
    if (avgScore >= 85) {
      insights.push({
        type: "success",
        icon: CheckCircle,
        title: "Excellent Academic Performance",
        description: `Your average score of ${avgScore}% is outstanding! You're maintaining excellent performance across subjects.`,
        action: "Keep up the great work"
      });
    } else if (avgScore >= 70) {
      insights.push({
        type: "info",
        icon: TrendingUp,
        title: "Good Performance with Room to Grow",
        description: `Your average score of ${avgScore}% is good. Focus on your weaker subjects to reach excellence.`,
        action: "Target improvement areas"
      });
    } else {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        title: "Performance Needs Attention",
        description: `Your average score of ${avgScore}% indicates room for improvement. Consider revising study strategies.`,
        action: "Schedule focused study sessions"
      });
    }

    // Find lowest performing subject
    const lowestSubject = userData.subjects.reduce((lowest, current) => 
      current.score < lowest.score ? current : lowest
    );
    
    if (lowestSubject.score < avgScore - 10) {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        title: `${lowestSubject.name} Needs Extra Attention`,
        description: `Your ${lowestSubject.name} score (${lowestSubject.score}%) is significantly below your average. Focus on this subject.`,
        action: "Schedule extra study time"
      });
    }

    // Attendance insights
    if (avgAttendance < 75) {
      insights.push({
        type: "warning",
        icon: Target,
        title: "Attendance Alert",
        description: `Your average attendance (${avgAttendance}%) is below the required 75%. This may affect your internal marks.`,
        action: "Prioritize attendance"
      });
    } else if (avgAttendance >= 90) {
      insights.push({
        type: "success",
        icon: CheckCircle,
        title: "Excellent Attendance",
        description: `Your ${avgAttendance}% attendance shows great discipline. This consistency will help your academic success.`,
        action: "Maintain this pattern"
      });
    }

    // Study habits insights
    if (studyHours && studyHours >= 6) {
      insights.push({
        type: "success",
        icon: Clock,
        title: "Strong Study Routine",
        description: `Studying ${studyHours} hours daily shows dedication. This consistent effort is key to your success.`,
        action: "Continue this routine"
      });
    } else if (studyHours && studyHours < 4) {
      insights.push({
        type: "warning",
        icon: Clock,
        title: "Increase Study Time",
        description: `${studyHours} hours of daily study might not be sufficient. Consider increasing focused study time.`,
        action: "Aim for 5-6 hours daily"
      });
    }

    // Sleep insights
    if (sleepHours && sleepHours >= 7) {
      insights.push({
        type: "success",
        icon: CheckCircle,
        title: "Healthy Sleep Pattern",
        description: `Getting ${sleepHours} hours of sleep supports your academic performance. Great job maintaining this!`,
        action: "Keep this sleep schedule"
      });
    } else if (sleepHours && sleepHours < 6) {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        title: "Sleep More for Better Performance",
        description: `Only ${sleepHours} hours of sleep may be affecting your performance. Aim for 7-8 hours nightly.`,
        action: "Improve sleep schedule"
      });
    }

    // Screen time insights
    if (screenTime && studyHours && screenTime > studyHours) {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        title: "Screen Time Exceeding Study Time",
        description: `${screenTime} hours of screen time vs ${studyHours} hours of study. This imbalance may hurt your focus.`,
        action: "Reduce screen distractions"
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const studyTips = [
    "Break study sessions into 25-minute focused blocks (Pomodoro Technique)",
    "Review notes within 24 hours of learning for better retention",
    "Practice active recall instead of passive reading",
    "Use spaced repetition for long-term memory retention",
    "Study in a distraction-free environment for maximum focus"
  ];

  const getInsightColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-600 bg-green-50 border-green-200";
      case "warning": return "text-orange-600 bg-orange-50 border-orange-200";
      case "info": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Insights</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered recommendations based on your performance patterns
          </p>
        </div>

        {/* Motivational Quote */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-0">
          <CardContent className="p-6 text-center">
            <blockquote className="text-lg font-medium mb-2">
              "Progress, not perfection."
            </blockquote>
            <p className="text-indigo-100">Focus on consistent improvement over perfect scores</p>
          </CardContent>
        </Card>

        {!hasData ? (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardContent className="p-12 text-center">
              <Brain className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-200 mb-2">
                No Data for Insights
              </h3>
              <p className="text-orange-700 dark:text-orange-300 mb-6">
                Add your academic data to receive personalized insights and recommendations for improvement.
              </p>
              <Link to="/data-entry">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Add Your Data to Get Insights
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Insights Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {insights.map((insight, index) => (
                <Card key={index} className={`border-l-4 ${getInsightColor(insight.type)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <insight.icon className="h-5 w-5 mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{insight.title}</CardTitle>
                        <Badge variant={insight.type === "success" ? "default" : insight.type === "warning" ? "destructive" : "secondary"}>
                          {insight.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {insight.description}
                    </p>
                    <Button variant="outline" size="sm">
                      {insight.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Study Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Study Tips & Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studyTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insights;
