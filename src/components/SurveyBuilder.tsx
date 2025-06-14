
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRandomQuestions, SUGGESTED_QUESTIONS } from "@/utils/surveySuggestions";
import { ComfortEmoji, EmojiLegend } from "./ComfortEmoji";

type Question = {
  text: string;
  emoji?: string;
};

export type Survey = {
  questions: Question[];
};

export const SurveyBuilder = ({
  onBuilt,
}: {
  onBuilt: (survey: Survey) => void;
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [input, setInput] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);

  const addLine = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setQuestions([
      ...questions,
      { text: trimmed }
    ]);
    setInput("");
  };

  const addSuggestion = (question: Question) => {
    setQuestions([...questions, question]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
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
            <div key={i} className="flex items-center gap-2 bg-secondary/80 rounded py-1 px-2">
              <span>{i + 1}. {q.text}{q.emoji && <ComfortEmoji emoji={q.emoji} />}</span>
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto px-1.5 text-destructive"
                onClick={() => removeQuestion(i)}
                type="button"
              >✕</Button>
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
