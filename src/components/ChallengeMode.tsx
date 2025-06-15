
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "@/components/ui/use-toast";

export const ChallengeMode: React.FC = () => {
  const { challenge, startChallenge, resetChallenge } = useUserData();

  const handleStart = (type: "daily" | "weekly") => {
    startChallenge(type);
    toast({
      title: "Challenge Started!",
      description:
        type === "daily"
          ? "5-Day Daily Challenge is on. Study at least 30 min each day!"
          : "Weekly Challenge active. Finish 7 sessions this week!"
    });
  };

  const handleReset = () => {
    resetChallenge();
    toast({ title: "Challenge mode reset." });
  };

  React.useEffect(() => {
    if (challenge?.completed) {
      toast({
        title: "🎉 Challenge Complete!",
        description: `Congrats! You completed: ${challenge.name}`,
        duration: 5000
      });
    }
  }, [challenge?.completed]);

  if (!challenge) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Challenge Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-gray-600 dark:text-gray-400">
            Can you beat a challenge? Pick a mode to set a special goal and earn bragging rights!
          </div>
          <div className="flex gap-3 mb-3">
            <Button variant="outline" onClick={() => handleStart("daily")}>
              Start Daily Streak: 5 Days
            </Button>
            <Button variant="outline" onClick={() => handleStart("weekly")}>
              Start Weekly: 7 Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-violet-300 bg-violet-50 dark:bg-violet-900/10">
      <CardHeader>
        <CardTitle>
          {challenge.completed ? "✅ Challenge Complete!" : "🏆 Challenge Mode"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 font-semibold">{challenge.name}</div>
        <div className="mb-3 text-gray-700 dark:text-gray-300">{challenge.description}</div>
        <div className="mb-3">
          <Progress value={(challenge.progress / challenge.target) * 100} className="h-3" />
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Progress: {challenge.progress}/{challenge.target}
          </div>
        </div>
        {challenge.completed ? (
          <Button variant="ghost" onClick={handleReset}>Reset & Try Again</Button>
        ) : (
          <Button variant="outline" onClick={handleReset}>Cancel Challenge</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeMode;
