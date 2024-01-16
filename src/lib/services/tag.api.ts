import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useSearchTags(searchTerm: string) {
  return useQuery({
    queryKey: [searchTerm],
    queryFn: async () => {
      const response = await axios.get("/api/tags", {
        params: { query: searchTerm },
      });

      return response.data.tags as { tagName: string }[];
    },
    staleTime: 1000,
    enabled: false,
  });
}
