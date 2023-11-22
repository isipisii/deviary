import { TSignUpSchema } from "@/app/(auth)/components/sign-up-form";

export const signUp = async (formData: TSignUpSchema) => {
    const response = await fetch("api/auth/sign-up", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formData)
    })

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }  

    return response.json()
}