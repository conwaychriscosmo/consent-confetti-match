
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

type Props = {
  onCreateClick: () => void;
  onJoin: (sid: string) => void;
  urlsBase: () => string;
  EPHEMERAL_DB: Record<string, any>;
};

export function HomeStep({ onCreateClick, onJoin, urlsBase, EPHEMERAL_DB }: Props) {
  return (
    <div className="flex flex-row w-full min-h-screen gap-0">
      {/* Info Area */}
      <div className="w-[42%] flex flex-col justify-center items-end pr-20 bg-gradient-to-b from-blue-100/60 to-white border-r border-border">
        <div className="max-w-lg pr-10 py-10">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            <span className="text-blue-800">Zero-Knowledge Yes</span>
          </h1>
          <p className="mb-4 text-lg text-muted-foreground">
            Anonymous, instant survey to check for mutual consent and safety without pressure, logs, or scores. 
            <br />
            <br />
            Exchange “pre-consent” questions secretly — see only if you’re aligned.
          </p>
          <ul className="list-disc ml-6 mb-3 text-base space-y-1 opacity-80">
            <li>🚫 No sign-up, no storage, no history.</li>
            <li>🧑‍🤝‍🧑 Each enters their own criteria — partner answers blind.</li>
            <li>🔒 Ephemeral: Sessions expire 10 min after creation.</li>
            <li>🌐 Hand off session with link or QR code.</li>
            <li>✅ Reveal: “Aligned” or “Not aligned”—that’s it!</li>
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
          <div className="flex flex-col gap-4">
            <Button className="w-full py-4 text-lg" onClick={onCreateClick}>I want to create a session</Button>
            <div className="relative flex justify-center items-center text-muted-foreground mb-1">or</div>
            <Button
              className="w-full py-4"
              variant="secondary"
              onClick={() => {
                const sid = prompt("Partner gave you a code or link? Paste it below:");
                if (!sid) return;
                let trueSid = sid;
                if (sid.startsWith(urlsBase())) trueSid = sid.split("session=")[1] || sid.split("/s/")[1] || "";
                if (!trueSid) {
                  toast({ description: "Invalid session code or link.", variant: "destructive" });
                  return;
                }
                const entry = EPHEMERAL_DB[trueSid];
                if (!entry || Date.now() > entry.expires) {
                  toast({ description: "Session not found or expired.", variant: "destructive" });
                } else {
                  onJoin(trueSid);
                }
              }}
            >
              Join with code or link
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
