"use client";

import { FaGithub, FaFacebook } from "react-icons/fa";
import { Input, Button, Textarea } from "@nextui-org/react";
import { useUpdateUserProfile } from "@/lib/services/user.api";
import useLoadImageFile from "@/lib/hooks/useLoadImageFile";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/lib/validators/user.validator";
import { useSession } from "next-auth/react";
import LoadAvatar from "@/components/shared/load-avatar";
import LoadCoverImage from "@/components/shared/load-background-image";

type TUpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export default function UserProfileForm({ user }: { user: TUser }) {
  const { update } = useSession();

  // for avatar
  const {
    selectedImage: selectedAvatarImage,
    selectedImageFile: selectedAvatarImageFile,
    handleFileChange: handleAvatarImageChange,
    handleRemoveImage: handleRemoveAvatarImage,
  } = useLoadImageFile(user.image);

  // for cover image
  const {
    selectedImage: selectedCoverImage,
    selectedImageFile: selectedCoverImageFile,
    handleFileChange: handleCoverImageFileChange,
    handleRemoveImage: handleRemoveCoverImage,
  } = useLoadImageFile(user?.backgroundImage?.imageUrl);

  const { mutate: updateUserProfileMutation, isPending } =
    useUpdateUserProfile(update);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TUpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
  });

  function handleUpdateUserProfile(formValues: TUpdateProfileSchema) {
    const form = new FormData();
    const { name, githubLink, facebookLink, bio, username } = formValues;

    form.append("name", name);
    form.append("username", username);
    form.append("bio", bio as string);
    form.append("githubLink", githubLink as string);
    form.append("facebookLink", facebookLink as string);

    if (selectedAvatarImageFile)
      form.append("profileImage", selectedAvatarImageFile);
    if (selectedCoverImageFile)
      form.append("backgroundImage", selectedCoverImageFile);

    updateUserProfileMutation({ formData: form, userId: user?.id });
  }

  return (
    <form
      className="z-[5] flex flex-col gap-4"
      onSubmit={handleSubmit(handleUpdateUserProfile)}
    >
      <div className="flex gap-3">
        <LoadAvatar
          selectedImage={selectedAvatarImage}
          handleFileChange={handleAvatarImageChange}
          handleRemoveImage={handleRemoveAvatarImage}
        />
        <LoadCoverImage
          selectedImage={selectedCoverImage}
          handleFileChange={handleCoverImageFileChange}
          handleRemoveImage={handleRemoveCoverImage}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Input
          label="Name"
          placeholder="Enter your name"
          size="md"
          radius="lg"
          variant="bordered"
          isDisabled={isPending}
          defaultValue={user.name ?? ""}
          classNames={{
            inputWrapper: " border-borderColor border-2 rounded-xl",
          }}
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
          classNames={{
            inputWrapper: " border-borderColor border-2 rounded-xl",
          }}
          isDisabled={isPending}
          defaultValue={user.username}
          errorMessage={errors.username?.message}
          isInvalid={!!errors.username}
          {...register("username")}
        />
        <Textarea
          label="Bio"
          placeholder="Short description about yourself"
          variant="bordered"
          radius="lg"
          classNames={{
            inputWrapper: " border-borderColor border-2 rounded-xl",
          }}
          isDisabled={isPending}
          defaultValue={user.bio}
          minRows={5}
          maxRows={10}
          {...register("bio")}
          errorMessage={errors.bio?.message}
          isInvalid={!!errors.bio}
        />
      </div>

      {/* SOCIALS */}
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Socials</p>
        <Input
          label="Github (optional)"
          placeholder="Provide your GitHub link"
          size="md"
          classNames={{
            inputWrapper: " border-borderColor border-2 rounded-xl",
          }}
          radius="lg"
          variant="bordered"
          isDisabled={isPending}
          defaultValue={user?.social?.github}
          errorMessage={errors.githubLink?.message}
          isInvalid={!!errors.githubLink}
          {...register("githubLink")}
          startContent={<FaGithub className="mr-1" />}
        />
        <Input
          label="Facebook (optional)"
          placeholder="Provide your Facebook link"
          size="md"
          radius="lg"
          classNames={{
            inputWrapper: " border-borderColor border-2 rounded-xl",
          }}
          variant="bordered"
          isDisabled={isPending}
          defaultValue={user?.social?.facebook}
          errorMessage={errors.facebookLink?.message}
          isInvalid={!!errors.facebookLink}
          {...register("facebookLink")}
          startContent={<FaFacebook className="mr-1" />}
        />
      </div>
      <Button
        type="submit"
        color="secondary"
        size="md"
        variant="solid"
        isLoading={isPending}
        // isDisabled={isButtonDisabled}
        className="self-end rounded-xl font-semibold text-white"
      >
        Update profile
      </Button>
    </form>
  );
}
