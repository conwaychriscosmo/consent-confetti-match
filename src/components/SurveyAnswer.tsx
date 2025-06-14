
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComfortEmoji } from "./ComfortEmoji";
import { Survey } from "./SurveyBuilder";

type Answer = { value: string }; // yes/no

export type SurveyAnswers = Answer[];

export const SurveyAnswer = ({
  survey,
  onSubmit,
}: {
  survey: Survey;
  onSubmit: (answers: SurveyAnswers) => void;
}) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(
    Array(survey.questions.length).fill(null)
  );

  const setAns = (v: string) => {
    const updated = answers.slice();
    updated[step] = { value: v };
    setAnswers(updated);
    // Delay next question for animation
    setTimeout(() => {
      if (step < survey.questions.length - 1) setStep(step + 1);
      else onSubmit(updated);
    }, 180);
  };

  const current = survey.questions[step];

  return (
    <Card className="w-full max-w-md mx-auto shadow-md p-5 bg-background">
      <div className="mb-6 flex flex-col items-center">
        <span className="font-semibold text-lg mb-2">
          Q{step + 1}/{survey.questions.length}{": "}
          {current.text}{current.emoji && <ComfortEmoji emoji={current.emoji} />}
        </span>
        <div className="flex gap-4 mt-4">
          <Button
            size="lg"
            className="px-8"
            onClick={() => setAns("yes")}
            data-testid="yes"
          >
            Yes
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="px-8"
            onClick={() => setAns("no")}
            data-testid="no"
          >
            No
          </Button>
        </div>
      </div>
      <div className="flex gap-0.5 mt-3 justify-center">
        {survey.questions.map((_, i) => (
          <span
            key={i}
            className={
              "h-2 w-6 mx-0.5 rounded bg-accent transition-all " +
              (i === step ? "opacity-70" : "opacity-30")
            }
          />
        ))}
      </div>
    </Card>
  );
};
