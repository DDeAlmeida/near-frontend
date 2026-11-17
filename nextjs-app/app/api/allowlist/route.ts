import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Comma separated NEAR account ids allowed to use the app, e.g. "alice.near,bob.near".
// Fails closed: if the variable is unset or empty, nobody is allowed.
function getAllowedAccounts(): Set<string> {
  return new Set(
    (process.env.ALLOWED_NEAR_ACCOUNTS ?? "")
      .split(",")
      .map((account) => account.trim().toLowerCase())
      .filter((account) => account.length > 0),
  );
}

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("accountId")?.toLowerCase();
  // Only answers for the account asked about, the list itself is never exposed.
  return Response.json({
    allowed: !!accountId && getAllowedAccounts().has(accountId),
  });
}
