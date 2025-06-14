
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ANSWERS = ["yes", "no"];
type QuestionType = "yesno" | "number" | "text" | "multiplechoice";

type Props = {
  input: string;
  type: QuestionType;
  activeRubric: string[];
  onInputChange: (v: string) => void;
  onTypeChange: (v: QuestionType) => void;
  onRubricToggle: (v: string) => void;
  minValue: string;
  maxValue: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  llmCriteria: string;
  onLLMCriteriaChange: (v: string) => void;
  onAdd: () => void;
  // For multiplechoice
  choices: string[];
  onChoiceChange: (idx: number, v: string) => void;
  onAddChoice: () => void;
  onRemoveChoice: (idx: number) => void;
};

export const AddQuestionForm = ({
  input,
  type,
  activeRubric,
  onInputChange,
  onTypeChange,
  onRubricToggle,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  llmCriteria,
  onLLMCriteriaChange,
  onAdd,
  // Multiple choice props
  choices,
  onChoiceChange,
  onAddChoice,
  onRemoveChoice,
}: Props) => {
  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          onAdd();
        }}
        className="flex gap-2 mb-2"
      >
        <input
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Type a question (add emoji for comfort)..."
          value={input}
          onChange={e => onInputChange(e.target.value)}
          maxLength={120}
          required
        />
        <select
          value={type}
          onChange={e => onTypeChange(e.target.value as QuestionType)}
          className="border rounded px-2 py-1 bg-muted text-sm"
        >
          <option value="yesno">Yes/No</option>
          <option value="number">Number</option>
          <option value="text">Text</option>
          <option value="multiplechoice">Multiple Choice</option>
        </select>
        <Button type="submit" variant="default">
          Add
        </Button>
      </form>

      {/* Criteria UI for Yes/No */}
      {type === "yesno" && (
        <div className="flex gap-2 mb-2 ml-1">
          <span className="opacity-60 text-xs mt-2">Acceptable:</span>
          {ANSWERS.map((ans) => (
            <Button
              key={ans}
              type="button"
              size="sm"
              variant={activeRubric.includes(ans) ? "default" : "outline"}
              className="px-3"
              onClick={() => onRubricToggle(ans)}
            >
              {ans === "yes" ? "Yes" : "No"}
            </Button>
          ))}
        </div>
      )}

      {/* Criteria UI for Number */}
      {type === "number" && (
        <div className="flex gap-2 mb-2 ml-1 items-center">
          <span className="opacity-60 text-xs mt-2">Limits:</span>
          <Input
            type="number"
            value={minValue}
            onChange={e => onMinChange(e.target.value)}
            placeholder="Min"
            min="0"
            className="w-20 text-xs"
          />
          <Input
            type="number"
            value={maxValue}
            onChange={e => onMaxChange(e.target.value)}
            placeholder="Max"
            min="0"
            className="w-20 text-xs"
          />
        </div>
      )}

      {/* Criteria UI for Text/Freeform */}
      {type === "text" && (
        <div className="flex flex-col gap-1 mb-2 ml-1">
          <label className="opacity-60 text-xs" htmlFor="llmCriteria">
            LLM Criteria (e.g. "must mention odd fetishes" etc):
          </label>
          <Input
            id="llmCriteria"
            placeholder="Describe the required answer"
            value={llmCriteria}
            onChange={e => onLLMCriteriaChange(e.target.value)}
            className="text-xs"
            maxLength={140}
          />
        </div>
      )}

      {/* Criteria UI for Multiple Choice */}
      {type === "multiplechoice" && (
        <div className="flex flex-col gap-1 mb-2 ml-1">
          <div className="opacity-60 text-xs mb-1 mt-1">Choices & Accepted answers:</div>
          <div className="flex flex-col gap-1">
            {choices.map((choice, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={choice}
                  onChange={e => onChoiceChange(idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  className="text-xs flex-1"
                  maxLength={60}
                  required
                  aria-label={`Choice ${idx + 1}`}
                />
                <Button
                  type="button"
                  size="sm"
                  variant={activeRubric.includes(choice) ? "default" : "outline"}
                  className="h-8 text-xs"
                  onClick={() => onRubricToggle(choice)}
                  disabled={!choice}
                >
                  Mark Acceptable
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onRemoveChoice(idx)}
                  aria-label="Remove choice"
                  disabled={choices.length <= 2}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-fit mt-1 text-xs"
              onClick={onAddChoice}
              disabled={choices.length >= 6}
            >
              Add Choice
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

