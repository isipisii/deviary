//this is for axios generic's type response 
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