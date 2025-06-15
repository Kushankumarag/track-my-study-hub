import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Target, TrendingUp, Brain, Users, Moon, Sun } from "lucide-react";
import { useState } from "react";
const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  const benefits = [{
    icon: Target,
    title: "See Where You Stand",
    description: "Get clear insights into your academic performance across all subjects"
  }, {
    icon: TrendingUp,
    title: "Track Study Habits",
    description: "Monitor your study patterns and identify what works best for you"
  }, {
    icon: Brain,
    title: "Get Smart Tips",
    description: "Receive personalized recommendations based on your performance data"
  }, {
    icon: Users,
    title: "Compare Anonymously",
    description: "See how you stack up against peers while maintaining privacy"
  }];
  return <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : ''}`}>
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          TrackMyStudy
        </div>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Know Yourself,
            <span className="text-indigo-600 dark:text-indigo-400 block">Study Smarter</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">Track your performance, stay ahead, and study efficiently with data-driven insights tailored for PU and Engineering students.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg">
                Start Tracking
              </Button>
            </Link>
            <Link to="/analysis">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="text-center mb-16">
          <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            "Discipline beats motivation. Progress, not perfection."
          </blockquote>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6 text-center">
                <benefit.icon className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>)}
        </div>

        {/* Hero Illustration Placeholder */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-12 text-white max-w-4xl mx-auto">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-4">Your Academic Journey, Visualized</h3>
            <p className="text-lg opacity-90">
              Transform your grades, attendance, and study habits into actionable insights
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 TrackMyStudy. Empowering students to achieve their best.</p>
      </footer>
    </div>;
};
export default Index;