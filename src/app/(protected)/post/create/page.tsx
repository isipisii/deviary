import CreatePostContainer from "../components/create-post-container";
import PageTitle from "@/components/ui/page-title";

export default async function CreatePost() {
  // TODO
  return (
    <div className='p-6 md:p-12 w-full flex items-center justify-center'>
      <div className="flex justify-between max-w-[900px] w-full flex-col gap-4">
          <PageTitle>Create a post</PageTitle>
          <CreatePostContainer />
      </div> 
    </div>
  )
}