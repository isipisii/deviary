/* eslint-disable @next/next/no-img-element */
"use client";

import { Input, Button, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { onboardingSchema } from "@/lib/validators/auth.validator";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useOnboard } from "@/lib/services/auth.api";
import useLoadImageFile from "@/lib/hooks/useLoadImageFile";
import { useSession } from "next-auth/react";

import LoadAvatar from "@/components/shared/load-avatar";
import { FaGithub, FaFacebook } from "react-icons/fa";

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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TOnBoardingSchema>({
    resolver: zodResolver(onboardingSchema),
  });
  const { mutate: onBoardingMutation, isPending } = useOnboard(update)
  const isButtonDisabled = !(!!watch("name")) || isPending

  function handleOnboard(formValues: TOnBoardingSchema) {
    const { name, githubLink, facebookLink, bio, username } = formValues;
    const form = new FormData();
  
    form.append("name", name);
    form.append("username", name);
    form.append("bio", bio as string);
    form.append("githubLink", githubLink as string)
    form.append("facebookLink", facebookLink as string)
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
        <p className="text-center">Customize your <span className="text-secondary font-bold">deviary</span>  profile</p>
      </div>
      
      <div className="flex flex-col gap-3">
        {/* profile */}
        <LoadAvatar 
          selectedImage={selectedImage} 
          handleFileChange={handleFileChange} 
          handleRemoveImage={handleRemoveImage} 
          initialImage={user.image}
        />
        <p className="text-lg font-semibold text-center">{user.email}</p>
        <Input
          label="Name"
          placeholder="Enter your name"
          size="md"
          radius="lg"
          variant="bordered"
          isDisabled={isPending}
          defaultValue={user.name ?? ""} 
          errorMessage={errors.name?.message}
          isInvalid={!!errors.name}
          {...register("name")}
        />
        <Input
          label="Username"
          placeholder="Enter your username"
          size="md"
          radius="lg"
          variant="bordered"
          isDisabled={isPending}
          defaultValue={user.email.split("@").at(0)} 
          errorMessage={errors.username?.message}
          isInvalid={!!errors.username}
          {...register("username")}
        />
        <Textarea
          label="Bio"
          placeholder="Short description about yourself"
          variant="bordered"
          radius="lg"
          minRows={5}
          maxRows={10}
          {...register("bio")}
          errorMessage={errors.bio?.message}
          isInvalid={!!errors.bio}
        />

        <div className="flex flex-col gap-2">
          <p className="font-semibold">Socials</p>
          <Input
            label="Github (optional)"
            placeholder="Provide your GitHub link"
            size="md"
            radius="lg"
            variant="bordered"
            isDisabled={isPending} 
            errorMessage={errors.githubLink?.message}
            isInvalid={!!errors.githubLink}
            {...register("githubLink")}
            startContent={
              <FaGithub className="mr-1" />
            }
          /> 
          <Input
            label="Facebook (optional)"
            placeholder="Provide your Facebook link"
            size="md"
            radius="lg"
            variant="bordered"
            isDisabled={isPending} 
            errorMessage={errors.facebookLink?.message}
            isInvalid={!!errors.facebookLink}
            {...register("facebookLink")}
            startContent={
              <FaFacebook className="mr-1" />
            }
          /> 
        </div>

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
