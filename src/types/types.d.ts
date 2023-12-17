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

type TBlogPost = {
    content: string
    thumbnail: {
        imageKey: string
        imageUrl: striong
    }
    title: string
    authorId: string
    tags: string
    created_at: Date
}