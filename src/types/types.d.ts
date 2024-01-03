//this is for axios' generic type response 
interface ErrorResponse {
    message: string
}

type TUser = {
    id: readonly string 
    email: string
    onboarded?: boolean
    name: string
    image: string
}

type TPage <TData> = {
    metaData: {
        hasNextPage: boolean
        lastCursor: string
    }
    data: TData
}

type TPost = {
    type: "BLOG_POST" | "CODE_DIARY" 
    tags: string[]    
    id: readonly string 
    author?: TUser
    blog?: TBlog 
    diary?: TDiary
    isBookmarked: boolean
    bookmarkId?: readonly string 
    authorId?:  readonly string
    createdAt: Date
}

type TBlog = {
    content: string
    thumbnail?: {
        imageKey?: string
        imageUrl?: string
    }
    title: string
}

type TBookmark = {
    id: readonly string
    postId: string
    post: TPost
    userId: string
    user: TUser
}

type TDiary = {
    title: string
    codeSnippet?: string
    description: string
    solution: string
}

