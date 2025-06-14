
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

const emoji = {
  aligned: "✅",
  notAligned: "❌",
};

export const ResultReveal: React.FC<{
  aligned: boolean;
  onExpire: () => void;
}> = ({ aligned, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(60); // seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((s) => s - 1);
    }, 1000);
    const expire = setTimeout(onExpire, 60000);
    return () => {
      clearInterval(interval);
      clearTimeout(expire);
    };
  }, [onExpire]);

  return (
    <Card className="w-full max-w-md mx-auto text-center py-8 px-6 animate-fadeInUp shadow-xl">
      <div className="text-5xl mb-4">
        {aligned ? <Check className="inline-block text-green-600 mb-1" size={60} /> : <X className="inline-block text-red-500 mb-1" size={60} />}
        <span className="ml-2">{aligned ? emoji.aligned : emoji.notAligned}</span>
      </div>
      <div className={`text-2xl font-semibold mb-3 ${aligned ? "text-green-700" : "text-red-600"}`}>
        {aligned ? "Aligned 🎉" : "Not aligned"}
      </div>
      <div className="mb-2 text-muted-foreground text-md">
        This result will vanish in {timeLeft} second{timeLeft === 1 ? "" : "s"}.
      </div>
      <div className="text-xs text-muted-foreground">No answers saved. Nothing is tracked.</div>
    </Card>
  );
};
