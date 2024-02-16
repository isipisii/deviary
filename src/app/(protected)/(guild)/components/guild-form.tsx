"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useLoadImageFile from "@/lib/hooks/useLoadImageFile";
import LoadGuildImage from "@/components/shared/load-avatar";
import { guildSchema } from "@/lib/validators/guild.validator";
import { Button, Input, RadioGroup, Textarea } from "@nextui-org/react";
import { CustomRadio } from "@/components/ui/custom-radio";
import { useState } from "react";
import { useCreateGuild, useEditGuild } from "@/lib/services/guild.api";
import z from "zod";

type TGuildSchema = z.infer<typeof guildSchema>;

interface IGuildForm {
  isEditing?: boolean;
  guildToEdit?: TGuild;
}

export default function GuildForm({ isEditing, guildToEdit }: IGuildForm) {
  const {
    watch,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<TGuildSchema>({
    resolver: zodResolver(guildSchema),
  });
  const [privacy, setPrivacy] = useState(
    guildToEdit ? (guildToEdit?.isPrivate ? "private" : "public") : "public",
  );
  const {
    handleFileChange,
    handleRemoveImage,
    selectedImage,
    selectedImageFile,
  } = useLoadImageFile(guildToEdit?.image.imageUrl);

  const { mutate: createGuildMutation, isPending: isCreating } = useCreateGuild()
  const { mutate: updateGuildMutation, isPending: isUpdating } = useEditGuild()

  const isButtonDisabled = !(
    !!watch("name") &&
    !!watch("description") &&
    selectedImage
  ) || isUpdating || isCreating  
  const isPending = isUpdating || isCreating

  function handleCreateOrEditGuild(guildData: TGuildSchema) {
    const guildFormData = new FormData()

    if(selectedImageFile) guildFormData.append("imageFile", selectedImageFile)
    guildFormData.append("guildName", guildData.name)
    guildFormData.append("guildDescription", guildData.description)
    guildFormData.append("isPrivate", (privacy === "private" ? true : false).toString())

    if(isEditing && guildToEdit) {
      updateGuildMutation({guildData: guildFormData, guildId: guildToEdit.id})
    } else createGuildMutation(guildFormData)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="self-start">
        <LoadGuildImage
          handleFileChange={handleFileChange}
          handleRemoveImage={handleRemoveImage}
          selectedImage={selectedImage}
        />
      </div>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleCreateOrEditGuild)}
      >
        <Input
          labelPlacement="inside"
          isRequired
          label="Guild name"
          radius="lg"
          size="sm"
          variant="bordered"
          classNames={{
            label: "font-semibold",
            inputWrapper:
              "border-borderColor border-2 rounded-xl max-w-[600px]",
          }}
          {...register("name")}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          defaultValue={guildToEdit?.name || ""}
        />
        <Textarea
          labelPlacement="inside"
          label="Guild description"
          radius="lg"
          maxRows={15}
          variant="bordered"
          classNames={{
            label: "font-semibold",
            inputWrapper: " border-borderColor border-2 rounded-xl",
          }}
          {...register("description")}
          errorMessage={errors.description?.message}
          isInvalid={!!errors.description}
          //   isDisabled={isPending}
          defaultValue={guildToEdit?.description || ""}
        />

        <div className="flex w-full flex-col gap-4">
          <h3 className="text-[1.1rem] font-semibold">Privacy</h3>
          <RadioGroup value={privacy} onValueChange={setPrivacy} >
            <CustomRadio
              className="max-w-full md:max-w-[90%]"
              value="public"
              size="sm"
              color="secondary"
              classNames={{
                description: "text-light"
              }}
              description="Everyone can see the guild's content and can join without requesting for permission."
            >
              Public
            </CustomRadio>
            <CustomRadio
              className="max-w-full md:max-w-[90%]"
              value="private"
              size="sm"
              classNames={{
                description: "text-navTextColor"
              }}
              color="secondary"
              description="Only the accepted users are able to see the guild's content."
            >
              Private
            </CustomRadio>
          </RadioGroup>
        </div>
        <Button
          type="submit"
          size="md"
          color="secondary"
          className="w-full max-w-[200px] self-end rounded-xl font-semibold text-white"
          isDisabled={isButtonDisabled}
          isLoading={isPending}
        >
          Create
        </Button>
      </form>
    </div>
  );
}
