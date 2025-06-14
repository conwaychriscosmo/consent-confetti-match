
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComfortEmoji } from "./ComfortEmoji";
import { Survey } from "./SurveyBuilder";

type Answer = { value: string };

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
  const [inputValue, setInputValue] = useState("");

  const current = survey.questions[step];

  // If re-entering a step, fill input
  React.useEffect(() => {
    setInputValue(answers[step]?.value ?? "");
    // eslint-disable-next-line
  }, [step]);

  const handleAnswer = (value: string) => {
    const updated = answers.slice();
    updated[step] = { value };
    setAnswers(updated);
    setTimeout(() => {
      if (step < survey.questions.length - 1) setStep(step + 1);
      else onSubmit(updated);
    }, 180);
  };

  const handleSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (current.type === "number" && inputValue.trim() === "") return;
    if (current.type === "number" && isNaN(Number(inputValue.trim()))) return;
    handleAnswer(inputValue.trim());
  };

  return (
    <div className="w-full flex justify-center p-0 sm:p-4 min-h-[95vh]">
      <Card className="w-full max-w-lg mx-auto shadow-md px-2 sm:px-6 py-6 flex flex-col justify-between bg-background 
        rounded-lg sm:rounded-xl
        min-h-[70vh] sm:min-h-[450px] 
        sm:p-6">
        <div className="mb-2 flex flex-col items-center w-full">
          <span className="font-semibold text-lg mb-2 text-center break-words">
            Q{step + 1}/{survey.questions.length}: {current.text}
            {current.emoji && <ComfortEmoji emoji={current.emoji} />}
          </span>
          <div className="flex flex-col gap-4 mt-4 w-full items-center">
            {/* Yes/No Input */}
            {current.type === "yesno" && (
              <div className="flex gap-4 justify-center w-full">
                <Button
                  size="lg"
                  className="px-9 w-1/2 sm:w-auto"
                  onClick={() => handleAnswer("yes")}
                  data-testid="yes"
                >
                  Yes
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-9 w-1/2 sm:w-auto"
                  onClick={() => handleAnswer("no")}
                  data-testid="no"
                >
                  No
                </Button>
              </div>
            )}

            {/* Number Input */}
            {current.type === "number" && (
              <form onSubmit={handleSubmitInput} className="w-full flex flex-col gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  required
                  className="border rounded px-3 py-3 w-full text-lg focus:ring"
                  data-testid="number-input"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <Button type="submit" size="lg" className="w-full mt-1">
                  Next
                </Button>
              </form>
            )}

            {/* Text Input */}
            {current.type === "text" && (
              <form onSubmit={handleSubmitInput} className="w-full flex flex-col gap-2">
                <textarea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  required
                  className="border rounded px-3 py-3 w-full text-base min-h-[90px] focus:ring"
                  maxLength={350}
                  data-testid="text-input"
                />
                <Button type="submit" size="lg" className="w-full mt-1">
                  Next
                </Button>
              </form>
            )}

            {/* Multiple Choice Input */}
            {current.type === "multiplechoice" && current.choices && (
              <div className="flex flex-col gap-3 w-full">
                {current.choices.map((choice, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    size="lg"
                    className="w-full text-base py-3"
                    variant={inputValue === choice ? "default" : "outline"}
                    onClick={() => {
                      setInputValue(choice);
                      setTimeout(() => handleAnswer(choice), 100);
                    }}
                    data-testid={`mc-choice-${idx}`}
                  >
                    {String.fromCharCode(65 + idx)}. {choice}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-0.5 mt-6 justify-center">
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
    </div>
  );
};

