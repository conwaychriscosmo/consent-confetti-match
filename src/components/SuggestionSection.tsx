
import React from "react";
import { Button } from "@/components/ui/button";
import { getRandomQuestions } from "@/utils/surveySuggestions";
import { ComfortEmoji } from "./ComfortEmoji";

type Props = {
  show: boolean;
  onToggle: () => void;
  onAddSuggestion: (q: { text: string; emoji?: string }) => void;
};

export const SuggestionSection = ({
  show,
  onToggle,
  onAddSuggestion,
}: Props) => (
  <>
    <Button
      size="sm"
      variant="secondary"
      onClick={onToggle}
      className="mb-2"
    >
      {show ? "Hide Suggestions" : "Smart/Suggested Questions"}
    </Button>
    {show && (
      <div className="flex flex-wrap gap-2 p-3 mb-2 bg-accent/60 rounded">
        {getRandomQuestions(5).map((q, idx) => (
          <Button
            key={q.text}
            size="sm"
            variant="outline"
            className="text-xs"
            type="button"
            onClick={() => onAddSuggestion(q)}
          >
            {q.text} <ComfortEmoji emoji={q.emoji || ""} />
          </Button>
        ))}
      </div>
    )}
  </>
);
