//this is for axios' generic type response
interface ErrorResponse {
  message: string;
}

type TUser = {
  id: readonly string;
  email: string;
  onboarded?: boolean;
  name: string;
  image: string;
};

type TPage<TData> = {
  metaData: {
    hasNextPage: boolean;
    lastCursor: string;
  };
  data: TData;
};

type TPost = {
  type: "BLOG_POST" | "CODE_DIARY";
  tags: string[];
  id: readonly string;
  author: TUser;
  blog?: TBlog;
  diary?: TDiary;
  isBookmarked?: boolean;
  isUpvoted: boolean;
  upvoteCount: number;
  authorId?: readonly string;
  createdAt: Date;
};

type TComment = {
  id: readonly string;
  user: TUser;
  userId: readonly string;
  content: string;
  postId: readonly string;
  createdAt: Date;
  updatedAt: Date;
};

type TBlog = {
  content: string;
  thumbnail?: {
    imageKey?: string;
    imageUrl?: string;
  };
  title: string;
};

type TBookmark = {
  id: readonly string;
  postId: string;
  post: TPost;
  userId: string;
  user: TUser;
};

type TDiary = {
  title: string;
  codeSnippet?: string;
  description: string;
  solution: string;
};

type TComment = {
  id: readonly string;
  content: string;
  userId: string;
  user: TUser;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
};

type TNotification = {
  id: readonly string;
  sender: TUser;
  senderId: readonly string;
  recipientId: readonly string;
  post?: TPost;
  comment?: Partial<TComment>
  type: "UPVOTE" | "JOIN_REQUEST";
  viewed: boolean;
  postId: string;
  createdAt: Date;
};
