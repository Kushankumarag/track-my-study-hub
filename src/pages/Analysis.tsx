
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from "recharts";
import { useUserData } from "@/hooks/useUserData";
import { AlertCircle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Analysis = () => {
  const { userData } = useUserData();
  const hasData = userData.subjects.length > 0;

  // Prepare data for charts
  const subjectData = userData.subjects.map(subject => ({
    subject: subject.name,
    score: subject.score,
    attendance: subject.attendance,
    studyHours: userData.studyData.dailyStudyHours || 0
  }));

  const attendanceData = userData.subjects.map(subject => ({
    subject: subject.name,
    attendance: subject.attendance,
    score: subject.score
  }));

  const sleepData = userData.studyData.sleepHours ? [{
    sleep: userData.studyData.sleepHours,
    score: userData.subjects.reduce((sum, s) => sum + s.score, 0) / userData.subjects.length || 0
  }] : [];

  const focusTime = userData.studyData.dailyStudyHours || 0;
  const distractionTime = userData.studyData.screenTime || 0;
  const total = focusTime + distractionTime;
  
  const distractionData = total > 0 ? [
    { 
      name: "Focused Study", 
      value: Math.round((focusTime / total) * 100), 
      color: "#10B981" 
    },
    { 
      name: "Screen Time", 
      value: Math.round((distractionTime / total) * 100), 
      color: "#EF4444" 
    }
  ] : [];

  const chartConfig = {
    score: { label: "Score", color: "#3B82F6" },
    studyHours: { label: "Study Hours", color: "#10B981" },
    attendance: { label: "Attendance", color: "#8B5CF6" },
    sleep: { label: "Sleep Hours", color: "#F59E0B" },
  };

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Performance Analysis 📊
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Deep dive into your academic performance with visual insights
            </p>
          </div>

          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-200 mb-2">
                No Data to Analyze
              </h3>
              <p className="text-orange-700 dark:text-orange-300 mb-6">
                Add your subject scores, attendance, and study habits to see detailed performance analysis and insights.
              </p>
              <Link to="/data-entry">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Add Your Data Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Performance Analysis 📊
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Deep dive into your academic performance with visual insights
          </p>
        </div>

        <div className="grid gap-6">
          {/* Subject-wise Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Study Hours vs Performance & Attendance vs Performance */}
          <div className="grid lg:grid-cols-2 gap-6">
            {userData.studyData.dailyStudyHours > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Study Hours vs Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={250}>
                      <ScatterChart data={subjectData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="studyHours" name="Study Hours" />
                        <YAxis dataKey="score" name="Score" />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          formatter={(value, name, props) => [
                            `${props.payload.subject}: ${value}${name === 'studyHours' ? ' hrs' : ' marks'}`,
                            name === 'studyHours' ? 'Study Hours' : 'Score'
                          ]}
                        />
                        <Scatter dataKey="score" fill="var(--color-score)" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Attendance vs Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={250}>
                    <ScatterChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="attendance" name="Attendance %" />
                      <YAxis dataKey="score" name="Score" />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value, name, props) => [
                          `${props.payload.subject}: ${value}${name === 'attendance' ? '%' : ' marks'}`,
                          name === 'attendance' ? 'Attendance' : 'Score'
                        ]}
                      />
                      <Scatter dataKey="score" fill="var(--color-attendance)" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sleep Analysis & Focus Analysis */}
          <div className="grid lg:grid-cols-2 gap-6">
            {userData.studyData.sleepHours > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sleep vs Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">😴</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {userData.studyData.sleepHours} hours/night
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                      Average Score: {Math.round(userData.subjects.reduce((sum, s) => sum + s.score, 0) / userData.subjects.length)}%
                    </div>
                    <div className={`p-3 rounded-lg ${
                      userData.studyData.sleepHours >= 7 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                    }`}>
                      {userData.studyData.sleepHours >= 7 
                        ? '✅ Great sleep schedule! Keep it up.'
                        : '⚠️ Consider getting 7-8 hours of sleep for better performance.'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {total > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Focus vs Distraction Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6 items-center">
                    <div>
                      <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={distractionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              dataKey="value"
                            >
                              {distractionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300">Focused Study: {distractionData[0]?.value || 0}%</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300">Screen Time: {distractionData[1]?.value || 0}%</span>
                      </div>
                      {distractionTime > focusTime && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <p className="text-red-700 dark:text-red-300 font-medium">
                            ⚠️ Distraction Alert
                          </p>
                          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                            Your screen time is higher than study time. Consider reducing distractions.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
