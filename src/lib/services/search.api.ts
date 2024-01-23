import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../constants";

export function useSearchPosts(searchTerm: string) {
  return useQuery({
    queryKey: [QueryKeys.SearchedPosts, searchTerm],
    queryFn: async () => {
      const res = await axios.get("/api/search", {
        params: { query: searchTerm },
      });
      return res.data.data as TPost[]
    },
    staleTime: 1000 * 60,
    enabled: false,
  });
}