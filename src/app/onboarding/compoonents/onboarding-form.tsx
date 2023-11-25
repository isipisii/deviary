/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { onboardingSchema } from "@/lib/validators/auth-validator";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react";
import { UploadButton } from "@/utils/uploadthing";

export type TOnBoardingSchema = z.infer<typeof onboardingSchema>;

interface IOnboardingForm {
  user: {
    name: string
    email: string
    image: string
  }
}
//the props will serve as the default values of the form
//because when i use the useSession hook, its not rendering the defaultValues
// theres also a bug in defaultValues from rhf and nextui input component
export default function OnBoardingForm({ user }: IOnboardingForm) {
  const [imageUploaded, setImageUploaded] = useState("")
  const { data } = useSession()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TOnBoardingSchema>({
    resolver: zodResolver(onboardingSchema),
  });
  
  // const isButtonDisable = !!watch(["email"]) || !!watch(["password"])
  // const { mutate, isPending, data } =  useMutation({
  //   mutationFn: handleSignIn,
  //   onSuccess: () => {
  //     router.replace("/")
  //   }
  // })

//   const isButtonDisable =  !(!!watch("email") && !!watch("password")) || isSigningIn

  function log(formData: TOnBoardingSchema) {
    console.log(formData)
  }
  return (
    <form
        className="max-w-[450px] w-full flex flex-col gap-4 mx-4"
        onSubmit={handleSubmit(log)}
    >   
      <h2 className="font-bold text-2xl text-center">Profile</h2>
      <p className="text-center">Customize your deviary profile</p>
      <div className="flex flex-col gap-3">

        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            const imageUrl = res[0].url
            setImageUploaded(imageUrl)
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />

        <img src={imageUploaded} alt="image"/>

        <Input
            type="name"
            label="Name"
            labelPlacement="outside"
            placeholder="Enter your name"
            size="md"
            variant="bordered"
            // defaultValue={data?.user.name || ""} 
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
            {...register("name")}
        />
          
        <Input
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email"
            size="md"
            variant="bordered"
            isDisabled
            defaultValue={user.email} 
            {...register("email")}
        />

        <Button
            type="submit"
            color="secondary"
            size="md"
            variant="solid"
            //   isLoading={isSigningIn}
            //   isDisabled={isButtonDisable}
            className="text-white font-semibold"
        >
            Continue
        </Button>
      </div>
    </form>
  );
}
