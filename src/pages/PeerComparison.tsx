
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useUserData } from "@/hooks/useUserData";
import { useEffect } from "react";

const PeerComparison = () => {
  const { userData, setBaselineData, updatePerformanceHistory } = useUserData();

  // Set baseline data if not exists and user has subjects
  useEffect(() => {
    if (userData.subjects.length > 0 && !userData.baselineData) {
      setBaselineData(userData.subjects);
    }
  }, [userData.subjects, userData.baselineData, setBaselineData]);

  // Create performance comparison data using real user data or mock data
  const performanceData = userData.subjects.length > 0 
    ? userData.subjects.map(subject => ({
        subject: subject.name,
        yourScore: subject.score,
        peerAverage: Math.max(50, subject.score - Math.random() * 20),
        topPercentile: Math.min(100, subject.score + Math.random() * 15),
        baselineScore: userData.baselineData?.subjects.find(s => s.name === subject.name)?.score || subject.score
      }))
    : [
        { subject: "Math", yourScore: 0, peerAverage: 75, topPercentile: 92, baselineScore: 0 },
        { subject: "Physics", yourScore: 0, peerAverage: 78, topPercentile: 89, baselineScore: 0 },
        { subject: "Chemistry", yourScore: 0, peerAverage: 73, topPercentile: 87, baselineScore: 0 },
        { subject: "English", yourScore: 0, peerAverage: 80, topPercentile: 91, baselineScore: 0 },
        { subject: "CS", yourScore: 0, peerAverage: 82, topPercentile: 95, baselineScore: 0 }
      ];

  const trendData = userData.performanceHistory.length > 0
    ? userData.performanceHistory.slice(-5).map((entry, index) => ({
        month: `Month ${index + 1}`,
        yourGPA: entry.overallGPA,
        peerAverage: Math.max(6.0, entry.overallGPA - Math.random() * 1.0),
        baselineGPA: userData.baselineData?.overallGPA || entry.overallGPA
      }))
    : [
        { month: "Jan", yourGPA: 0, peerAverage: 7.0, baselineGPA: 0 },
        { month: "Feb", yourGPA: 0, peerAverage: 7.1, baselineGPA: 0 },
        { month: "Mar", yourGPA: 0, peerAverage: 7.3, baselineGPA: 0 },
        { month: "Apr", yourGPA: 0, peerAverage: 7.4, baselineGPA: 0 },
        { month: "May", yourGPA: 0, peerAverage: 7.5, baselineGPA: 0 }
      ];

  const handleUpdateProgress = () => {
    if (userData.subjects.length > 0) {
      updatePerformanceHistory(userData.subjects);
    }
  };

  const calculateImprovement = () => {
    if (!userData.baselineData || userData.subjects.length === 0) return 0;
    
    const currentAvg = userData.subjects.reduce((sum, s) => sum + s.score, 0) / userData.subjects.length;
    const baselineAvg = userData.baselineData.overallGPA;
    
    return Math.round(((currentAvg - baselineAvg) / baselineAvg) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personal Progress Tracking</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Track your academic progress and improvement over time
          </p>
        </div>

        {/* Progress Update Button */}
        {userData.subjects.length > 0 && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Track Your Progress</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Update your performance history to see improvement over time
                  </p>
                </div>
                <Button onClick={handleUpdateProgress} className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Update Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-medium mb-2">Branch</label>
                <Select defaultValue={userData.branch.toLowerCase().replace(' ', '-')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="civil">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-medium mb-2">Semester</label>
                <Select defaultValue="semester-4">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semester-1">Semester 1</SelectItem>
                    <SelectItem value="semester-2">Semester 2</SelectItem>
                    <SelectItem value="semester-3">Semester 3</SelectItem>
                    <SelectItem value="semester-4">Semester 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-medium mb-2">Time Period</label>
                <Select defaultValue="all-time">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Comparison with Baseline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Subject-wise Performance vs Your Baseline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="baselineScore" fill="#94A3B8" name="Your Baseline" />
                <Bar dataKey="yourScore" fill="#6366F1" name="Current Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* GPA Trend with Baseline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your GPA Progress Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="baselineGPA" stroke="#94A3B8" name="Your Baseline" strokeWidth={2} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="yourGPA" stroke="#6366F1" name="Current GPA" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Personal Progress Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium">Subjects Tracked</span>
                <Badge variant="secondary">{userData.subjects.length} subjects</Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium">Subjects Above 75%</span>
                <Badge className="bg-green-600 text-white">
                  {userData.subjects.length > 0 ? `${userData.subjects.filter(s => s.score > 75).length} out of ${userData.subjects.length}` : '0 out of 0'}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <span className="text-sm font-medium">Improvement from Baseline</span>
                <Badge className={`${calculateImprovement() >= 0 ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                  {calculateImprovement() >= 0 ? '+' : ''}{calculateImprovement()}%
                </Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-sm font-medium">Performance History</span>
                <Badge variant="secondary">{userData.performanceHistory.length} records</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PeerComparison;
