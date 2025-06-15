
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, BookOpen, Clock, TrendingUp, Users } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const Dashboard = () => {
  // Mock data - in real app this would come from state/API
  const studentData = {
    name: "Alex Kumar",
    branch: "Computer Science",
    year: "3rd Year",
    gpa: 8.4,
    attendance: 87,
    studyHours: 6.2,
    lastUpdated: "2 days ago"
  };

  const recentPerformance = [
    { subject: "Data Structures", score: 92, trend: "up" },
    { subject: "Computer Networks", score: 78, trend: "down" },
    { subject: "Database Systems", score: 85, trend: "up" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {studentData.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {studentData.branch} • {studentData.year} • Last updated {studentData.lastUpdated}
            </p>
          </div>
          <Link to="/data-entry">
            <Button className="bg-indigo-600 hover:bg-indigo-700 mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add/Update Data
            </Button>
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Overall GPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 mr-3" />
                <div>
                  <div className="text-3xl font-bold">{studentData.gpa}</div>
                  <div className="text-sm opacity-90">out of 10</div>
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
                  <div className="text-3xl font-bold">{studentData.attendance}%</div>
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
                  <div className="text-3xl font-bold">{studentData.studyHours}</div>
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
                  <div className="text-3xl font-bold">↗️</div>
                  <div className="text-sm opacity-90">trending up</div>
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
              <div className="space-y-4">
                {recentPerformance.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.subject}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Score: {item.score}/100</div>
                    </div>
                    <div className={`text-2xl ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {item.trend === 'up' ? '📈' : '📉'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link to="/analysis">
                  <Button variant="outline" className="w-full justify-start">
                    📊 View Performance Analysis
                  </Button>
                </Link>
                <Link to="/insights">
                  <Button variant="outline" className="w-full justify-start">
                    🧠 Get Smart Insights
                  </Button>
                </Link>
                <Link to="/peer-comparison">
                  <Button variant="outline" className="w-full justify-start">
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
