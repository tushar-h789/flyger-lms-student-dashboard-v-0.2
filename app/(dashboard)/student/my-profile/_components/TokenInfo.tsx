"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";

type Props = {
  idToken: string | null;
  accessToken: string | null;
  decodedIdClaims: Record<string, unknown> | null;
};

export function TokenInfo({ idToken, accessToken, decodedIdClaims }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>ID Token (JWT)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Raw ID Token</p>
              <CopyButton value={idToken ?? ""} label="Copy" />
            </div>
            <pre className="text-xs p-3 bg-gray-100 rounded overflow-x-auto whitespace-pre-wrap wrap-break-word max-h-56 sm:max-h-72">{idToken || "N/A"}</pre>
          </div>
          <div>
            <p className="text-sm text-gray-500">Decoded ID Token Claims</p>
            <pre className="text-xs p-3 bg-gray-100 rounded overflow-x-auto whitespace-pre-wrap wrap-break-word max-h-56 sm:max-h-72">
              {decodedIdClaims ? JSON.stringify(decodedIdClaims, null, 2) : "N/A"}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access Token</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Raw Access Token</p>
            <CopyButton value={accessToken ?? ""} label="Copy" />
          </div>
          <pre className="text-xs p-3 bg-gray-100 rounded overflow-x-auto break-all max-h-56 sm:max-h-72">{accessToken || "N/A"}</pre>
        </CardContent>
      </Card>
    </div>
  );
}


