
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmojiLegend } from "./ComfortEmoji";
import { QuestionList } from "./QuestionList";
import { AddQuestionForm } from "./AddQuestionForm";
import { SuggestionSection } from "./SuggestionSection";

type QuestionType = "yesno" | "number" | "text" | "multiplechoice";
type Question = {
  text: string;
  emoji?: string;
  type: QuestionType;
  acceptableAnswers?: string[];
  min?: number;
  max?: number;
  llmCriteria?: string;
  choices?: string[];
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
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [llmCriteria, setLLMCriteria] = useState("");

  // Multiple choice state
  const [choices, setChoices] = useState<string[]>(["", ""]);

  React.useEffect(() => {
    // Reset MC options/rubric on type change
    if (type === "multiplechoice" && choices.length < 2) {
      setChoices(["", ""]);
      setActiveRubric([]);
    } else if (type !== "multiplechoice") {
      setChoices(["", ""]);
    }
    if (type === "yesno") {
      setActiveRubric(["yes"]);
    }
  // eslint-disable-next-line
  }, [type]);

  const resetFields = () => {
    setInput("");
    setType("yesno");
    setActiveRubric(["yes"]);
    setMinValue("");
    setMaxValue("");
    setLLMCriteria("");
    setChoices(["", ""]);
  };

  const addLine = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    let question: Question;
    if (type === "yesno") {
      question = { text: trimmed, type, acceptableAnswers: [...activeRubric] };
    } else if (type === "number") {
      question = {
        text: trimmed,
        type,
        min: minValue !== "" ? Number(minValue) : undefined,
        max: maxValue !== "" ? Number(maxValue) : undefined,
      };
    } else if (type === "text") {
      question = {
        text: trimmed,
        type,
        llmCriteria: llmCriteria.trim() ? llmCriteria.trim() : undefined,
      };
    } else if (type === "multiplechoice") {
      // Must have at least 2 non-empty choices
      const validChoices = choices.map(c => c.trim()).filter(Boolean);
      if (validChoices.length < 2) return;
      question = {
        text: trimmed,
        type,
        choices: validChoices,
        acceptableAnswers: activeRubric.filter(a => validChoices.includes(a)),
      };
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
      questions.map((q, i) => {
        if (i !== idx) return q;
        if (q.type === "yesno" || q.type === "multiplechoice") {
          const acceptableAnswers = q.acceptableAnswers ?? [];
          return {
            ...q,
            acceptableAnswers: acceptableAnswers.includes(answer)
              ? acceptableAnswers.filter((a) => a !== answer)
              : [...acceptableAnswers, answer],
          };
        }
        return q;
      })
    );
  };

  // MC choices logic
  const handleChoiceChange = (idx: number, v: string) => {
    setChoices((prev) => {
      const arr = [...prev];
      arr[idx] = v;
      return arr;
    });
    // If editing a choice, and it was marked acceptable, sync rubric text
    setActiveRubric((r) =>
      r.filter(ans => choices.includes(ans))
    );
  };

  const handleAddChoice = () => {
    if (choices.length >= 6) return;
    setChoices([...choices, ""]);
  };

  const handleRemoveChoice = (idx: number) => {
    if (choices.length <= 2) return;
    setChoices(choices.filter((_, i) => i !== idx));
    setActiveRubric((r) =>
      r.filter(ans => ans !== choices[idx])
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
          minValue={minValue}
          maxValue={maxValue}
          onMinChange={setMinValue}
          onMaxChange={setMaxValue}
          llmCriteria={llmCriteria}
          onLLMCriteriaChange={setLLMCriteria}
          onAdd={addLine}
          // MC props
          choices={choices}
          onChoiceChange={handleChoiceChange}
          onAddChoice={handleAddChoice}
          onRemoveChoice={handleRemoveChoice}
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

