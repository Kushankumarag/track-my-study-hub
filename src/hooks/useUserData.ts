
import { useState, useEffect } from 'react';

export interface SubjectData {
  name: string;
  score: number;
  attendance: number;
}

export interface StudyData {
  dailyStudyHours: number;
  sleepHours: number;
  screenTime: number;
}

export interface DailyGoal {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD format
  priority: 'low' | 'medium' | 'high';
}

export interface WeeklySchedule {
  [key: string]: { // day of week (monday, tuesday, etc)
    planned: number;
    completed: number;
    subjects: string[];
  };
}

export interface UserData {
  name: string;
  branch: string;
  year: string;
  subjects: SubjectData[];
  studyData: StudyData;
  dailyGoals: DailyGoal[];
  weeklySchedule: WeeklySchedule;
  lastUpdated: string;
}

const defaultUserData: UserData = {
  name: "Student",
  branch: "Computer Science",
  year: "3rd Year",
  subjects: [],
  studyData: {
    dailyStudyHours: 0,
    sleepHours: 0,
    screenTime: 0
  },
  dailyGoals: [],
  weeklySchedule: {
    monday: { planned: 0, completed: 0, subjects: [] },
    tuesday: { planned: 0, completed: 0, subjects: [] },
    wednesday: { planned: 0, completed: 0, subjects: [] },
    thursday: { planned: 0, completed: 0, subjects: [] },
    friday: { planned: 0, completed: 0, subjects: [] },
    saturday: { planned: 0, completed: 0, subjects: [] },
    sunday: { planned: 0, completed: 0, subjects: [] }
  },
  lastUpdated: new Date().toISOString()
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  useEffect(() => {
    const stored = localStorage.getItem('trackMyStudyData');
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        // Ensure all required fields exist
        const mergedData = {
          ...defaultUserData,
          ...parsedData,
          dailyGoals: parsedData.dailyGoals || [],
          weeklySchedule: parsedData.weeklySchedule || defaultUserData.weeklySchedule
        };
        setUserData(mergedData);
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
  }, []);

  const saveUserData = (newData: Partial<UserData>) => {
    const updatedData = {
      ...userData,
      ...newData,
      lastUpdated: new Date().toISOString()
    };
    setUserData(updatedData);
    localStorage.setItem('trackMyStudyData', JSON.stringify(updatedData));
  };

  const addDailyGoal = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newGoal: DailyGoal = {
      id: Date.now().toString(),
      text,
      completed: false,
      date: new Date().toISOString().split('T')[0],
      priority
    };
    
    const updatedGoals = [...userData.dailyGoals, newGoal];
    saveUserData({ dailyGoals: updatedGoals });
  };

  const toggleGoalCompletion = (goalId: string) => {
    const updatedGoals = userData.dailyGoals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    saveUserData({ dailyGoals: updatedGoals });
  };

  const updateWeeklySchedule = (day: string, data: { planned: number; subjects: string[] }) => {
    const updatedSchedule = {
      ...userData.weeklySchedule,
      [day.toLowerCase()]: {
        ...userData.weeklySchedule[day.toLowerCase()],
        planned: data.planned,
        subjects: data.subjects
      }
    };
    saveUserData({ weeklySchedule: updatedSchedule });
  };

  const updateDayProgress = (day: string, completed: number) => {
    const updatedSchedule = {
      ...userData.weeklySchedule,
      [day.toLowerCase()]: {
        ...userData.weeklySchedule[day.toLowerCase()],
        completed
      }
    };
    saveUserData({ weeklySchedule: updatedSchedule });
  };

  const clearUserData = () => {
    localStorage.removeItem('trackMyStudyData');
    setUserData(defaultUserData);
  };

  // Calculate derived metrics
  const calculateMetrics = () => {
    if (userData.subjects.length === 0) {
      return {
        averageScore: 0,
        averageAttendance: 0,
        totalSubjects: 0
      };
    }

    const totalScore = userData.subjects.reduce((sum, subject) => sum + subject.score, 0);
    const totalAttendance = userData.subjects.reduce((sum, subject) => sum + subject.attendance, 0);
    
    return {
      averageScore: Math.round((totalScore / userData.subjects.length) * 100) / 100,
      averageAttendance: Math.round((totalAttendance / userData.subjects.length) * 100) / 100,
      totalSubjects: userData.subjects.length
    };
  };

  return {
    userData,
    saveUserData,
    addDailyGoal,
    toggleGoalCompletion,
    updateWeeklySchedule,
    updateDayProgress,
    clearUserData,
    metrics: calculateMetrics()
  };
};
