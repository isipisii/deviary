"use client"

import { Input, Textarea, Button, Spinner } from "@nextui-org/react"
import LoadThumbnail from "@/components/shared/load-thumbnail";
import Tags from "@/components/shared/tags";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema } from "@/lib/validators/post-validator";
import z from "zod"

import { useTags } from "@/lib/store/useTags";
import useLoadImageFile from "@/lib/hooks/useLoadImageFile"
import { UploadButton } from "@/utils/uploadthing";
import { FaRegImages } from "react-icons/fa6";
import { toast } from "sonner";
import MarkdownContainer from "@/components/shared/markdown-container";
import { useMutation } from "@tanstack/react-query";
import { createBlogPost } from "@/lib/services/post.api";
import { AxiosError } from "axios";

export type TBlogSchema = z.infer<typeof blogSchema>

export default function CreateBlogPostForm() {
  const { tags } = useTags(state => state)
  const { handleFileChange, selectedImage, selectedImageFile, handleRemoveImage } = useLoadImageFile()
  const { watch, register, formState: { errors }, handleSubmit, setValue, getValues } = useForm<TBlogSchema>({
    resolver: zodResolver(blogSchema)
  })

  const { mutate: createBlogPostMutation, isPending } = useMutation({
    mutationFn: createBlogPost, 
    onSuccess: (data) => {
      console.log(data.tags)
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message)
    }
   })
  
  function log(formValue: TBlogSchema) {
    const form = new FormData()

    if(selectedImageFile) form.append("thumbnail", selectedImageFile)
    form.append("title", formValue.title)
    form.append("tags", tags.join(","))
    form.append("content", formValue.content)

    createBlogPostMutation(form)
  }

  return (
    <div className="h-auto flex flex-col gap-4 max-w-[700px]">
        <LoadThumbnail
            handleFileChange={handleFileChange}
            selectedImage={selectedImage}
            handleRemoveImage={handleRemoveImage}
        />
        <Tags />
        <form onSubmit={handleSubmit(log)} className="flex flex-col gap-4">
            <Input
                labelPlacement="inside"
                isRequired
                label="Title"
                radius="lg"
                variant="bordered"
                classNames={{
                    label: "font-semibold", 
                    inputWrapper:"bg-light border-borderColor border-2 rounded-xl",
                }}
                {...register("title")}
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
            />
            <Textarea
                isRequired
                variant="bordered"
                label="Content"
                maxRows={20}
                classNames={{
                    label: "font-semibold",
                    inputWrapper:"bg-light border-borderColor border-2 rounded-xl",
                }}
                {...register("content")}
                isInvalid={!!errors.content}
                errorMessage={errors.content?.message}
                value={watch("content")}
            />
            <div className="flex items-center justify-between">
              <UploadButton
               // button: "bg-light rounded-xl ut-button:bg-light ut-uploading:bg-light ut-uploading:cursor-not-allowed",
                appearance={{
                  allowedContent: "hidden",
                }}
                // content={{
                //   button({ ready, isUploading }) {
                //     if (ready) {
                //       return (
                //         <p className="text-typography flex items-center gap-2 font-semibold text-xs">
                //           <FaRegImages className="text-[1rem]" /> Attach image
                //         </p>
                //       )
                //     } 

                //     if(isUploading) {
                //       return (
                //         <p className="flex items-center"><Spinner size="sm" color="secondary" /></p>
                //       )
                //     }
                
                //     return "Getting ready...";
                //   },
                // }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  const currentValue = getValues("content") || "";
                  const uploadedUrl = res[0].url;
                  const markdownContent =  `![${res[0].name}](${uploadedUrl})`;

                  setValue("content", `${currentValue}\n${markdownContent}`);
                }}
                onUploadError={(error: Error) => {
                  toast.error("Something went wrong")
                }}
              />
              <Button 
                type="submit" 
                color="secondary" 
                className="rounded-xl text-white max-w-[200px] w-full font-semibold"
                isDisabled={isPending}
              >
                Create
              </Button>
            </div>
        </form>

        <MarkdownContainer markdown={getValues("content")}/>
    </div>
  )
}
