import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserData } from "@/hooks/useUserData";
import { BurnoutAlert } from "@/components/BurnoutAlert";
import { AchievementBadges } from "@/components/AchievementBadges";
import { StudyStreakTracker } from "@/components/StudyStreakTracker";
import ChallengeMode from "@/components/ChallengeMode";
 
const Dashboard = () => {
  const { userData } = useUserData();
  
  return (
    <div className="mx-auto max-w-3xl p-4">
      {/* Challenge Mode */}
      <ChallengeMode />
      
      <BurnoutAlert />
      
      <AchievementBadges />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StudyStreakTracker />
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">Study Sessions</div>
                <div className="text-2xl font-bold">
                  {userData.studySessions.filter(s => s.completed).length}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Subjects Tracked</div>
                <div className="text-2xl font-bold">
                  {userData.subjects.length}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Goals Completed</div>
                <div className="text-2xl font-bold">
                  {userData.dailyGoals.filter(g => g.completed).length}/{userData.dailyGoals.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="goals">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="goals">Daily Goals</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Today's Goals</CardTitle>
            </CardHeader>
            <CardContent>
              {userData.dailyGoals.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No goals set for today. Add some goals to track your progress!
                </div>
              ) : (
                <div className="space-y-4">
                  {userData.dailyGoals.map(goal => (
                    <div key={goal.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={goal.completed} 
                        className="h-5 w-5" 
                      />
                      <span className={goal.completed ? "line-through text-gray-500" : ""}>
                        {goal.text}
                      </span>
                      <span className="ml-auto text-xs">
                        {goal.priority === "high" ? "🔴" : goal.priority === "medium" ? "🟠" : "🟢"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(userData.weeklySchedule).map(([day, data]) => (
                  <div key={day} className="flex items-center">
                    <div className="w-24 font-medium capitalize">{day}</div>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(data.completed / Math.max(data.planned, 1)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-right text-sm">
                      {data.completed}/{data.planned}h
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {userData.subjects.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No subjects added yet. Add subjects to track your performance!
                </div>
              ) : (
                <div className="space-y-4">
                  {userData.subjects.map(subject => (
                    <div key={subject.name} className="space-y-1">
                      <div className="flex justify-between">
                        <div className="font-medium">{subject.name}</div>
                        <div>{subject.score}/10</div>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${(subject.score / 10) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Attendance: {subject.attendance}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
