
import React from "react";

const EMOJI_INFO: Record<string, string> = {
  "🌶": "Adventurous",
  "🚦": "Cautious/Check-in",
  "🔬": "Testing/Science",
  "✋": "Consent Pause",
  "💬": "Aftercare/Communication",
  "🟡": "Safe-word",
  "📅": "Scheduled",
  "🌱": "New Experience",
  "⛔": "Hard Boundaries",
  "🫶": "Safety/Respect",
};

export const ComfortEmoji = ({ emoji }: { emoji: string }) => (
  <span title={EMOJI_INFO[emoji] || "Comfort"} className="inline-block text-xl align-baseline ml-1 select-none">{emoji}</span>
);

export const EmojiLegend = () => (
  <div className="flex flex-wrap gap-3 opacity-70 border rounded-md px-4 py-2 text-sm bg-muted mb-4">
    {Object.entries(EMOJI_INFO).map(([emoji, label]) => (
      <span key={emoji} className="flex items-center gap-1">
        <span className="text-lg">{emoji}</span>
        <span>{label}</span>
      </span>
    ))}
  </div>
);
