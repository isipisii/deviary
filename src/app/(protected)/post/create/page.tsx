import CreatePostContainer from "../components/create-post-container";

export default function CreatePost() {
  // TODO
  return (
    <div className='p-6 md:p-12 w-full flex items-center justify-center'>
      <div className="flex justify-between w-full flex-col gap-4">
          <h2 className="font-semibold text-3xl" >Create a post</h2>
          <CreatePostContainer />
      </div> 
    </div>
  )
}
