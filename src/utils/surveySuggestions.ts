
export const SUGGESTED_QUESTIONS = [
  { text: "Are you comfortable with using protection (e.g., condoms/barriers)?", emoji: "🚦" },
  { text: "Do you want to know each other's testing history?", emoji: "🔬" },
  { text: "Are you open to stopping or pausing at any time if requested?", emoji: "✋" },
  { text: "Do you want aftercare or a check-in after?", emoji: "💬" },
  { text: "Are you comfortable discussing safe words or signals?", emoji: "🟡" },
  { text: "Is spontaneous/unplanned OK, or do you prefer scheduling?", emoji: "📅" },
  { text: "How do you want to handle new partners?", emoji: "🌱" },
  { text: "Anything absolutely off-limits (hard boundaries)?", emoji: "⛔" },
  { text: "Are there things you definitely want to try?", emoji: "🌶" },
  { text: "Anything that always helps you feel safe or respected?", emoji: "🫶" },
];

export function getRandomQuestions(count = 4) {
  // Shuffle and return N
  return SUGGESTED_QUESTIONS
    .map((q) => ({ ...q, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .slice(0, count)
    .map(({ order, ...rest }) => rest);
}
