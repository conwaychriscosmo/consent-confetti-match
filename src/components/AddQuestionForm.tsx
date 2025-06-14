
import React from "react";
import { Button } from "@/components/ui/button";

const ANSWERS = ["yes", "no"];
type QuestionType = "yesno" | "number" | "text";

type Props = {
  input: string;
  type: QuestionType;
  activeRubric: string[];
  onInputChange: (v: string) => void;
  onTypeChange: (v: QuestionType) => void;
  onRubricToggle: (v: string) => void;
  onAdd: () => void;
};

export const AddQuestionForm = ({
  input,
  type,
  activeRubric,
  onInputChange,
  onTypeChange,
  onRubricToggle,
  onAdd,
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
        </select>
        <Button type="submit" variant="default">
          Add
        </Button>
      </form>
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
    </>
  );
};
