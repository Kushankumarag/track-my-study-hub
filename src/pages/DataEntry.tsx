
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";
import { useUserData, SubjectData } from "@/hooks/useUserData";
import { useNavigate } from "react-router-dom";

const DataEntry = () => {
  const { userData, saveUserData } = useUserData();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState<SubjectData[]>([
    { name: "", score: 0, attendance: 0 }
  ]);
  
  const [studyData, setStudyData] = useState({
    dailyStudyHours: "",
    sleepHours: "",
    screenTime: ""
  });

  const [profileData, setProfileData] = useState({
    name: "",
    branch: "",
    year: ""
  });

  // Load existing data on component mount
  useEffect(() => {
    if (userData.subjects.length > 0) {
      setSubjects(userData.subjects);
    }
    setStudyData({
      dailyStudyHours: userData.studyData.dailyStudyHours?.toString() || "",
      sleepHours: userData.studyData.sleepHours?.toString() || "",
      screenTime: userData.studyData.screenTime?.toString() || ""
    });
    setProfileData({
      name: userData.name,
      branch: userData.branch,
      year: userData.year
    });
  }, [userData]);

  const addSubject = () => {
    setSubjects([...subjects, { name: "", score: 0, attendance: 0 }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: keyof SubjectData, value: string | number) => {
    const updated = subjects.map((subject, i) => 
      i === index ? { ...subject, [field]: field === 'name' ? value : Number(value) } : subject
    );
    setSubjects(updated);
  };

  const handleSave = () => {
    // Validation
    const validSubjects = subjects.filter(s => s.name.trim() && s.score >= 0 && s.attendance >= 0);
    
    if (validSubjects.length === 0) {
      toast.error("Please add at least one subject with valid data");
      return;
    }

    if (!profileData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    // Save to localStorage via the hook
    saveUserData({
      name: profileData.name,
      branch: profileData.branch,
      year: profileData.year,
      subjects: validSubjects,
      studyData: {
        dailyStudyHours: Number(studyData.dailyStudyHours) || 0,
        sleepHours: Number(studyData.sleepHours) || 0,
        screenTime: Number(studyData.screenTime) || 0
      }
    });

    toast.success("Data saved successfully! 🎉");
    
    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
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

          {/* Profile Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Alex Kumar"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    placeholder="e.g. Computer Science"
                    value={profileData.branch}
                    onChange={(e) => setProfileData({...profileData, branch: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    placeholder="e.g. 3rd Year"
                    value={profileData.year}
                    onChange={(e) => setProfileData({...profileData, year: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
                              value={subject.score || ''}
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
                              value={subject.attendance || ''}
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
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
