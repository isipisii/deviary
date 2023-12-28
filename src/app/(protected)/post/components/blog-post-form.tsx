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
import { toast } from "sonner";
import MarkdownEditor from "@/components/shared/markdown-editor";
import { useCreateBlogPost, useUpdateBlogPost } from "@/lib/services/post.api";
import { useState } from "react";

export type TBlogSchema = z.infer<typeof blogSchema>

export default function BlogPostForm({ postToEdit }: { postToEdit?: TPost } ) {
  const { tags, removeAllTags } = useTags(state => state)
  const [content, setContent] = useState(postToEdit?.blog?.content || "")
  const { handleFileChange, selectedImage, selectedImageFile, handleRemoveImage } = useLoadImageFile(postToEdit?.blog?.thumbnail?.imageUrl)
  const { watch, register, formState: { errors }, handleSubmit, reset } = useForm<TBlogSchema>({
    resolver: zodResolver(blogSchema),
  })
  const { mutate: createBlogPostMutation, isPending: isCreating } = useCreateBlogPost(clearForm)
  const { mutate: updateBlogPostMutation, isPending: isUpdating } = useUpdateBlogPost()
  const isButtonDisabled = !(!!watch("title") && content && selectedImage) || isCreating || isUpdating
  const isPending = isCreating || isUpdating
  
  function handleCreateOrUpdateBlogPost(formValue: TBlogSchema) {
    const form = new FormData()

    if(selectedImageFile) form.append("thumbnail", selectedImageFile)
    form.append("title", formValue.title)
    form.append("tags", tags.join(","))
    form.append("content", content)

    if(postToEdit) {
      updateBlogPostMutation({ blogPostData: form, postId: postToEdit.id})
      console.log(form)
    } else createBlogPostMutation(form)
  }

  function clearForm() {
    reset()
    removeAllTags()
    setContent("")
    handleRemoveImage()
  }

  return (
    <div className="flex-col flex gap-4">
      <LoadThumbnail
        handleFileChange={handleFileChange}
        selectedImage={selectedImage}
        handleRemoveImage={handleRemoveImage}
      />
      <Tags initialTags={postToEdit?.tags}/>
      <form onSubmit={handleSubmit(handleCreateOrUpdateBlogPost)} className="flex flex-col gap-4">
          <Input
            labelPlacement="inside"
            isRequired
            label="Title"
            radius="lg"
            size="sm"
            variant="bordered"
            defaultValue={postToEdit?.blog?.title || ""}
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
              size="md"
              isLoading={isPending}
              className="rounded-xl text-white max-w-[200px] w-full font-semibold"
              isDisabled={isButtonDisabled}
            >
              {!postToEdit ? isPending ? "Creating" : "Create" : isPending ? "Saving changes" : "Save changes"}
            </Button>
          </div>
      </form>
    </div>
  )
}
