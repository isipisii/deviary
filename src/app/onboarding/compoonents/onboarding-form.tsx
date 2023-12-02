/* eslint-disable @next/next/no-img-element */
"use client";

import { Input, Button, Avatar } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { onboardingSchema } from "@/lib/validators/auth-validator";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";
import { onBoard } from "@/lib/services/auth.api";
import { UploadButton } from "@/utils/uploadthing";
import useLoadImageFile from "@/lib/hooks/useLoadImageFile";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";

import EditAvatar from "@/components/shared/edit-avatar";

export type TOnBoardingSchema = z.infer<typeof onboardingSchema>;

interface IOnboardingForm {
  user: {
    name: string
    email: string
    image: string
    id: string
  }
}

//the props will serve as the default values of the form
//because when i use the useSession hook, its not rendering the defaultValues
// theres also a bug in defaultValues from rhf and nextui input component
export default function OnBoardingForm({ user }: IOnboardingForm) {
  const { selectedImage, selectedImageFile, handleFileChange, handleRemoveImage } = useLoadImageFile()
  const { update } = useSession()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TOnBoardingSchema>({
    resolver: zodResolver(onboardingSchema),
  });
  
  const { mutate: onBoardingMutation, isPending } =  useMutation({
    mutationFn: onBoard,
    onSuccess: async (data) => {
      toast.success("Profile updated")  
      // updates the session in client and jwt in server 
      await update({ name: data.name, image: data.image, onboarded: data.onboarded })
    
      router.push("/feed")
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message)
    },
  })

  const isButtonDisabled = !(!!watch("name")) || isPending

  function handleOnboard(formValues: TOnBoardingSchema) {
    const {  name } = formValues;
    const form = new FormData();
  
    // form.append("email", email);
    form.append("name", name);
    if (selectedImageFile) form.append("imageFile", selectedImageFile);
  
    onBoardingMutation({ formData: form, userId: user?.id });
  }

  return (
    <form
      className="max-w-[450px] w-full flex flex-col gap-4 mx-4"
      onSubmit={handleSubmit(handleOnboard)}
    >  
      <div className="grid gap-2">
        <h2 className="font-bold text-3xl text-center">Profile</h2>
        <p className="text-center">Customize your deviary profile</p>
      </div>
      
      <div className="flex flex-col gap-3">
        {/* profile */}
        <EditAvatar 
          selectedImage={selectedImage} 
          handleFileChange={handleFileChange} 
          handleRemoveImage={handleRemoveImage} 
          userCurrentImage={user.image}
        />
        <p className="text-lg font-semibold text-center">{user.email}</p>
        <Input
            type="name"
            label="Name"
            labelPlacement="outside"
            placeholder="Enter your name"
            size="md"
            variant="bordered"
            isDisabled={isPending}
            defaultValue={user.name ?? ""} 
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
            {...register("name")}
        />  
        {/* <Input
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email"
            size="md"
            variant="bordered"
            isDisabled={isPending}
            defaultValue={user.email} 
            {...register("email")}
        /> */}

        <Button
          type="submit"
          color="secondary"
          size="md"
          variant="solid"
          isLoading={isPending}
          isDisabled={isButtonDisabled}
          className="text-white font-semibold"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
