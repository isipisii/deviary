import { TSignUpSchema } from "@/app/(auth)/components/sign-up-form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignUp() {
   const router = useRouter()

   return useMutation({
      mutationFn: async (formData: TSignUpSchema) => {
         return await axios.post("/api/auth/sign-up", formData)
      },
      onSuccess: () => {
        toast.success("Account created successfully.")
        router.push("/sign-in")
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        toast.error(error.response?.data?.message)
      }
   })
   
}

export function useOnboard(updateSessionAndToken: (data?: any) => Promise<Session | null>){
   const router = useRouter()

   return  useMutation({
      mutationFn: async ({ formData, userId }: { formData: FormData; userId: string }) => {
         const response = await axios.patch(`/api/onboarding/${userId}`, formData)
         return response.data.data as TUser
      },
      onSuccess: async (data) => {
        toast.success("Profile updated")  
        // updates the session in client and jwt in server 
        await updateSessionAndToken({ name: data.name, image: data.image, onboarded: data.onboarded })
      
        router.push("/feed")
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        toast.error(error.response?.data.message)
      },
   })
}
