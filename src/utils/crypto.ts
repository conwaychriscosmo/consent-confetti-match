
// Simple ephemeral "encryption" using Web Crypto (MVP: XOR w/ session key stored in-memory)
// In real deployment, use honest cryptography.
// For now, handles encode/decode and timed self-destruct.

export function generateSessionKey(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Very basic (not secure!) encoding
export function encodeSurvey(survey: any, key: string) {
  const json = JSON.stringify(survey);
  // XOR each char for naive "encryption"
  return btoa(
    json
      .split("")
      .map((ch, i) => String.fromCharCode(ch.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
      .join("")
  );
}

export function decodeSurvey(payload: string, key: string) {
  try {
    const decoded = atob(payload)
      .split("")
      .map((ch, i) => String.fromCharCode(ch.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
      .join("");
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}
