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

export interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  present: boolean;
  notes?: string;
}

export interface GoalAnalytics {
  date: string;
  totalGoals: number;
  completedGoals: number;
  completionRate: number;
  priorityBreakdown: {
    high: { total: number; completed: number };
    medium: { total: number; completed: number };
    low: { total: number; completed: number };
  };
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  streakHistory: { date: string; maintained: boolean }[];
}

export interface StressRecord {
  id: string;
  date: string;
  level: number; // 1-10 scale
  notes?: string;
  factors?: string[]; // exam, assignment, personal, etc.
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
  attendanceRecords: AttendanceRecord[];
  goalAnalytics: GoalAnalytics[];
  studyStreak: StudyStreak;
  stressRecords: StressRecord[];
  lastUpdated: string;
}

// Add Challenge types
export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: "daily" | "weekly";
  target: number;
  progress: number;
  active: boolean;
  startedAt: string; // ISO date
  completed: boolean;
  completedAt?: string;
}

const defaultChallenge: Challenge | null = null;

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
  attendanceRecords: [],
  goalAnalytics: [],
  studyStreak: {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: '',
    streakHistory: []
  },
  stressRecords: [],
  lastUpdated: new Date().toISOString()
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  // Challenge mode: keep outside userData for flexibility, but persist to localStorage
  const [challenge, setChallenge] = useState<Challenge | null>(() => {
    const stored = localStorage.getItem('trackMyStudyChallenge');
    return stored ? JSON.parse(stored) : defaultChallenge;
  });

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
          dailyStats: parsedData.dailyStats || [],
          attendanceRecords: parsedData.attendanceRecords || [],
          goalAnalytics: parsedData.goalAnalytics || [],
          studyStreak: parsedData.studyStreak || defaultUserData.studyStreak,
          stressRecords: parsedData.stressRecords || []
        };
        setUserData(mergedData);
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
  }, []);

  // Save challenge to localStorage
  const saveChallenge = (updated: Challenge | null) => {
    if (updated) {
      setChallenge(updated);
      localStorage.setItem('trackMyStudyChallenge', JSON.stringify(updated));
    } else {
      setChallenge(null);
      localStorage.removeItem('trackMyStudyChallenge');
    }
  };

  // Start a new challenge (overwrites current)
  const startChallenge = (challengeType: "daily" | "weekly") => {
    let newChallenge: Challenge;
    if (challengeType === "daily") {
      newChallenge = {
        id: `challenge-daily-${Date.now()}`,
        name: "Study 5 Days in a Row",
        description: "Study for at least 30 minutes 5 days in a row.",
        type: "daily",
        target: 5,
        progress: 0,
        active: true,
        startedAt: new Date().toISOString(),
        completed: false,
      };
    } else {
      newChallenge = {
        id: `challenge-weekly-${Date.now()}`,
        name: "Complete 7 Sessions This Week",
        description: "Finish 7 study sessions in the current week.",
        type: "weekly",
        target: 7,
        progress: 0,
        active: true,
        startedAt: new Date().toISOString(),
        completed: false,
      };
    }
    saveChallenge(newChallenge);
  };

  // Reset the current challenge
  const resetChallenge = () => {
    saveChallenge(null);
  };

  // Progress challenge automatically based on study data
  useEffect(() => {
    if (!challenge || !challenge.active || challenge.completed) return;

    let progress = challenge.progress;
    if (challenge.type === "daily") {
      // Count #days in a row with >=30min in last N days (target=N)
      const streakDays = [];
      let count = 0;
      let date = new Date();
      for (let i = 0; i < challenge.target; i++) {
        const dateStr = date.toISOString().split('T')[0];
        const stat = userData.dailyStats.find(s => s.date === dateStr && s.totalMinutes >= 30);
        if (stat) {
          count += 1;
          streakDays.push(dateStr);
        } else {
          break;
        }
        date.setDate(date.getDate() - 1);
      }
      progress = count;
    } else if (challenge.type === "weekly") {
      // Sessions completed in current calendar week
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 7);
      const count = userData.studySessions.filter(s =>
        s.completed &&
        new Date(s.date) >= weekStart &&
        new Date(s.date) < weekEnd
      ).length;
      progress = count;
    }

    if (progress !== challenge.progress) {
      const updated = { ...challenge, progress };
      // Complete if target met
      if (progress >= challenge.target && !challenge.completed) {
        updated.completed = true;
        updated.completedAt = new Date().toISOString();
        updated.active = false;
      }
      saveChallenge(updated);
    }
    // eslint-disable-next-line
  }, [userData.dailyStats, userData.studySessions]);

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
    updateStudyStreak(); // Update streak when completing a session
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

  const markAttendance = (subject: string, present: boolean, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingRecord = userData.attendanceRecords.find(
      record => record.date === today && record.subject === subject
    );

    let updatedRecords;
    if (existingRecord) {
      updatedRecords = userData.attendanceRecords.map(record =>
        record.id === existingRecord.id
          ? { ...record, present, notes }
          : record
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: `${Date.now()}-${subject}`,
        date: today,
        subject,
        present,
        notes
      };
      updatedRecords = [...userData.attendanceRecords, newRecord];
    }

    saveUserData({ attendanceRecords: updatedRecords });
    updateSubjectAttendance(subject);
  };

  const updateSubjectAttendance = (subjectName: string) => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const recentRecords = userData.attendanceRecords.filter(
      record => record.subject === subjectName && new Date(record.date) >= last30Days
    );

    if (recentRecords.length === 0) return;

    const presentCount = recentRecords.filter(record => record.present).length;
    const attendancePercentage = Math.round((presentCount / recentRecords.length) * 100);

    const updatedSubjects = userData.subjects.map(subject =>
      subject.name === subjectName
        ? { ...subject, attendance: attendancePercentage }
        : subject
    );

    saveUserData({ subjects: updatedSubjects });
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return userData.attendanceRecords.filter(record => record.date === today);
  };

  const updateGoalAnalytics = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysGoals = userData.dailyGoals.filter(goal => goal.date === today);

    if (todaysGoals.length === 0) return;

    const completedGoals = todaysGoals.filter(goal => goal.completed).length;
    const completionRate = Math.round((completedGoals / todaysGoals.length) * 100);

    const priorityBreakdown = {
      high: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      low: { total: 0, completed: 0 }
    };

    todaysGoals.forEach(goal => {
      priorityBreakdown[goal.priority].total++;
      if (goal.completed) {
        priorityBreakdown[goal.priority].completed++;
      }
    });

    const newAnalytics: GoalAnalytics = {
      date: today,
      totalGoals: todaysGoals.length,
      completedGoals,
      completionRate,
      priorityBreakdown
    };

    const updatedAnalytics = userData.goalAnalytics.filter(analytics => analytics.date !== today);
    updatedAnalytics.push(newAnalytics);
    
    // Keep only last 30 days
    const last30Days = updatedAnalytics.slice(-30);
    saveUserData({ goalAnalytics: last30Days });
  };

  const getGoalCompletionTrend = () => {
    const last7Days = userData.goalAnalytics.slice(-7);
    return last7Days.map(analytics => ({
      date: analytics.date,
      rate: analytics.completionRate
    }));
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
    updateGoalAnalytics();
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

  // Study Streak Functions
  const updateStudyStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayStats = userData.dailyStats.find(stat => stat.date === today);
    
    if (!todayStats || todayStats.totalMinutes < 30) return; // Minimum 30 minutes to count

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = userData.studyStreak;

    if (userData.studyStreak.lastStudyDate === yesterdayStr) {
      // Continue streak
      newStreak = {
        ...userData.studyStreak,
        currentStreak: userData.studyStreak.currentStreak + 1,
        lastStudyDate: today,
        longestStreak: Math.max(userData.studyStreak.longestStreak, userData.studyStreak.currentStreak + 1)
      };
    } else if (userData.studyStreak.lastStudyDate !== today) {
      // Start new streak or reset
      newStreak = {
        ...userData.studyStreak,
        currentStreak: 1,
        lastStudyDate: today,
        longestStreak: Math.max(userData.studyStreak.longestStreak, 1)
      };
    }

    // Add to streak history
    const streakHistory = [...userData.studyStreak.streakHistory, { date: today, maintained: true }];
    newStreak.streakHistory = streakHistory.slice(-30); // Keep last 30 days

    saveUserData({ studyStreak: newStreak });
  };

  const checkStreakMaintenance = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If we missed yesterday and had a streak, reset it
    if (userData.studyStreak.lastStudyDate === yesterdayStr && userData.studyStreak.currentStreak > 0) {
      const todayStats = userData.dailyStats.find(stat => stat.date === today);
      if (!todayStats || todayStats.totalMinutes < 30) {
        // Streak broken
        saveUserData({
          studyStreak: {
            ...userData.studyStreak,
            currentStreak: 0
          }
        });
      }
    }
  };

  // Stress Monitoring Functions
  const recordStressLevel = (level: number, notes?: string, factors?: string[]) => {
    const today = new Date().toISOString().split('T')[0];
    const existingRecord = userData.stressRecords.find(record => record.date === today);

    let updatedRecords;
    if (existingRecord) {
      updatedRecords = userData.stressRecords.map(record =>
        record.id === existingRecord.id
          ? { ...record, level, notes, factors }
          : record
      );
    } else {
      const newRecord: StressRecord = {
        id: `stress-${Date.now()}`,
        date: today,
        level,
        notes,
        factors
      };
      updatedRecords = [...userData.stressRecords, newRecord];
    }

    // Keep only last 30 days
    const last30Days = updatedRecords.slice(-30);
    saveUserData({ stressRecords: last30Days });
  };

  const getTodayStressLevel = () => {
    const today = new Date().toISOString().split('T')[0];
    return userData.stressRecords.find(record => record.date === today);
  };

  const getStressTrend = () => {
    return userData.stressRecords.slice(-7).map(record => ({
      date: record.date,
      level: record.level
    }));
  };

  const getAverageStressLevel = () => {
    if (userData.stressRecords.length === 0) return 0;
    const total = userData.stressRecords.reduce((sum, record) => sum + record.level, 0);
    return Math.round((total / userData.stressRecords.length) * 10) / 10;
  };

  // Add new helper for weekly sleep
  const getWeeklySleepHours = () => {
    // Try to get from dailyStats if present, else fallback to static
    // For now, just multiply the current sleepHours by 7 (from studyData)
    return userData.studyData.sleepHours
      ? Math.round(userData.studyData.sleepHours * 7)
      : 0;
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
    markAttendance,
    getTodayAttendance,
    updateGoalAnalytics,
    getGoalCompletionTrend,
    // New streak functions
    updateStudyStreak,
    checkStreakMaintenance,
    // New stress monitoring functions
    recordStressLevel,
    getTodayStressLevel,
    getStressTrend,
    getAverageStressLevel,
    getWeeklySleepHours,
    metrics: calculateMetrics(),
    // Challenge mode exports:
    challenge,
    startChallenge,
    resetChallenge,
    saveChallenge,
  };
};
