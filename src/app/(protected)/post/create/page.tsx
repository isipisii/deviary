import CreatePostContainer from "../components/create-post-container";
import PageTitle from "@/components/ui/page-title";

export default function CreatePost() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-12">
      <div className="z-[5] flex w-full max-w-[900px] flex-col justify-between gap-4">
        <PageTitle>Create a post</PageTitle>
        <CreatePostContainer />
      </div>
      <div className="fixed -bottom-[10rem] -right-[20rem] z-[0] h-[500px] w-[500px] rounded-full bg-gradient-to-l from-[#dd0dba31] to-[#dd0dba18] blur-[70px] filter lg:h-[800px] lg:w-[800px]" />
      <div className="fixed -left-[10rem] -top-10 z-[0] h-[350px] w-[400px] rounded-full bg-gradient-to-l from-[#0d8add2b] to-[#0d8add1e] blur-[70px] filter lg:h-[700px] lg:w-[700px]" />
    </div>
  );
}
