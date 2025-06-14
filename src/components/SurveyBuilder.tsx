
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmojiLegend } from "./ComfortEmoji";
import { QuestionList } from "./QuestionList";
import { AddQuestionForm } from "./AddQuestionForm";
import { SuggestionSection } from "./SuggestionSection";

// Extended type supports yesno, number, text
type QuestionType = "yesno" | "number" | "text";
type Question = {
  text: string;
  emoji?: string;
  type: QuestionType;
  // For yesno only: which values are acceptable
  acceptableAnswers?: string[];
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
  const [type, setType] = useState<QuestionType>("yesno");
  const [activeRubric, setActiveRubric] = useState<string[]>(["yes"]);

  const resetFields = () => {
    setInput("");
    setType("yesno");
    setActiveRubric(["yes"]);
  };

  const addLine = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    let question: Question;
    if (type === "yesno") {
      question = { text: trimmed, type, acceptableAnswers: [...activeRubric] };
    } else {
      question = { text: trimmed, type };
    }
    setQuestions([...questions, question]);
    resetFields();
  };

  const addSuggestion = (question: { text: string; emoji?: string }) => {
    setQuestions([
      ...questions,
      { ...question, type: "yesno", acceptableAnswers: ["yes"] },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const setRubricForNext = (answer: string) => {
    setActiveRubric((r) =>
      r.includes(answer) ? r.filter((a) => a !== answer) : [...r, answer]
    );
  };

  const setRubricForExisting = (idx: number, answer: string) => {
    setQuestions((questions) =>
      questions.map((q, i) =>
        i === idx && q.type === "yesno"
          ? {
              ...q,
              acceptableAnswers: q.acceptableAnswers
                ? q.acceptableAnswers.includes(answer)
                  ? q.acceptableAnswers.filter((a) => a !== answer)
                  : [...q.acceptableAnswers, answer]
                : [answer],
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

        <QuestionList
          questions={questions}
          onRemove={removeQuestion}
          onRubricChange={setRubricForExisting}
        />

        <AddQuestionForm
          input={input}
          type={type}
          activeRubric={activeRubric}
          onInputChange={setInput}
          onTypeChange={setType}
          onRubricToggle={setRubricForNext}
          onAdd={addLine}
        />

        <SuggestionSection
          show={showSuggest}
          onToggle={() => setShowSuggest((v) => !v)}
          onAddSuggestion={addSuggestion}
        />

        <Button
          className="mt-3 w-full"
          disabled={questions.length < 2}
          onClick={() => {
            if (questions.length >= 2) {
              onBuilt({ questions });
            }
          }}
        >
          Start Session
        </Button>
      </div>
    </Card>
  );
};
