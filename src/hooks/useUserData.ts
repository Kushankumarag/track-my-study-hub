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

export interface BaselineData {
  subjects: SubjectData[];
  overallGPA: number;
  dateRecorded: string;
}

export interface PerformanceHistory {
  date: string;
  subjects: SubjectData[];
  overallGPA: number;
}

export interface StudySession {
  id: string;
  date: string;
  duration: number; // in minutes
  completed: boolean;
  subject?: string;
  startTime: string;
  endTime?: string;
}

export interface DailyStudyStats {
  date: string;
  totalMinutes: number;
  completedSessions: number;
  totalSessions: number;
  subjects: { [subject: string]: number };
}

export interface UserData {
  name: string;
  branch: string;
  year: string;
  subjects: SubjectData[];
  studyData: StudyData;
  dailyGoals: DailyGoal[];
  weeklySchedule: WeeklySchedule;
  baselineData?: BaselineData;
  performanceHistory: PerformanceHistory[];
  studySessions: StudySession[];
  dailyStats: DailyStudyStats[];
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
  performanceHistory: [],
  studySessions: [],
  dailyStats: [],
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
          weeklySchedule: parsedData.weeklySchedule || defaultUserData.weeklySchedule,
          performanceHistory: parsedData.performanceHistory || [],
          studySessions: parsedData.studySessions || [],
          dailyStats: parsedData.dailyStats || []
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

  const startStudySession = (duration: number, subject?: string) => {
    const session: StudySession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      duration,
      completed: false,
      subject,
      startTime: new Date().toISOString()
    };
    
    const updatedSessions = [...userData.studySessions, session];
    saveUserData({ studySessions: updatedSessions });
    return session.id;
  };

  const completeStudySession = (sessionId: string) => {
    const updatedSessions = userData.studySessions.map(session => 
      session.id === sessionId 
        ? { ...session, completed: true, endTime: new Date().toISOString() }
        : session
    );
    
    saveUserData({ studySessions: updatedSessions });
    updateDailyStats();
  };

  const updateDailyStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = userData.studySessions.filter(session => session.date === today);
    
    const totalMinutes = todaySessions
      .filter(session => session.completed)
      .reduce((sum, session) => sum + session.duration, 0);
    
    const completedSessions = todaySessions.filter(session => session.completed).length;
    const totalSessions = todaySessions.length;
    
    const subjects: { [subject: string]: number } = {};
    todaySessions
      .filter(session => session.completed && session.subject)
      .forEach(session => {
        const subject = session.subject!;
        subjects[subject] = (subjects[subject] || 0) + session.duration;
      });

    const newStats: DailyStudyStats = {
      date: today,
      totalMinutes,
      completedSessions,
      totalSessions,
      subjects
    };

    const updatedStats = userData.dailyStats.filter(stat => stat.date !== today);
    updatedStats.push(newStats);
    
    // Keep only last 30 days
    const last30Days = updatedStats.slice(-30);
    saveUserData({ dailyStats: last30Days });
  };

  const getWeeklyActualHours = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return userData.studySessions
      .filter(session => 
        session.completed && 
        new Date(session.date) >= weekAgo
      )
      .reduce((sum, session) => sum + session.duration, 0) / 60; // Convert to hours
  };

  const getStudyCompletionRate = () => {
    const last7Days = userData.studySessions.filter(session => {
      const sessionDate = new Date(session.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });

    if (last7Days.length === 0) return 0;
    
    const completed = last7Days.filter(session => session.completed).length;
    return Math.round((completed / last7Days.length) * 100);
  };

  const setBaselineData = (subjects: SubjectData[]) => {
    if (!userData.baselineData && subjects.length > 0) {
      const totalScore = subjects.reduce((sum, subject) => sum + subject.score, 0);
      const overallGPA = totalScore / subjects.length;
      
      const baseline: BaselineData = {
        subjects: [...subjects],
        overallGPA,
        dateRecorded: new Date().toISOString()
      };
      
      saveUserData({ baselineData: baseline });
    }
  };

  const updatePerformanceHistory = (subjects: SubjectData[]) => {
    if (subjects.length === 0) return;
    
    const totalScore = subjects.reduce((sum, subject) => sum + subject.score, 0);
    const overallGPA = totalScore / subjects.length;
    
    const newEntry: PerformanceHistory = {
      date: new Date().toISOString(),
      subjects: [...subjects],
      overallGPA
    };
    
    const updatedHistory = [...userData.performanceHistory, newEntry];
    // Keep only last 10 entries to avoid too much data
    const trimmedHistory = updatedHistory.slice(-10);
    
    saveUserData({ performanceHistory: trimmedHistory });
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
    setBaselineData,
    updatePerformanceHistory,
    startStudySession,
    completeStudySession,
    updateDailyStats,
    getWeeklyActualHours,
    getStudyCompletionRate,
    metrics: calculateMetrics()
  };
};
