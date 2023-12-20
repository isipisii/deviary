//this is for axios' generic type response 
interface ErrorResponse {
    message: string
}

type TUser = {
    id: string
    email: string
    onboarded: boolean
    name: string
    image: string
}

type TFeedPostsPage = {
    metaData: {
        hasNextPage: boolean
        lastCursor: string
    }
    posts: TPost[] 
}

type TPost = {
    type: PostType.BLOG_POST | PostType.CODE_DIARY
    tags: string[]
    id: string
    blog?: TBlog 
    diary?: TDiary
    authorId: string
    created_at: Date
}

type TBlog = {
    content: string
    thumbnail: {
        imageKey: string
        imageUrl: striong
    }
    title: string
}

type TDiary = {
    title: string
    codeSnippet?: string
    description: string
    solution: string
}

// enum PostType {
//     CODE_DIARY = "CODE_DIARY",
//     BLOG_POST = "BLOG_POST"
// }