import React, { useState, useEffect } from "react";
import { SurveyBuilder, Survey } from "@/components/SurveyBuilder";
import { SurveyAnswer, SurveyAnswers } from "@/components/SurveyAnswer";
import { ResultReveal } from "@/components/ResultReveal";
import { decodeSurvey } from "@/utils/crypto";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { SessionLinkModal } from "@/components/SessionLinkModal";
import { useSessionCreator } from "@/hooks/useSessionCreator";
import { HomeStep } from "@/features/session/HomeStep";
import { WaitStep } from "@/features/session/WaitStep";
import { AnswerStep } from "@/features/session/AnswerStep";
import { ResultStep } from "@/features/session/ResultStep";
import { GoneStep } from "@/features/session/GoneStep";

// App memory "ephemeral" sessions (DB must match useSessionCreator)
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 min
const EPHEMERAL_DB: Record<string, any> = (typeof window !== "undefined" && (window as any).EPHEMERAL_DB)
  ? (window as any).EPHEMERAL_DB
  : {};

function urlsBase() {
  return window.location.origin + window.location.pathname;
}

const Index = () => {
  const [step, setStep] = useState<"HOME" | "WAIT" | "ANSWER" | "RESULT" | "GONE">("HOME");
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [partnerSurvey, setPartnerSurvey] = useState<Survey | null>(null);
  const [surveyKey, setSurveyKey] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [sessionUrl, setSessionUrl] = useState<string>("");
  const [myAnswers, setMyAnswers] = useState<SurveyAnswers>([]);
  const [result, setResult] = useState<boolean | null>(null);

  // For session creation modal
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const { createSession } = useSessionCreator();

  // Session Cleanup
  React.useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(EPHEMERAL_DB).forEach(([sid, data]) => {
        if (Date.now() > data.expires) delete EPHEMERAL_DB[sid];
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // NEW: Auto-detect "?session=" param and enter ANSWER mode if valid
  useEffect(() => {
    // Only run on load (not after answering/etc)
    if (step !== "HOME") return;
    const params = new URLSearchParams(window.location.search);
    const qSid = params.get("session");
    if (qSid) {
      const entry = EPHEMERAL_DB[qSid];
      if (!entry || Date.now() > entry.expires) {
        setStep("HOME"); // fallback to home if session is invalid
        // Optional: show toast about invalid/expired session
      } else {
        setSessionId(qSid);
        setSurveyKey(entry.partnerKey);
        setPartnerSurvey(decodeSurvey(entry.partnerSurvey, entry.partnerKey));
        setStep("ANSWER");
      }
    }
    // eslint-disable-next-line
  }, [step]);

  // --- Step 1: Home UI ---
  if (step === "HOME") {
    return (
      <HomeStep
        onCreateClick={() => setStep("WAIT")}
        onJoin={(trueSid: string) => {
          setSessionId(trueSid);
          setSurveyKey(EPHEMERAL_DB[trueSid].partnerKey);
          setPartnerSurvey(decodeSurvey(EPHEMERAL_DB[trueSid].partnerSurvey, EPHEMERAL_DB[trueSid].partnerKey));
          setStep("ANSWER");
        }}
        urlsBase={urlsBase}
        EPHEMERAL_DB={EPHEMERAL_DB}
      />
    );
  }

  // --- Step 2: Survey + Modal flow ---
  if (step === "WAIT") {
    return (
      <WaitStep
        sessionModalOpen={sessionModalOpen}
        setSessionModalOpen={setSessionModalOpen}
        sessionUrl={sessionUrl}
        onSurveyBuilt={(svy) => {
          // Create session and open modal for sharing
          const { key, sid, url } = createSession(svy);
          setSurvey(svy);
          setSurveyKey(key);
          setSessionId(sid);
          setSessionUrl(url);
          setSessionModalOpen(true);
        }}
      />
    );
  }

  // --- Step 3: Answer Survey ---
  if (step === "ANSWER") {
    return (
      <AnswerStep
        survey={partnerSurvey}
        onSubmit={(answers) => {
          setMyAnswers(answers);
          const entry = EPHEMERAL_DB[sessionId];
          if (!entry) {
            setResult(false);
            setStep("RESULT");
            return;
          }
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
    );
  }

  // --- Step 4: Results Reveal ---
  if (step === "RESULT") {
    return (
      <ResultStep
        aligned={!!result}
        onExpire={() => setStep("GONE")}
      />
    );
  }

  // --- Step 5: Ephemeral Vanish ---
  if (step === "GONE") {
    return <GoneStep />;
  }

  return null;
};

export default Index;
