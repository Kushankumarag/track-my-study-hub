
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell } from "recharts";

const Analysis = () => {
  // Mock data for charts
  const subjectData = [
    { subject: "Data Structures", score: 92, studyHours: 8 },
    { subject: "Computer Networks", score: 78, studyHours: 5 },
    { subject: "Database Systems", score: 85, studyHours: 6 },
    { subject: "Operating Systems", score: 88, studyHours: 7 },
    { subject: "Software Engineering", score: 82, studyHours: 5.5 },
  ];

  const attendanceData = [
    { subject: "Data Structures", attendance: 95, score: 92 },
    { subject: "Computer Networks", attendance: 78, score: 78 },
    { subject: "Database Systems", attendance: 88, score: 85 },
    { subject: "Operating Systems", attendance: 92, score: 88 },
    { subject: "Software Engineering", attendance: 85, score: 82 },
  ];

  const trendData = [
    { month: "Jan", score: 75 },
    { month: "Feb", score: 78 },
    { month: "Mar", score: 82 },
    { month: "Apr", score: 85 },
    { month: "May", score: 88 },
    { month: "Jun", score: 87 },
  ];

  const sleepData = [
    { sleep: 6, score: 75 },
    { sleep: 6.5, score: 78 },
    { sleep: 7, score: 85 },
    { sleep: 7.5, score: 88 },
    { sleep: 8, score: 92 },
    { sleep: 5.5, score: 72 },
  ];

  const distractionData = [
    { name: "Focused Study", value: 65, color: "#10B981" },
    { name: "Screen Time", value: 35, color: "#EF4444" },
  ];

  const chartConfig = {
    score: { label: "Score", color: "#3B82F6" },
    studyHours: { label: "Study Hours", color: "#10B981" },
    attendance: { label: "Attendance", color: "#8B5CF6" },
    sleep: { label: "Sleep Hours", color: "#F59E0B" },
  };

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

          {/* Study Hours vs Performance */}
          <div className="grid lg:grid-cols-2 gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="var(--color-score)" 
                        strokeWidth={3}
                        dot={{ fill: "var(--color-score)", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Attendance vs Performance & Sleep Analysis */}
          <div className="grid lg:grid-cols-2 gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Sleep vs Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={250}>
                    <ScatterChart data={sleepData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sleep" name="Sleep Hours" />
                      <YAxis dataKey="score" name="Score" />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value, name) => [
                          `${value}${name === 'sleep' ? ' hrs' : ' marks'}`,
                          name === 'sleep' ? 'Sleep Hours' : 'Score'
                        ]}
                      />
                      <Scatter dataKey="score" fill="var(--color-sleep)" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Focus Analysis */}
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
                    <span className="text-gray-700 dark:text-gray-300">Focused Study Time: 65%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-700 dark:text-gray-300">Screen Distractions: 35%</span>
                  </div>
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-300 font-medium">
                      ⚠️ Distraction Alert
                    </p>
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                      Your screen time is compromising focus. Try reducing non-study screen time.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
