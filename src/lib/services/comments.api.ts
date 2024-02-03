import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { QueryKeys } from "../constants";

// TODO: render comments, create mutation for delete and editing the comment, and prefetch the data in server
export async function getPostComments(take: number, lastCursor: string) {
  const res = await axios.get("/api/comments", {
    params: { take, lastCursor },
  });

  return res.data.data as TPage<TComment[]>;
}

export function useGetPostComments() {
  return useInfiniteQuery({
    queryKey: [QueryKeys.Comments],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getPostComments(5, lastCursor),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createComment"],
    mutationFn: async (content: string) => {
      const res = await axios.post("/api/comments", { content });
      return res.data.newComment as TComment;
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData<InfiniteData<TPage<TComment[]>>>(
        [QueryKeys.Comments],
        (oldData) => {
          const newData = oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page, index) => {
                  if (index === 0) {
                    return {
                      ...page,
                      data: [
                        newComment,
                        ...(page.data ? page.data : new Array()),
                      ],
                    };
                  }
                  return page;
                }),
              }
            : oldData;

          return newData;
        },
      );
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error("An error occured while creating a comment");
    },
    onSettled: async () => {
        await queryClient.invalidateQueries({queryKey: [QueryKeys.Comments]})
    }
  });
}

