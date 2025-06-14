import React, { useState } from "react";
import { SurveyBuilder, Survey } from "@/components/SurveyBuilder";
import { SessionLinkQR } from "@/components/SessionLinkQR";
import { SurveyAnswer, SurveyAnswers } from "@/components/SurveyAnswer";
import { ResultReveal } from "@/components/ResultReveal";
import { encodeSurvey, decodeSurvey, generateSessionKey } from "@/utils/crypto";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// App memory "ephemeral" sessions
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 min

// In-memory "database" for demo (not for prod!)
const EPHEMERAL_DB: Record<string, any> = {};

function urlsBase() {
  return window.location.origin + window.location.pathname;
}

const Index = () => {
  // State machine
  const [step, setStep] = useState<"HOME" | "BUILD" | "WAIT" | "ANSWER" | "RESULT" | "GONE">("HOME");
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [partnerSurvey, setPartnerSurvey] = useState<Survey | null>(null);
  const [surveyKey, setSurveyKey] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [sessionUrl, setSessionUrl] = useState<string>("");
  const [myAnswers, setMyAnswers] = useState<SurveyAnswers>([]);
  const [partnerAnswers, setPartnerAnswers] = useState<SurveyAnswers>([]);
  const [result, setResult] = useState<boolean | null>(null);

  // Session Cleanup
  React.useEffect(() => {
    // Simple: prune expired "sessions" in demo "DB"
    const interval = setInterval(() => {
      Object.entries(EPHEMERAL_DB).forEach(([sid, data]) => {
        if (Date.now() > data.expires) delete EPHEMERAL_DB[sid];
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Step 1: Home UI ---
  if (step === "HOME") {
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
              <Button className="w-full py-4 text-lg" onClick={() => setStep("BUILD")}>I want to create a session</Button>
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
                  // Try to load partner's survey
                  const entry = EPHEMERAL_DB[trueSid];
                  if (!entry || Date.now() > entry.expires) {
                    toast({ description: "Session not found or expired.", variant: "destructive" });
                  } else {
                    setSessionId(trueSid);
                    setSurveyKey(entry.partnerKey);
                    setPartnerSurvey(decodeSurvey(entry.partnerSurvey, entry.partnerKey));
                    setStep("ANSWER");
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

  // --- Step 2: Build Survey UI ---
  if (step === "BUILD") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SurveyBuilder
          onBuilt={(svy) => {
            // Generate session
            const key = generateSessionKey();
            const partnerKey = generateSessionKey();
            const sid = Math.random().toString(36).slice(2, 10);
            // Save question to memory (demo: both user and partner must answer)
            EPHEMERAL_DB[sid] = {
              survey: encodeSurvey(svy, key),
              partnerSurvey: encodeSurvey(svy, partnerKey), // Partner's view
              key,
              partnerKey,
              expires: Date.now() + SESSION_TIMEOUT,
              userAnswers: null,
              partnerAnswers: null,
            };
            setSurvey(svy);
            setSurveyKey(key);
            setSessionId(sid);
            setSessionUrl(`${urlsBase()}?session=${sid}`);
            setStep("WAIT");
          }}
        />
      </div>
    );
  }

  // --- Step 3: Show Session Link & QR ---
  if (step === "WAIT") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <SessionLinkQR
          url={sessionUrl}
          onCopy={() => {
            navigator.clipboard.writeText(sessionUrl);
            toast({ description: "Session link copied!" });
          }}
        />
        <div className="text-center mt-8">
          <div className="mb-2 text-lg text-muted-foreground">
            Waiting for partner to join and answer your survey.
          </div>
          <Button
            variant="ghost"
            className="mt-2 text-xs underline"
            onClick={() => { setStep("HOME"); }}
          >Cancel Session</Button>
        </div>
      </div>
    );
  }

  // --- Step 4: Answer Survey (Incoming or Outgoing) ---
  if (step === "ANSWER") {
    const svy = partnerSurvey;
    if (!svy) return <div>Session not found.</div>;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <SurveyAnswer
          survey={svy}
          onSubmit={(answers) => {
            setMyAnswers(answers);
            const entry = EPHEMERAL_DB[sessionId];
            if (!entry) {
              setResult(false);
              setStep("RESULT");
              return;
            }
            // Rubric check:
            // For yesno: acceptableAnswers includes
            // For number/text: always accept (no rubric)
            const creatorSurvey = decodeSurvey(entry.survey, entry.key);
            let ok =
              answers.length === creatorSurvey.questions.length &&
              answers.every((a, i) => {
                const q = creatorSurvey.questions[i];
                if (q.type === "yesno") {
                  return q.acceptableAnswers?.includes(a.value);
                }
                // For number/text types, accept any response
                return typeof a.value === "string" && a.value.length > 0;
              });
            entry.partnerAnswers = answers;
            setResult(ok);
            setStep("RESULT");
            setTimeout(() => { setStep("GONE"); }, 65000);
            setTimeout(() => { delete EPHEMERAL_DB[sessionId]; }, 70000);
          }}
        />
      </div>
    );
  }

  // --- Step 5: Results Reveal ---
  if (step === "RESULT") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background">
        <ResultReveal
          aligned={!!result}
          onExpire={() => setStep("GONE")}
        />
      </div>
    );
  }

  // --- Step 6: Ephemeral Vanish ---
  if (step === "GONE") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-10 text-center bg-muted max-w-md">
          <div className="text-xl font-semibold mb-4">Session Has Self-Destructed</div>
          <div className="mb-2 opacity-80">
            All answers and sessions erased.<br />Start again for full privacy.
          </div>
          <Button className="mt-6 w-full" onClick={() => window.location.reload()}>
            Start Over
          </Button>
        </Card>
      </div>
    );
  }

  return null;
};

export default Index;
