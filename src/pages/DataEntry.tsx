
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";

const DataEntry = () => {
  const [subjects, setSubjects] = useState([
    { name: "Data Structures", score: "", attendance: "" },
    { name: "Computer Networks", score: "", attendance: "" },
  ]);
  
  const [studyData, setStudyData] = useState({
    dailyStudyHours: "",
    sleepHours: "",
    screenTime: ""
  });

  const addSubject = () => {
    setSubjects([...subjects, { name: "", score: "", attendance: "" }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: string, value: string) => {
    const updated = subjects.map((subject, i) => 
      i === index ? { ...subject, [field]: value } : subject
    );
    setSubjects(updated);
  };

  const handleSave = () => {
    // Validation
    const hasValidData = subjects.some(s => s.name && s.score && s.attendance);
    if (!hasValidData) {
      toast.error("Please fill in at least one complete subject entry");
      return;
    }

    // Here you would typically save to localStorage or API
    console.log("Saving data:", { subjects, studyData });
    toast.success("Data saved successfully! 🎉");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Add Your Performance Data 📝
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your latest scores, attendance, and study habits to get personalized insights
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Subjects Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Subject Performance</CardTitle>
                  <Button onClick={addSubject} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Subject
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map((subject, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Subject {index + 1}
                        </h4>
                        {subjects.length > 1 && (
                          <Button
                            onClick={() => removeSubject(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid gap-3">
                        <div>
                          <Label htmlFor={`subject-name-${index}`}>Subject Name</Label>
                          <Input
                            id={`subject-name-${index}`}
                            placeholder="e.g. Data Structures"
                            value={subject.name}
                            onChange={(e) => updateSubject(index, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`score-${index}`}>Score (out of 100)</Label>
                            <Input
                              id={`score-${index}`}
                              type="number"
                              min="0"
                              max="100"
                              placeholder="85"
                              value={subject.score}
                              onChange={(e) => updateSubject(index, 'score', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`attendance-${index}`}>Attendance (%)</Label>
                            <Input
                              id={`attendance-${index}`}
                              type="number"
                              min="0"
                              max="100"
                              placeholder="90"
                              value={subject.attendance}
                              onChange={(e) => updateSubject(index, 'attendance', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Study Habits Section */}
            <Card>
              <CardHeader>
                <CardTitle>Study Habits & Lifestyle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="study-hours">Daily Study Hours</Label>
                    <Input
                      id="study-hours"
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      placeholder="6.5"
                      value={studyData.dailyStudyHours}
                      onChange={(e) => setStudyData({...studyData, dailyStudyHours: e.target.value})}
                    />
                    <p className="text-sm text-gray-500 mt-1">Average hours per day</p>
                  </div>

                  <div>
                    <Label htmlFor="sleep-hours">Sleep Hours</Label>
                    <Input
                      id="sleep-hours"
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      placeholder="7.5"
                      value={studyData.sleepHours}
                      onChange={(e) => setStudyData({...studyData, sleepHours: e.target.value})}
                    />
                    <p className="text-sm text-gray-500 mt-1">Average hours per night</p>
                  </div>

                  <div>
                    <Label htmlFor="screen-time">Daily Screen Time (Non-Study)</Label>
                    <Input
                      id="screen-time"
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      placeholder="3"
                      value={studyData.screenTime}
                      onChange={(e) => setStudyData({...studyData, screenTime: e.target.value})}
                    />
                    <p className="text-sm text-gray-500 mt-1">Social media, games, entertainment</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quick Tips 💡</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <p>• Aim for 7-8 hours of sleep for optimal performance</p>
                      <p>• Study in 25-minute focused blocks (Pomodoro)</p>
                      <p>• Keep screen time below study time for better focus</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <Button onClick={handleSave} size="lg" className="bg-green-600 hover:bg-green-700 px-8">
              <Save className="h-5 w-5 mr-2" />
              Save & Analyze Data
            </Button>
          </div>

          {/* Import Option */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Import from CSV (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Have data in a spreadsheet? Upload your CSV file here
                </p>
                <Button variant="outline">Choose CSV File</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
