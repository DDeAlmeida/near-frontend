import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Comma separated full pool ids allowed to use the app,
// e.g. "chainflow.pool.near,pandateam.poolv1.near".
// Fails closed: if the variable is unset or empty, no pool is allowed.
function getAllowedPools(): Set<string> {
  return new Set(
    (process.env.ALLOWED_POOLS ?? "")
      .split(",")
      .map((pool) => pool.trim().toLowerCase())
      .filter((pool) => pool.length > 0),
  );
}

export async function GET(req: NextRequest) {
  const pool = req.nextUrl.searchParams.get("pool")?.trim().toLowerCase();
  // Only answers for the pool asked about, the list itself is never exposed.
  return Response.json({
    allowed: !!pool && getAllowedPools().has(pool),
  });
}
