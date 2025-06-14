
import React from "react";
import { QRCode } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const SessionLinkQR = ({
  url,
  onCopy,
}: {
  url: string;
  onCopy: () => void;
}) => {
  return (
    <Card className="w-full max-w-md mx-auto p-6 text-center border-primary">
      <h2 className="font-bold text-xl mb-2">Session Ready</h2>
      <div className="mb-2">Share this QR or link with your partner.</div>
      <div className="flex justify-center my-4">
        <QRCode value={url} size={160} level="Q" bgColor="#FFF" fgColor="#222" />
      </div>
      <div className="select-all bg-muted p-2 rounded mb-2 text-sm break-words">{url}</div>
      <Button onClick={onCopy} className="mb-2 w-full">Copy Link</Button>
      <div className="text-muted-foreground text-xs mt-2">
        Session expires in ~10 min. No data is stored.
      </div>
    </Card>
  );
};
