"use client"
import Tags from "@/components/shared/tags"
import { Button, Input, Textarea } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { TDiarySchema } from "@/lib/validators/post-validator"
import { AxiosError } from "axios";
import { diarySchema } from "@/lib/validators/post-validator"
import { zodResolver } from "@hookform/resolvers/zod"

export default function DiaryForm() {
  const { watch, register, formState: { errors }, handleSubmit, reset } = useForm<TDiarySchema>({
    resolver: zodResolver(diarySchema)
  })

  function handleCreateDiary(formValue: TDiarySchema) {
    console.log(formValue)
  }
  return (
    <div className="max-w-[700px] grid gap-4">
      <Tags />
      <form className="flex-col flex gap-4" onSubmit={handleSubmit(handleCreateDiary)}>
        <Input
          labelPlacement="inside"
          isRequired
          label="Title"
          radius="lg"
          variant="bordered"
          classNames={{
            label: "font-semibold", 
            inputWrapper:" border-borderColor border-2 rounded-xl",
          }} 
          {...register("title")}
          errorMessage={errors.title?.message}
          isInvalid={!!errors.title}
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
        />
        <Button
          type="submit" 
          size="lg"
          color="secondary" 
          className="rounded-xl text-white max-w-[200px] w-full font-semibold self-end"
          // isDisabled={isButtonDisabled}
        >
          Create
        </Button>
      </form>
    </div>
  )
}
