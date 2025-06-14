
import React from "react";
import { Survey } from "@/components/SurveyBuilder";
import { SurveyBuilder } from "@/components/SurveyBuilder";
import { SessionLinkModal } from "@/components/SessionLinkModal";
import { toast } from "@/hooks/use-toast";

type Props = {
  sessionModalOpen: boolean;
  setSessionModalOpen: (b: boolean) => void;
  sessionUrl: string;
  onSurveyBuilt: (svy: Survey) => void;
};

export function WaitStep({
  sessionModalOpen,
  setSessionModalOpen,
  sessionUrl,
  onSurveyBuilt,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SurveyBuilder
        onBuilt={onSurveyBuilt}
      />
      <SessionLinkModal
        open={sessionModalOpen}
        url={sessionUrl}
        onCopy={() => {
          navigator.clipboard.writeText(sessionUrl);
          toast({ description: "Session link copied!" });
        }}
        onClose={() => {
          setSessionModalOpen(false);
        }}
      />
    </div>
  );
}
