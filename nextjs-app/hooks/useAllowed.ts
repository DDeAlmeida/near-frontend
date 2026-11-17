import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Whether the connected NEAR account is on the server-side allowlist.
// `undefined` while loading / no account connected.
export function useAllowed({ accountId }: { accountId: string | null }) {
  const { data: allowed } = useQuery({
    queryKey: ["allowed", accountId ?? ""],
    enabled: !!accountId,
    queryFn: async () =>
      await axios
        .get("/api/allowlist", { params: { accountId } })
        .then((res) => res.data.allowed as boolean)
        .catch(() => false),
  });
  return allowed;
}
