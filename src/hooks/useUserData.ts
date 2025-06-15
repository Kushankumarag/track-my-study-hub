
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

export interface UserData {
  name: string;
  branch: string;
  year: string;
  subjects: SubjectData[];
  studyData: StudyData;
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
  lastUpdated: new Date().toISOString()
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  useEffect(() => {
    const stored = localStorage.getItem('trackMyStudyData');
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setUserData(parsedData);
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
    clearUserData,
    metrics: calculateMetrics()
  };
};
