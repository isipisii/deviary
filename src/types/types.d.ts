//this is for axios' generic type response
interface ErrorResponse {
  message: string;
}

type TUser = {
  id: readonly string;
  email: string;
  onboarded?: boolean;
  name: string;
  bio?: string
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

type TBlog = {
  content: string;
  thumbnail?: TImage
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
  post: TPost;
  rootCommentId: readonly string
  commentReplies: TComment[]
  postId: string;
  parentId: readonly string
  parent: TComment
  createdAt: Date;
  updatedAt: Date;
};

type TNotification = {
  id: readonly string;
  sender: TUser;
  senderId: readonly string;
  recipientId: readonly string;
  comment?: Partial<TComment>
  joinRequest: TJoinRequest
  post?: TPost;
  type: "UPVOTE" | "JOIN_REQUEST" | "COMMENT";
  viewed: boolean;
  postId: string;
  createdAt: Date;
};

type TImage = {
  imageKey?: string;
  imageUrl?: string;
}

type TGuild = {
  id: readonly string;
  image: TImage
  name: string
  isPrivate: boolean
  creator: TUser
  members: TGuildMember[]
  isBelong?: boolean,
  membersCount: number,
  hasAnExistingJoinRequest: boolean
  description?: string
  creatorId: readonly string
  createdAt: Date;
  updatedAt: Date;
}

type TGuildMember = {
  id: readonly string;
  userId: readonly string,
  guild: readonly string,
  user: TUser,
  role: "MEMBER" | "CREATOR" | "MODERATOR"
}

type TJoinRequest = {
  id: readonly string;
  senderId: readonly string;
  sender: TUser,
  guild: TGuild
  guildId: readonly string;
}

type TGuildSharedPost = {
  id: readonly string;
  userId: readonly string;
  user: TUser,
  guild: TGuild
  guildId: readonly string;
  post: TPost
  content: string
  createdAt: Date;
  updatedAt: Date;
}

type TFeedFilter = "all" | "blog_post" | "code_diary"