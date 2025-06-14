
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRandomQuestions, SUGGESTED_QUESTIONS } from "@/utils/surveySuggestions";
import { ComfortEmoji, EmojiLegend } from "./ComfortEmoji";

type Question = {
  text: string;
  emoji?: string;
  acceptableAnswers: string[]; // NEW: "yes"[] or "yes"|"no"[]
};

export type Survey = {
  questions: Question[];
};

const ANSWERS = ["yes", "no"];

export const SurveyBuilder = ({
  onBuilt,
}: {
  onBuilt: (survey: Survey) => void;
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [input, setInput] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);

  const [activeRubric, setActiveRubric] = useState<string[]>(["yes"]); // For form

  const addLine = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setQuestions([
      ...questions,
      { text: trimmed, acceptableAnswers: [...activeRubric] }
    ]);
    setInput("");
    setActiveRubric(["yes"]);
  };

  const addSuggestion = (question: { text: string, emoji?: string }) => {
    setQuestions([...questions, { ...question, acceptableAnswers: ["yes"] }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const setRubricForNext = (answer: string) => {
    setActiveRubric(r => r.includes(answer) ? r.filter(a => a !== answer) : [...r, answer]);
  };

  const setRubricForExisting = (idx: number, answer: string) => {
    setQuestions(questions =>
      questions.map((q, i) =>
        i === idx
          ? {
              ...q,
              acceptableAnswers: q.acceptableAnswers.includes(answer)
                ? q.acceptableAnswers.filter(a => a !== answer)
                : [...q.acceptableAnswers, answer]
            }
          : q
      )
    );
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-lg bg-background border-2 border-primary/20">
      <div className="p-6">
        <h2 className="font-semibold text-lg mb-3">
          1. Add Your Questions
        </h2>
        <EmojiLegend />

        <div className="mb-4 flex flex-col gap-2">
          {questions.map((q, i) => (
            <div key={i} className="flex flex-col gap-1 bg-secondary/80 rounded py-2 px-2 relative">
              <div className="flex items-center gap-2">
                <span>{i + 1}.</span>
                <span>{q.text}{q.emoji && <ComfortEmoji emoji={q.emoji} />}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto px-1.5 text-destructive"
                  onClick={() => removeQuestion(i)}
                  type="button"
                >✕</Button>
              </div>
              <div className="flex gap-2 mt-1 ml-5 text-sm">
                <span className="opacity-80">Acceptable:</span>
                {ANSWERS.map(ans => (
                  <Button
                    key={ans}
                    type="button"
                    size="sm"
                    variant={q.acceptableAnswers.includes(ans) ? "default" : "outline"}
                    className="px-3"
                    onClick={() => setRubricForExisting(i, ans)}
                  >
                    {ans === "yes" ? "Yes" : "No"}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            addLine();
          }}
          className="flex gap-2 mb-2"
        >
          <input
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring"
            placeholder="Type a question (add emoji for comfort)..."
            value={input}
            onChange={e => setInput(e.target.value)}
            maxLength={120}
          />
          <Button type="submit" variant="default">
            Add
          </Button>
        </form>
        <div className="flex gap-2 mb-2 ml-1">
          <span className="opacity-60 text-xs mt-2">Acceptable:</span>
          {ANSWERS.map(ans => (
            <Button
              key={ans}
              type="button"
              size="sm"
              variant={activeRubric.includes(ans) ? "default" : "outline"}
              className="px-3"
              onClick={() => setRubricForNext(ans)}
            >
              {ans === "yes" ? "Yes" : "No"}
            </Button>
          ))}
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowSuggest((v) => !v)}
          className="mb-2"
        >
          {showSuggest ? "Hide Suggestions" : "Smart/Suggested Questions"}
        </Button>
        {showSuggest && (
          <div className="flex flex-wrap gap-2 p-3 mb-2 bg-accent/60 rounded">
            {getRandomQuestions(5).map((q, idx) => (
              <Button
                key={q.text}
                size="sm"
                variant="outline"
                className="text-xs"
                type="button"
                onClick={() => addSuggestion(q)}
              >
                {q.text} <ComfortEmoji emoji={q.emoji || ""} />
              </Button>
            ))}
          </div>
        )}
        <Button
          className="mt-3 w-full"
          disabled={questions.length < 2}
          onClick={() => onBuilt({ questions })}
        >
          Start Session
        </Button>
      </div>
    </Card>
  );
};
