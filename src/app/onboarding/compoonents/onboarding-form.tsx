/* eslint-disable @next/next/no-img-element */
"use client";

import { Input, Button, Avatar } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { onboardingSchema } from "@/lib/validators/auth-validator";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { onBoard } from "@/lib/services/auth.api";
import { UploadButton } from "@/utils/uploadthing";
import useLoadImageFile from "@/lib/hooks/useLoadImageFile";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";

import { IoClose } from "react-icons/io5";

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

  const isButtonDisabled = !(!!watch("email") && !!watch("name")) || isPending

  function handleOnboard(formValues: TOnBoardingSchema) {
    const { email, name } = formValues;
    const form = new FormData();
  
    form.append("email", email);
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
        <div className="flex flex-col items-center gap-2 relative h-[150px] w-[150px] self-center">
          {selectedImage && (
            <Button 
              variant="flat"
              isIconOnly
              radius="full"
              className="absolute top-0 -right-3 z-10 text-[1.3rem]"
              onClick={handleRemoveImage}
            >
              <IoClose />
            </Button>
          )}
          <label htmlFor="file-input" className="cursor-pointer">
            <Avatar 
              radius="full" 
              className="h-[150px] w-[150px]" 
              src={selectedImage || user.image} 
              classNames={{ base: "border-borderColor border"}}
            />
          </label>
          <input id="file-input" type="file" onChange={handleFileChange} className="hidden" />
        </div>
      
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
        <Input
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email"
            size="md"
            variant="bordered"
            isDisabled={isPending}
            defaultValue={user.email} 
            {...register("email")}
        />

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
