
import React from "react";
import { Button } from "@/components/ui/button";
import { ComfortEmoji } from "./ComfortEmoji";

const ANSWERS = ["yes", "no"];
const QUESTION_TYPE_LABELS = {
  yesno: "Yes/No",
  number: "Number",
  text: "Text / Freeform",
};

type Question = {
  text: string;
  emoji?: string;
  type: "yesno" | "number" | "text";
  acceptableAnswers?: string[];
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
  <div className="mb-4 flex flex-col gap-2">
    {questions.map((q, i) => (
      <div
        key={i}
        className="flex flex-col gap-1 bg-secondary/80 rounded py-2 px-2 relative"
      >
        <div className="flex items-center gap-2">
          <span>{i + 1}.</span>
          <span>
            {q.text}
            {q.emoji && <ComfortEmoji emoji={q.emoji} />}
            <span className="ml-2 text-xs rounded px-1 bg-accent/50 opacity-80">
              {QUESTION_TYPE_LABELS[q.type]}
            </span>
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto px-1.5 text-destructive"
            onClick={() => onRemove(i)}
            type="button"
          >
            ✕
          </Button>
        </div>
        {q.type === "yesno" && (
          <div className="flex gap-2 mt-1 ml-5 text-sm">
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
      </div>
    ))}
  </div>
);
