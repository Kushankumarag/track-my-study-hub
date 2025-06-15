
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Award, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const PeerComparison = () => {
  const performanceData = [
    { subject: "Math", yourScore: 88, peerAverage: 75, topPercentile: 92 },
    { subject: "Physics", yourScore: 82, peerAverage: 78, topPercentile: 89 },
    { subject: "Chemistry", yourScore: 71, peerAverage: 73, topPercentile: 87 },
    { subject: "English", yourScore: 85, peerAverage: 80, topPercentile: 91 },
    { subject: "CS", yourScore: 92, peerAverage: 82, topPercentile: 95 }
  ];

  const trendData = [
    { month: "Jan", yourGPA: 7.2, peerAverage: 7.0 },
    { month: "Feb", yourGPA: 7.5, peerAverage: 7.1 },
    { month: "Mar", yourGPA: 7.8, peerAverage: 7.3 },
    { month: "Apr", yourGPA: 8.1, peerAverage: 7.4 },
    { month: "May", yourGPA: 8.3, peerAverage: 7.5 }
  ];

  const leaderboard = [
    { rank: 1, name: "StudyNinja", score: 94.2, location: "Bangalore" },
    { rank: 2, name: "CodeMaster", score: 92.8, location: "Hyderabad" },
    { rank: 3, name: "You", score: 85.6, location: "Bangalore", isYou: true },
    { rank: 4, name: "TechGeek", score: 84.3, location: "Chennai" },
    { rank: 5, name: "SmartLearner", score: 83.9, location: "Bangalore" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Peer Comparison</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            See how you stack up against peers while maintaining privacy
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-medium mb-2">Branch</label>
                <Select defaultValue="computer-science">
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
                <label className="block text-sm font-medium mb-2">Location</label>
                <Select defaultValue="bangalore">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="yourScore" fill="#6366F1" name="Your Score" />
                <Bar dataKey="peerAverage" fill="#94A3B8" name="Peer Average" />
                <Bar dataKey="topPercentile" fill="#10B981" name="Top 10%" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* GPA Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                GPA Trend Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="yourGPA" stroke="#6366F1" name="Your GPA" strokeWidth={3} />
                  <Line type="monotone" dataKey="peerAverage" stroke="#94A3B8" name="Peer Average" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium">Overall Ranking</span>
                <Badge className="bg-green-600 text-white">Top 15%</Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium">Above Peer Average</span>
                <Badge variant="secondary">4 out of 5 subjects</Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <span className="text-sm font-medium">Improvement Rate</span>
                <Badge className="bg-indigo-600 text-white">+12% this month</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Anonymous Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Anonymous Leaderboard - CS Branch, Bangalore
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((student) => (
                <div 
                  key={student.rank} 
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    student.isYou 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700' 
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    student.rank === 1 ? 'bg-yellow-500 text-white' :
                    student.rank === 2 ? 'bg-gray-400 text-white' :
                    student.rank === 3 ? 'bg-orange-500 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {student.rank}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${student.isYou ? 'text-indigo-600' : ''}`}>
                        {student.name}
                      </span>
                      {student.isYou && <Badge variant="secondary">You</Badge>}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {student.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{student.score}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PeerComparison;
