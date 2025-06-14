
import { useState } from "react";
import { encodeSurvey, generateSessionKey } from "@/utils/crypto";
import type { Survey } from "@/components/SurveyBuilder";

const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 min

// WARNING: The DB object must match the one in Index.tsx
const EPHEMERAL_DB: Record<string, any> =
  (typeof window !== "undefined" && (window as any).EPHEMERAL_DB)
    ? (window as any).EPHEMERAL_DB
    : {};

function urlsBase() {
  if (typeof window === "undefined") return "";
  return window.location.origin + window.location.pathname;
}

export function useSessionCreator() {
  const [sessionId, setSessionId] = useState<string>("");
  const [sessionUrl, setSessionUrl] = useState<string>("");

  function createSession(svy: Survey) {
    const key = generateSessionKey();
    const partnerKey = generateSessionKey();
    const sid = Math.random().toString(36).slice(2, 10);
    EPHEMERAL_DB[sid] = {
      survey: encodeSurvey(svy, key),
      partnerSurvey: encodeSurvey(svy, partnerKey), // Partner's view
      key,
      partnerKey,
      expires: Date.now() + SESSION_TIMEOUT,
      userAnswers: null,
      partnerAnswers: null,
    };
    setSessionId(sid);
    setSessionUrl(`${urlsBase()}?session=${sid}`);
    return {
      key,
      partnerKey,
      sid,
      url: `${urlsBase()}?session=${sid}`,
    };
  }

  return { sessionId, sessionUrl, createSession };
}
