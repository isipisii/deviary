"use client"

import Tags from "@/components/shared/tags"
import { Button, Input, Textarea } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { TDiarySchema } from "@/lib/validators/post-validator"
import { diarySchema } from "@/lib/validators/post-validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTags } from "@/lib/store/useTags"
import { useCreateDiary } from "@/lib/services/post.api"

export default function DiaryForm() {
  const { tags } = useTags(state => state)
  const { watch, register, formState: { errors }, handleSubmit, reset } = useForm<TDiarySchema>({
    resolver: zodResolver(diarySchema)
  })
  const { mutate: createDiaryMutation, isPending } = useCreateDiary(useForm())
  const isButtonDisabled = !(!!watch("title") && !!watch("description") && !!watch("solution")) || isPending

  function handleCreateDiary(formValue: TDiarySchema) {
    const joinedTags = tags.join(",")
    createDiaryMutation({...formValue, tags: joinedTags})
  }
  
  return (
    <div className="grid gap-4">
      <Tags />
      <form className="flex-col flex gap-4" onSubmit={handleSubmit(handleCreateDiary)}>
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
        />
        <Button
          type="submit" 
          size="md"
          color="secondary" 
          className="rounded-xl text-white max-w-[200px] w-full font-semibold self-end"
          isDisabled={isButtonDisabled}
          isLoading={isPending}
        >
          Create
        </Button>
      </form>
    </div>
  )
}
