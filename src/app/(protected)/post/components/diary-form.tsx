"use client"

import Tags from "@/components/shared/tags"
import { Button, Input, Textarea } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { TDiarySchema } from "@/lib/validators/post-validator"
import { diarySchema } from "@/lib/validators/post-validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTags } from "@/lib/store/useTags"
import { useCreateDiary, useUpdateDiary } from "@/lib/services/post.api"

export default function DiaryForm({ postToEdit }: { postToEdit?: Partial<TPost> }) {
  const { tags } = useTags(state => state)
  const { watch, register, formState: { errors }, handleSubmit } = useForm<TDiarySchema>({
    resolver: zodResolver(diarySchema),
  
  })
  const { mutate: createDiaryMutation, isPending: isCreating } = useCreateDiary(useForm())
  const { mutate: updateDiaryMutation, isPending: isUpdating } = useUpdateDiary()
  const isButtonDisabled = !(!!watch("title") && !!watch("description") && !!watch("solution")) || isCreating || isUpdating
  const isPending = isCreating || isUpdating

  function handleCreateDiary(formValue: TDiarySchema) {
    const joinedTags = tags.join(",")
    createDiaryMutation({...formValue, tags: joinedTags})
  }
  
  function handleUpdateDiary(formValue: TDiarySchema){
    const joinedTags = tags.join(",")
    updateDiaryMutation({ 
      diaryData: {...formValue, tags: joinedTags}, 
      postId: postToEdit?.id as string
    })
  }

  return (
    <div className="grid gap-4">
      <Tags initialTags={postToEdit?.tags} />
      <form className="flex-col flex gap-4" onSubmit={handleSubmit(!postToEdit ? handleCreateDiary : handleUpdateDiary)}>
        <Input
          labelPlacement="inside"
          isRequired
          label="Title"
          radius="lg"
          size="sm"
          variant="bordered"
          classNames={{
            label: "font-semibold", 
            inputWrapper:"border-borderColor border-2 rounded-xl",
          }} 
          {...register("title")}
          errorMessage={errors.title?.message}
          isInvalid={!!errors.title}
          isDisabled={isPending}
          defaultValue={postToEdit?.diary?.title || ""}
        />
        <Textarea
          labelPlacement="inside"
          label="Code snippet (optional)"
          radius="lg"
          maxRows={15}
          variant="bordered"
          classNames={{
            label: "font-semibold", 
            inputWrapper:" border-borderColor border-2 rounded-xl",
          }} 
          {...register("codeSnippet")}
          errorMessage={errors.codeSnippet?.message}
          isInvalid={!!errors.codeSnippet}
          isDisabled={isPending}
          defaultValue={postToEdit?.diary?.codeSnippet || ""}
        />
        <Textarea
          labelPlacement="inside"
          isRequired
          minRows={2}
          label="Description"
          radius="lg"
          variant="bordered"
          classNames={{
            label: "font-semibold", 
            inputWrapper:" border-borderColor border-2 rounded-xl",
          }} 
          {...register("description")}
          errorMessage={errors.description?.message}
          isInvalid={!!errors.description}
          isDisabled={isPending}
          defaultValue={postToEdit?.diary?.description || ""}
        />
        <Textarea
          labelPlacement="inside"
          isRequired
          maxRows={15}
          label="Solution"
          radius="lg"
          variant="bordered"
          classNames={{
            label: "font-semibold", 
            inputWrapper:" border-borderColor border-2 rounded-xl",
          }} 
          {...register("solution")}
          errorMessage={errors.solution?.message}
          isInvalid={!!errors.solution}
          isDisabled={isPending}
          defaultValue={postToEdit?.diary?.solution || ""}
        />
        <Button
          type="submit" 
          size="md"
          color="secondary" 
          className="rounded-xl text-white max-w-[200px] w-full font-semibold self-end"
          isDisabled={isButtonDisabled}
          isLoading={isPending}
        >
          {!postToEdit ? isPending ? "Creating" : "Create" : isPending ? "Saving changes" : "Save changes"}
        </Button>
      </form>
    </div>
  )
}
