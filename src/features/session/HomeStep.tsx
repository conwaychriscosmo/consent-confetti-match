
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, ShieldCheck, EyeOff } from "lucide-react";

type Props = {
  onCreateClick: () => void;
};

const FEATURES = [
  {
    icon: Users,
    title: "Mutual Criteria",
    desc: "Each person enters their own questions—partner answers blind.",
  },
  {
    icon: ShieldCheck,
    title: "Just the Result",
    desc: (
      <>
        Reveal only <span className="font-semibold">"Aligned"</span> or <span className="font-semibold">"Not aligned"</span>.
      </>
    ),
  },
  {
    icon: EyeOff,
    title: "Ultra Private",
    desc: "No log-in, no data saved, no scores. Privacy-first design.",
  },
];

export function HomeStep({ onCreateClick }: Props) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background animate-fade-in">
      {/* Info + Branding */}
      <section className="w-full md:w-[46%] flex flex-col justify-center items-center md:items-end px-6 md:pr-20 py-10 bg-gradient-to-b from-blue-100/60 to-white border-b md:border-b-0 md:border-r border-border">
        <div className="max-w-lg w-full md:pr-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 leading-tight text-center md:text-right">
            <span className="text-blue-800">Zero-Knowledge Yes</span>
          </h1>
          <p className="mb-5 text-base sm:text-lg text-muted-foreground text-center md:text-right">
            Anonymous, instant survey for mutual consent and safety—without pressure, logs, or scores.
            <br className="hidden md:block" />
            Build questions in private. Hand the device to your partner when ready—answers are never stored.
          </p>
        </div>
      </section>
      {/* Features + CTA */}
      <section className="w-full md:flex-1 flex flex-col items-center justify-center px-4 pt-1 pb-10 md:py-0 bg-background">
        {/* Features */}
        <div className="w-full max-w-lg flex flex-col md:flex-row gap-5 mb-5 md:mb-9 mt-2">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className="flex flex-1 items-start gap-3 bg-secondary/70 rounded-lg py-4 px-3 md:px-5 transition hover:shadow-lg md:flex-col md:items-center md:gap-2"
            >
              <feat.icon className="text-blue-700 w-7 h-7 md:w-8 md:h-8 shrink-0 mb-0 md:mb-2" />
              <div>
                <div className="font-semibold text-sm md:text-base mb-0.5 md:text-center">{feat.title}</div>
                <div className="text-xs md:text-sm text-muted-foreground md:text-center">{feat.desc}</div>
              </div>
            </div>
          ))}
        </div>
        {/* CTA Card */}
        <Card className="w-full max-w-lg py-8 px-5 shadow-xl border bg-background flex flex-col items-center animate-scale-in">
          <h2 className="text-lg font-semibold mb-4 text-center">Start instantly, no log-in needed:</h2>
          <Button
            className="w-full py-4 text-lg font-bold animate-pulse"
            onClick={onCreateClick}
          >
            Create Private Survey Session
          </Button>
          <a
            href="https://docs.lovable.dev/tips-tricks/troubleshooting"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-muted-foreground underline text-xs hover:text-blue-700 transition story-link"
          >
            Read how it works & privacy details
          </a>
        </Card>
      </section>
    </div>
  );
}
