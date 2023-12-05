import { TSignUpSchema } from "@/app/(auth)/components/sign-up-form";
import axios from "axios";

export async function signUp(formData: TSignUpSchema) {
   return await axios.post("/api/auth/sign-up", formData)
}

export async function onBoard({ formData, userId }: { formData: FormData; userId: string }) {
   const response = await axios.patch(`/api/onboarding/${userId}`, formData)
   return response.data.data as TUser
}
