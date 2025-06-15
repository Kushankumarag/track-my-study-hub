
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, BookOpen, Clock, TrendingUp, Users, AlertCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useUserData } from "@/hooks/useUserData";

const Dashboard = () => {
  const { userData, metrics } = useUserData();
  
  const hasData = userData.subjects.length > 0;
  const timeSinceLastUpdate = userData.lastUpdated 
    ? Math.floor((Date.now() - new Date(userData.lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Fix focus vs distraction data
  const focusData = [
    { 
      name: 'Study Hours', 
      value: userData.studyData.dailyStudyHours || 0,
      fill: userData.studyData.dailyStudyHours > (userData.studyData.screenTime || 0) ? '#10B981' : '#EF4444'
    },
    { 
      name: 'Screen Time', 
      value: userData.studyData.screenTime || 0,
      fill: '#6B7280'
    }
  ];

  const showFocusAlert = userData.studyData.screenTime > userData.studyData.dailyStudyHours && userData.studyData.screenTime > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {userData.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {userData.branch} • {userData.year} • Last updated {timeSinceLastUpdate === 0 ? 'today' : `${timeSinceLastUpdate} days ago`}
            </p>
          </div>
          <Link to="/data-entry">
            <Button className="bg-indigo-600 hover:bg-indigo-700 mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              {hasData ? 'Update Data' : 'Add Data'}
            </Button>
          </Link>
        </div>

        {/* No Data State */}
        {!hasData && (
          <Card className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
                  No Data Available
                </h3>
              </div>
              <p className="text-orange-700 dark:text-orange-300 mb-4">
                Start tracking your academic performance by adding your subject scores, attendance, and study habits.
              </p>
              <Link to="/data-entry">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Get Started - Add Your First Data
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Focus vs Distraction Alert */}
        {showFocusAlert && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                    Focus Alert! 📱
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    Your screen time ({userData.studyData.screenTime}h) is higher than study time ({userData.studyData.dailyStudyHours}h). Time to refocus!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 mr-3" />
                <div>
                  <div className="text-3xl font-bold">
                    {hasData ? `${metrics.averageScore}%` : '--'}
                  </div>
                  <div className="text-sm opacity-90">
                    {metrics.totalSubjects} {metrics.totalSubjects === 1 ? 'subject' : 'subjects'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-3" />
                <div>
                  <div className="text-3xl font-bold">
                    {hasData ? `${metrics.averageAttendance}%` : '--'}
                  </div>
                  <div className="text-sm opacity-90">average</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Study Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 mr-3" />
                <div>
                  <div className="text-3xl font-bold">
                    {userData.studyData.dailyStudyHours || '--'}
                  </div>
                  <div className="text-sm opacity-90">hours/day</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 mr-3" />
                <div>
                  <div className="text-3xl font-bold">
                    {hasData ? (metrics.averageScore >= 75 ? '📈' : metrics.averageScore >= 60 ? '📊' : '📉') : '❓'}
                  </div>
                  <div className="text-sm opacity-90">
                    {hasData ? (metrics.averageScore >= 75 ? 'excellent' : metrics.averageScore >= 60 ? 'good' : 'needs focus') : 'no data'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Performance */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {hasData ? (
                <div className="space-y-4">
                  {userData.subjects.slice(0, 3).map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{subject.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Score: {subject.score}% | Attendance: {subject.attendance}%
                        </div>
                      </div>
                      <div className={`text-2xl ${subject.score >= 75 ? 'text-green-500' : subject.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {subject.score >= 75 ? '📈' : subject.score >= 60 ? '📊' : '📉'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No performance data yet</p>
                  <p className="text-sm">Add your subject scores to see performance trends</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link to="/analysis">
                  <Button variant="outline" className="w-full justify-start" disabled={!hasData}>
                    📊 View Performance Analysis
                  </Button>
                </Link>
                <Link to="/insights">
                  <Button variant="outline" className="w-full justify-start" disabled={!hasData}>
                    🧠 Get Smart Insights
                  </Button>
                </Link>
                <Link to="/peer-comparison">
                  <Button variant="outline" className="w-full justify-start" disabled={!hasData}>
                    👥 Compare with Peers
                  </Button>
                </Link>
                <Link to="/weekly-planner">
                  <Button variant="outline" className="w-full justify-start">
                    📅 Plan This Week
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
