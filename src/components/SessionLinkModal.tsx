
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionLinkQR } from "./SessionLinkQR";

export function SessionLinkModal({
  open,
  url,
  onCopy,
  onClose,
}: {
  open: boolean;
  url: string;
  onCopy: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md px-0 py-5 bg-background" >
        <DialogHeader>
          <DialogTitle>Session Ready</DialogTitle>
          <DialogDescription>
            Share this link or QR code with your partner.
          </DialogDescription>
        </DialogHeader>
        <SessionLinkQR url={url} onCopy={onCopy} />
        <Button variant="secondary" className="mt-3 w-full" onClick={onClose}>Done</Button>
      </DialogContent>
    </Dialog>
  );
}
