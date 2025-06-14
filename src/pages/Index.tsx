
import React, { useState } from "react";
import { SurveyBuilder, Survey } from "@/components/SurveyBuilder";
import { SurveyAnswers } from "@/components/SurveyAnswer";
import { ResultReveal } from "@/components/ResultReveal";
import { HomeStep } from "@/features/session/HomeStep";
import { AnswerStep } from "@/features/session/AnswerStep";
import { ResultStep } from "@/features/session/ResultStep";
import { GoneStep } from "@/features/session/GoneStep";

// Step types for the local flow
type Step = "HOME" | "BUILD" | "ANSWER" | "RESULT" | "GONE";

const Index = () => {
  const [step, setStep] = useState<Step>("HOME");
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [result, setResult] = useState<boolean | null>(null);

  // --- Step 1: Home UI ---
  if (step === "HOME") {
    return (
      <HomeStep
        onCreateClick={() => setStep("BUILD")}
      />
    );
  }

  // --- Step 2: Survey builder ---
  if (step === "BUILD") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SurveyBuilder
          onBuilt={(svy) => {
            setSurvey(svy);
            setStep("ANSWER");
          }}
        />
        <div className="fixed top-2 right-2 opacity-60 text-xs z-10 pointer-events-none">
          When done, hand the device to your partner.
        </div>
      </div>
    );
  }

  // --- Step 3: Answer Survey (Doer phase) ---
  if (step === "ANSWER") {
    return (
      <AnswerStep
        survey={survey}
        onSubmit={(answers: SurveyAnswers) => {
          // For YES/NO questions, check if doer answered as expected. 
          // For other types, simply require non-empty responses.
          let ok =
            survey &&
            answers.length === survey.questions.length &&
            answers.every((a, i) => {
              const q = survey.questions[i];
              if (q.type === "yesno") {
                return q.acceptableAnswers?.includes(a.value);
              }
              return typeof a.value === "string" && a.value.length > 0;
            });
          setResult(!!ok);
          setStep("RESULT");
          setTimeout(() => setStep("GONE"), 65000);
        }}
      />
    );
  }

  // --- Step 4: Results Reveal ---
  if (step === "RESULT") {
    return (
      <ResultStep
        aligned={!!result}
        onExpire={() => setStep("GONE")}
      />
    );
  }

  // --- Step 5: Ephemeral Vanish ---
  if (step === "GONE") {
    return <GoneStep />;
  }

  return null;
};

export default Index;
