"use client";

import { ReactNode } from "react";
import { useAllowed } from "@/hooks/useAllowed";
import { useNear } from "./near-provider";
import { Button } from "./ui/button";

// Blocks the whole app (node list, update, restart, migrate, troubleshoot...)
// until a NEAR account on the allowlist is connected.
export function AccessGate({ children }: { children: ReactNode }) {
  const { accountId, loading, modal, selector } = useNear();
  const allowed = useAllowed({ accountId });

  if (loading) {
    return <Message text="Loading..." />;
  }

  if (!accountId) {
    return (
      <Message text="Connect an authorized NEAR account to continue.">
        <Button onClick={() => modal.show()}>Connect NEAR wallet</Button>
      </Message>
    );
  }

  if (allowed === undefined) {
    return <Message text="Checking access..." />;
  }

  if (!allowed) {
    return (
      <Message
        text={`${accountId} is not authorized to use this app. Contact Meta Pool to request access.`}
      >
        <Button
          onClick={() => selector.wallet().then((wallet) => wallet.signOut())}
        >
          Disconnect {accountId}
        </Button>
      </Message>
    );
  }

  return <>{children}</>;
}

function Message({
  text,
  children,
}: {
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 items-center bg-[#0c2246d6] text-white rounded-lg p-6 max-w-xl mx-auto mt-10 text-center">
      <span className="break-words">{text}</span>
      {children}
    </div>
  );
}
