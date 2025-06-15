
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Users } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

export const AttendanceTracker = () => {
  const { userData, markAttendance, getTodayAttendance } = useUserData();
  const todayAttendance = getTodayAttendance();

  const handleMarkAttendance = (subject: string, present: boolean) => {
    markAttendance(subject, present);
  };

  const getAttendanceStatus = (subjectName: string) => {
    return todayAttendance.find(record => record.subject === subjectName);
  };

  if (userData.subjects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Today's Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Add subjects to track attendance
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Today's Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {userData.subjects.map((subject) => {
            const attendanceRecord = getAttendanceStatus(subject.name);
            return (
              <div key={subject.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{subject.name}</div>
                  <div className="text-sm text-gray-600">
                    Overall: {subject.attendance}%
                  </div>
                </div>
                
                {attendanceRecord ? (
                  <Badge variant={attendanceRecord.present ? "default" : "destructive"}>
                    {attendanceRecord.present ? "Present" : "Absent"}
                  </Badge>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAttendance(subject.name, true)}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAttendance(subject.name, false)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Absent
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
