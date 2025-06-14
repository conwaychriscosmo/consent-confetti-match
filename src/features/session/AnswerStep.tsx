
import React from "react";
import { SurveyAnswer, SurveyAnswers } from "@/components/SurveyAnswer";
import { Survey } from "@/components/SurveyBuilder";

type Props = {
  survey: Survey | null;
  onSubmit: (answers: SurveyAnswers) => void;
};

export function AnswerStep({ survey, onSubmit }: Props) {
  if (!survey) return <div>Session not found.</div>;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <SurveyAnswer survey={survey} onSubmit={onSubmit} />
    </div>
  );
}
