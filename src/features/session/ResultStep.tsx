
import React from "react";
import { ResultReveal } from "@/components/ResultReveal";

type Props = {
  aligned: boolean;
  onExpire: () => void;
};

export function ResultStep({ aligned, onExpire }: Props) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background">
      <ResultReveal aligned={aligned} onExpire={onExpire} />
    </div>
  );
}
