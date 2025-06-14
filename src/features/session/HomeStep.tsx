
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  onCreateClick: () => void;
};

export function HomeStep({ onCreateClick }: Props) {
  return (
    <div className="flex flex-row w-full min-h-screen gap-0">
      {/* Info Area */}
      <div className="w-[42%] flex flex-col justify-center items-end pr-20 bg-gradient-to-b from-blue-100/60 to-white border-r border-border">
        <div className="max-w-lg pr-10 py-10">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            <span className="text-blue-800">Zero-Knowledge Yes</span>
          </h1>
          <p className="mb-4 text-lg text-muted-foreground">
            Anonymous, instant survey for mutual consent and safety—without pressure, logs, or scores.
            <br />
            <br />
            Build questions in private. When ready, hand the device to your partner — their answers are never stored.
          </p>
          <ul className="list-disc ml-6 mb-3 text-base space-y-1 opacity-80">
            <li>🧑‍🤝‍🧑 Each enters their own criteria — partner answers blind.</li>
            <li>✅ Reveal: “Aligned” or “Not aligned”—that’s it!</li>
            <li>🔐 No log-in, no history, nothing saved.</li>
          </ul>
          <div className="mt-8">
            <a href="https://docs.lovable.dev/tips-tricks/troubleshooting" target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline text-xs">
              Read how it works & privacy details
            </a>
          </div>
        </div>
      </div>
      {/* Actions Area */}
      <div className="flex-1 flex flex-col justify-center items-center bg-background">
        <Card className="w-full max-w-lg p-10 bg-background shadow-xl border">
          <h2 className="text-xl font-semibold mb-6">Get started:</h2>
          <Button className="w-full py-4 text-lg" onClick={onCreateClick}>
            Create Private Survey Session
          </Button>
        </Card>
      </div>
    </div>
  );
}
