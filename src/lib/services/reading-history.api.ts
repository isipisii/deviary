import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { QueryKeys } from "../constants";
import { usePathname } from "next/navigation";

// TODO: FINISH THE CREATION OF READING HISTORY
export async function getReadingHistories(take: number, lastCursor: string) {
  const response = await axios.get("/api/reading-histories", {
    params: { take, lastCursor },
  });
  return response.data.data as TPage<TReadingHistory[]>;
}

export function useGetReadingHistories() {
  return useInfiniteQuery({
    queryKey: [QueryKeys.ReadingHistories],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getReadingHistories(5, lastCursor),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  });
}

export function useCreateReadHistory() {
  const queryClient = useQueryClient();
  const path = usePathname();

  return useMutation({
    mutationKey: ["createReadHistory"],
    mutationFn: async (postId: string) => {
      return await axios.post(
        "/api/reading-histories",
        {},
        { params: { postId } },
      );
    },
    onSuccess: async (data, postId) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ReadingHistories],
      });
    },
      onError: (error, postId, context) => {
        console.log(error)
      },
  });
}

export function useRemoveReadingHistory() {
  const queryClient = useQueryClient();
  const path = usePathname();

  return useMutation({
    mutationKey: ["removeReadingHistory"],
    mutationFn: async (readingHistoryId: string) => {
      return await axios.delete("/api/reading-histories", {
        params: {
          readingHistoryId,
        },
      });
    },
    onMutate: (readingHistoryId) => {
      const previousReadingHistories = queryClient.getQueryData([
        QueryKeys.ReadingHistories,
      ]);

      //perform optimistic update
      queryClient.setQueryData<InfiniteData<TPage<TReadingHistory[]>>>(
        [QueryKeys.ReadingHistories],
        (oldData) => {
          const newData = oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  if (page) {
                    return {
                      ...page,
                      data: page.data.filter(
                        (readingHistory) =>
                          readingHistory.id !== readingHistoryId,
                      ),
                    };
                  }
                  return page;
                }),
              }
            : oldData;

          return newData;
        },
      );

      toast.success("Removed from histories");
      return { previousReadingHistories };
    },
    onError: (error, readingHistory, context) => {
      queryClient.setQueryData([QueryKeys.ReadingHistories], context?.previousReadingHistories);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ReadingHistories],
      });
    },
  });
}

