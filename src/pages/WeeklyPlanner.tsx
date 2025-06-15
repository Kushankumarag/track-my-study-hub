
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Clock, CheckCircle, Plus, Play } from "lucide-react";
import { useState } from "react";

const WeeklyPlanner = () => {
  const [newGoal, setNewGoal] = useState("");
  const [goals, setGoals] = useState([
    { id: 1, text: "Complete Mathematics Chapter 5", completed: true, priority: "high" },
    { id: 2, text: "Practice 10 Chemistry problems daily", completed: false, priority: "medium" },
    { id: 3, text: "Finish Physics lab report", completed: true, priority: "high" },
    { id: 4, text: "Review English literature notes", completed: false, priority: "low" }
  ]);

  const weekSchedule = [
    { day: "Monday", planned: 8, completed: 6, subjects: ["Math", "Physics", "Chemistry"] },
    { day: "Tuesday", planned: 7, completed: 7, subjects: ["English", "CS", "Math"] },
    { day: "Wednesday", planned: 8, completed: 5, subjects: ["Physics", "Chemistry"] },
    { day: "Thursday", planned: 6, completed: 4, subjects: ["Math", "CS"] },
    { day: "Friday", planned: 7, completed: 0, subjects: ["All subjects review"] },
    { day: "Saturday", planned: 5, completed: 0, subjects: ["Mock test prep"] },
    { day: "Sunday", planned: 4, completed: 0, subjects: ["Weak areas focus"] }
  ];

  const totalPlanned = weekSchedule.reduce((sum, day) => sum + day.planned, 0);
  const totalCompleted = weekSchedule.reduce((sum, day) => sum + day.completed, 0);
  const completionPercentage = Math.round((totalCompleted / totalPlanned) * 100);

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { 
        id: goals.length + 1, 
        text: newGoal, 
        completed: false, 
        priority: "medium" 
      }]);
      setNewGoal("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Weekly Planner</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Plan your week, set goals, and track your study progress
          </p>
        </div>

        {/* Weekly Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              This Week's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Weekly Study Goal</span>
                <span className="text-sm text-gray-600">{totalCompleted} / {totalPlanned} hours</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <p className="text-sm text-gray-600 mt-2">
                {completionPercentage >= 80 ? "🎉 Great progress! Keep it up!" : 
                 completionPercentage >= 60 ? "📈 Good progress, stay focused!" : 
                 "⚡ Time to catch up! You can do this!"}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalCompleted}</div>
                <div className="text-sm text-gray-600">Hours Completed</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{goals.filter(g => g.completed).length}</div>
                <div className="text-sm text-gray-600">Goals Achieved</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{weekSchedule.filter(d => d.completed > 0).length}</div>
                <div className="text-sm text-gray-600">Active Days</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{completionPercentage}%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Goals Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Week Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <CheckCircle 
                      className={`h-5 w-5 ${goal.completed ? 'text-green-600' : 'text-gray-400'}`} 
                    />
                    <span className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                      {goal.text}
                    </span>
                    <Badge variant={
                      goal.priority === 'high' ? 'destructive' : 
                      goal.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {goal.priority}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                />
                <Button onClick={addGoal} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Daily Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Daily Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weekSchedule.map((day, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-20 font-medium">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">
                          {day.completed} / {day.planned} hours
                        </span>
                        <span className="text-sm text-gray-500">
                          {Math.round((day.completed / day.planned) * 100) || 0}%
                        </span>
                      </div>
                      <Progress value={(day.completed / day.planned) * 100} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">
                        {day.subjects.join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Session Timer */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Pomodoro Timer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl font-bold text-indigo-600 mb-4">25:00</div>
              <div className="flex justify-center gap-4 mb-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Focus Session
                </Button>
                <Button variant="outline">
                  Reset
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Ready for a focused 25-minute study session? Choose your subject and let's get started!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Week Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Week Notes & Reflections</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="How did this week go? What did you learn? What can you improve next week?"
              className="min-h-32"
            />
            <Button className="mt-4">Save Notes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
