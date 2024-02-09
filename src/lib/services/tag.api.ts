import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QueryKeys } from "../constants";

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

export async function getPostsByTag(
  lastCursor: string,
  take: number,
  tagName: string,
) {
  const res = await axios.get(`/api/tags/${tagName}`, {
    params: {
      lastCursor,
      take,
    },
  });
  return res.data.data as TPage<TPost[]>;
}

export function useGetPostsByTag(tagName: string) {
  return useInfiniteQuery({
    queryKey: [QueryKeys.PostsByTag, tagName],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) =>
      getPostsByTag(lastCursor, 5, tagName),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  });
}


function upvotePostsByTagOptimisticUpdate() {
  
}