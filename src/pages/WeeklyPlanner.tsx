
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Target, Clock, CheckCircle, Plus, Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUserData } from "@/hooks/useUserData";

const WeeklyPlanner = () => {
  const { userData, addDailyGoal, toggleGoalCompletion, updateWeeklySchedule, updateDayProgress } = useUserData();
  const [newGoal, setNewGoal] = useState("");
  const [goalPriority, setGoalPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Pomodoro timer state
  const [timeLeft, setTimeLeft] = useState(0); // Start from 0
  const [isRunning, setIsRunning] = useState(false);
  const [customTime, setCustomTime] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Weekly schedule editing state
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [dayPlan, setDayPlan] = useState({ planned: 0, subjects: "" });

  // Preset time options (in seconds)
  const presetTimes = [
    { label: "3 min", value: 3 * 60 },
    { label: "5 min", value: 5 * 60 },
    { label: "10 min", value: 10 * 60 },
    { label: "25 min", value: 25 * 60 },
  ];

  // Get today's goals
  const today = new Date().toISOString().split('T')[0];
  const todaysGoals = userData.dailyGoals.filter(goal => goal.date === today);

  // Calculate weekly progress
  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const totalPlanned = weekDays.reduce((sum, day) => sum + userData.weeklySchedule[day].planned, 0);
  const totalCompleted = weekDays.reduce((sum, day) => sum + userData.weeklySchedule[day].completed, 0);
  const completionPercentage = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

  // Initialize audio
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    };

    audioRef.current = { play: createBeepSound } as any;
  }, []);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            if (soundEnabled && audioRef.current) {
              try {
                audioRef.current.play();
              } catch (error) {
                console.log('Could not play sound:', error);
              }
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, soundEnabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      addDailyGoal(newGoal, goalPriority);
      setNewGoal("");
      setGoalPriority('medium');
    }
  };

  const handleSaveDaySchedule = (day: string) => {
    const subjects = dayPlan.subjects.split(',').map(s => s.trim()).filter(s => s);
    updateWeeklySchedule(day, {
      planned: dayPlan.planned,
      subjects
    });
    setEditingDay(null);
    setDayPlan({ planned: 0, subjects: "" });
  };

  const startEditingDay = (day: string) => {
    const dayData = userData.weeklySchedule[day];
    setEditingDay(day);
    setDayPlan({
      planned: dayData.planned,
      subjects: dayData.subjects.join(', ')
    });
  };

  const setPresetTime = (seconds: number) => {
    setTimeLeft(seconds);
    setIsRunning(false);
  };

  const setCustomTimerTime = () => {
    const minutes = parseInt(customTime);
    if (!isNaN(minutes) && minutes > 0) {
      setTimeLeft(minutes * 60);
      setCustomTime("");
      setIsRunning(false);
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
            Plan your week, set daily goals, and track your study progress
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
                {totalPlanned === 0 ? "📝 Set your weekly schedule to start tracking!" :
                 completionPercentage >= 80 ? "🎉 Great progress! Keep it up!" : 
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
                <div className="text-2xl font-bold text-green-600">
                  {todaysGoals.filter(g => g.completed).length}
                </div>
                <div className="text-sm text-gray-600">Goals Achieved Today</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {weekDays.filter(d => userData.weeklySchedule[d].completed > 0).length}
                </div>
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
          {/* Daily Goals Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {todaysGoals.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No goals set for today. Add some goals below!</p>
                ) : (
                  todaysGoals.map((goal) => (
                    <div key={goal.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <CheckCircle 
                        className={`h-5 w-5 cursor-pointer ${goal.completed ? 'text-green-600' : 'text-gray-400'}`}
                        onClick={() => toggleGoalCompletion(goal.id)}
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
                  ))
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a daily goal..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                  />
                  <Select value={goalPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setGoalPriority(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddGoal} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weekDays.map((day) => (
                  <div key={day} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium capitalize">{day}</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startEditingDay(day)}
                      >
                        {userData.weeklySchedule[day].planned === 0 ? 'Set Plan' : 'Edit'}
                      </Button>
                    </div>
                    
                    {editingDay === day ? (
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Planned hours"
                          value={dayPlan.planned}
                          onChange={(e) => setDayPlan({...dayPlan, planned: Number(e.target.value)})}
                        />
                        <Input
                          placeholder="Subjects (comma-separated)"
                          value={dayPlan.subjects}
                          onChange={(e) => setDayPlan({...dayPlan, subjects: e.target.value})}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleSaveDaySchedule(day)} size="sm">Save</Button>
                          <Button variant="outline" onClick={() => setEditingDay(null)} size="sm">Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">
                            {userData.weeklySchedule[day].completed} / {userData.weeklySchedule[day].planned} hours
                          </span>
                          <Input
                            type="number"
                            className="w-20 h-6"
                            placeholder="Done"
                            value={userData.weeklySchedule[day].completed}
                            onChange={(e) => updateDayProgress(day, Number(e.target.value))}
                          />
                        </div>
                        {userData.weeklySchedule[day].planned > 0 && (
                          <>
                            <Progress 
                              value={(userData.weeklySchedule[day].completed / userData.weeklySchedule[day].planned) * 100} 
                              className="h-2 mb-2" 
                            />
                            <div className="text-xs text-gray-500">
                              {userData.weeklySchedule[day].subjects.length > 0 
                                ? userData.weeklySchedule[day].subjects.join(", ")
                                : "No subjects planned"
                              }
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Timer */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Study Timer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl font-bold mb-4 text-indigo-600">
                {formatTime(timeLeft)}
              </div>
              
              {/* Preset Time Buttons */}
              <div className="flex justify-center gap-2 mb-4 flex-wrap">
                {presetTimes.map((preset) => (
                  <Button 
                    key={preset.value}
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetTime(preset.value)}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              {/* Custom Time Input */}
              <div className="flex justify-center gap-2 mb-4">
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-24 text-center"
                  min="1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={setCustomTimerTime}
                  disabled={!customTime}
                >
                  Set
                </Button>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4 mb-4">
                <Button 
                  onClick={() => setIsRunning(!isRunning)}
                  disabled={timeLeft === 0}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsRunning(false);
                    setTimeLeft(0);
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={soundEnabled ? 'bg-green-50' : ''}
                >
                  <Volume2 className={`h-4 w-4 mr-2 ${soundEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                  Sound {soundEnabled ? 'On' : 'Off'}
                </Button>
              </div>

              <p className="text-sm text-gray-600">
                {timeLeft === 0 
                  ? "Set a time and start your focused study session!"
                  : isRunning 
                    ? "Stay focused! You're doing great!"
                    : "Timer is paused. Click start when you're ready!"
                }
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
              placeholder="How is this week going? What are you learning? What can you improve?"
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
