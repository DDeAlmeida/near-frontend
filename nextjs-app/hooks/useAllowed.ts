import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Whether the full pool id (e.g. chainflow.pool.near) is on the server-side allowlist.
// `undefined` while loading.
export function usePoolAllowed({ fullPoolId }: { fullPoolId: string }) {
  const { data: allowed } = useQuery({
    queryKey: ["poolAllowed", fullPoolId],
    enabled: !fullPoolId.startsWith("."),
    queryFn: async () =>
      await axios
        .get("/api/allowlist", { params: { pool: fullPoolId } })
        .then((res) => res.data.allowed as boolean)
        .catch(() => false),
  });
  return allowed;
}
