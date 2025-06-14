
import React from "react";
import { Button } from "@/components/ui/button";
import { ComfortEmoji } from "./ComfortEmoji";

const ANSWERS = ["yes", "no"];
const QUESTION_TYPE_LABELS = {
  yesno: "Yes/No",
  number: "Number",
  text: "Text / Freeform",
  multiplechoice: "Multiple Choice",
};

type Question = {
  text: string;
  emoji?: string;
  type: "yesno" | "number" | "text" | "multiplechoice";
  acceptableAnswers?: string[];
  min?: number;
  max?: number;
  llmCriteria?: string;
  choices?: string[];
};

type Props = {
  questions: Question[];
  onRemove: (idx: number) => void;
  onRubricChange: (idx: number, answer: string) => void;
};

export const QuestionList = ({
  questions,
  onRemove,
  onRubricChange,
}: Props) => (
  <div className="mb-4 flex flex-col gap-2 w-full">
    {questions.map((q, i) => (
      <div
        key={i}
        className="flex flex-col gap-1 bg-secondary/80 rounded py-2 px-2 sm:px-3 relative"
      >
        <div className="flex items-center gap-2">
          <span>{i + 1}.</span>
          <span className="flex flex-wrap items-center gap-2 w-full">
            {q.text}
            {q.emoji && <ComfortEmoji emoji={q.emoji} />}
            <span className="ml-2 text-xs rounded px-1 bg-accent/50 opacity-80">
              {QUESTION_TYPE_LABELS[q.type]}
            </span>
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto px-2 text-destructive"
            onClick={() => onRemove(i)}
            type="button"
            aria-label="Remove question"
          >
            ✕
          </Button>
        </div>
        {/* Yes/No criteria */}
        {q.type === "yesno" && (
          <div className="flex gap-2 mt-1 ml-5 text-sm flex-wrap">
            <span className="opacity-80">Acceptable:</span>
            {ANSWERS.map((ans) => (
              <Button
                key={ans}
                type="button"
                size="sm"
                variant={
                  q.acceptableAnswers?.includes(ans)
                    ? "default"
                    : "outline"
                }
                className="px-3"
                onClick={() => onRubricChange(i, ans)}
              >
                {ans === "yes" ? "Yes" : "No"}
              </Button>
            ))}
          </div>
        )}
        {/* Number min/max criteria */}
        {q.type === "number" && (q.min != null || q.max != null) && (
          <div className="flex gap-2 mt-1 ml-5 text-xs opacity-80 flex-wrap">
            {q.min != null && (
              <span>Min: <span className="font-semibold">{q.min}</span></span>
            )}
            {q.max != null && (
              <span>Max: <span className="font-semibold">{q.max}</span></span>
            )}
          </div>
        )}
        {/* Text LLM criteria */}
        {q.type === "text" && q.llmCriteria && (
          <div className="flex gap-1 mt-1 ml-5 text-xs opacity-80 flex-wrap">
            <span>Criteria:</span>
            <span className="italic">{q.llmCriteria}</span>
          </div>
        )}
        {/* Multiple choice criteria */}
        {q.type === "multiplechoice" && q.choices && q.choices.length > 0 && (
          <div className="flex flex-col gap-1 mt-1 ml-5 text-sm">
            <div className="mb-1">Choices:</div>
            <div className="flex flex-wrap gap-2">
              {q.choices.map((choice, idx) => (
                <Button
                  key={idx}
                  type="button"
                  size="sm"
                  variant={
                    q.acceptableAnswers?.includes(choice)
                      ? "default"
                      : "outline"
                  }
                  className="px-3"
                  onClick={() => onRubricChange(i, choice)}
                >
                  {String.fromCharCode(65 + idx)}. {choice}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);
