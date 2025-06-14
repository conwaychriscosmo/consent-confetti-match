
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function GoneStep() {
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
