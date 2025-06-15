
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Target, Clock } from "lucide-react";

const Insights = () => {
  const insights = [
    {
      type: "success",
      icon: CheckCircle,
      title: "Strong Performance in Mathematics",
      description: "You've maintained consistent scores above 85% in Mathematics. Keep up the excellent work!",
      action: "Continue current study pattern"
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Chemistry Needs Attention",
      description: "Your Chemistry marks have dropped by 12% over the last month. Focus on organic chemistry concepts.",
      action: "Schedule extra study sessions"
    },
    {
      type: "info",
      icon: Clock,
      title: "Peak Performance Hours",
      description: "Your highest scores occur when studying between 8-10 PM. Consider scheduling difficult subjects during this time.",
      action: "Optimize study schedule"
    },
    {
      type: "success",
      icon: TrendingUp,
      title: "Improved Sleep Pattern",
      description: "Getting 7+ hours of sleep has improved your average scores by 8%. Maintain this healthy habit!",
      action: "Keep consistent sleep schedule"
    },
    {
      type: "warning",
      icon: Target,
      title: "Attendance Alert",
      description: "Your attendance in Physics (72%) is below the required 75%. This may affect your internal marks.",
      action: "Prioritize attendance"
    }
  ];

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
