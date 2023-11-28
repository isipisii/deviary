import { TSignUpSchema } from "@/app/(auth)/components/sign-up-form";
import axios from "axios";

// export const signUp = async (formData: TSignUpSchema) => {
//     const response = await fetch("api/auth/sign-up", {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify(formData)
//     })

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message);
//     }  

//     return response.json()
// }


export const signUp = async (formData: TSignUpSchema) => {
   return await axios.post("/api/auth/sign-up", formData)
}
