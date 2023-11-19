// todo: use zod later

type TSignUpCredentials = {
    confirmPassword: string
} & TSignInCredentials

type TSignInCredentials = {
    email: string
    password: string
}