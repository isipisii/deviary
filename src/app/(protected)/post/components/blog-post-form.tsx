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
import MarkdownEditor from "@/components/shared/markdown-editor";
import { useMutation } from "@tanstack/react-query";
import { createBlogPost } from "@/lib/services/post.api";
import { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next-nprogress-bar";

export type TBlogSchema = z.infer<typeof blogSchema>

export default function BlogPostForm({ isEditing }: { isEditing?: boolean } ) {
  const { tags, removeAllTags } = useTags(state => state)
  const [content, setContent] = useState("")
  const router = useRouter()
  const { handleFileChange, selectedImage, selectedImageFile, handleRemoveImage } = useLoadImageFile()
  const { watch, register, formState: { errors }, handleSubmit, reset } = useForm<TBlogSchema>({
    resolver: zodResolver(blogSchema)
  })
  const { mutate: createBlogPostMutation, isPending } = useMutation({
    mutationFn: createBlogPost, 
     onSuccess: () => {
      clearForm()
      router.push("/feed")
    },
    onError: (error:AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message)
    }
  })

  const isButtonDisabled = !(!!watch("title") && content && selectedImage) || isPending
  
  function handleCreateBlogPost(formValue: TBlogSchema) {
    const form = new FormData()

    if(selectedImageFile) form.append("thumbnail", selectedImageFile)
    form.append("title", formValue.title)
    form.append("tags", tags.join(","))
    form.append("content", content)

    createBlogPostMutation(form)
  }

  function clearForm() {
    reset()
    removeAllTags()
    setContent("")
    handleRemoveImage()
  }

  return (
    <div className="max-w-[900px] flex-col flex gap-4">
      <LoadThumbnail
        handleFileChange={handleFileChange}
        selectedImage={selectedImage}
        handleRemoveImage={handleRemoveImage}
      />
      <Tags />
      <form onSubmit={handleSubmit(handleCreateBlogPost)} className="flex flex-col gap-4">
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
            isInvalid={!!errors.title}
            errorMessage={errors.title?.message}
          />
          <MarkdownEditor markdown={content} setValue={setContent} />
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
                const uploadedUrl = res[0].url;
                const imageLink =  `![${res[0].name}](${uploadedUrl})`
                setContent(prev => `${prev} \n${imageLink}`)
              }}
              onUploadError={(error: Error) => {
                toast.error("Something went wrong")
              }}
            />
            <Button 
              type="submit" 
              color="secondary" 
              size="lg"
              className="rounded-xl text-white max-w-[200px] w-full font-semibold"
              isDisabled={isButtonDisabled}
            >
              Create
            </Button>
          </div>
      </form>
    </div>
  )
}
