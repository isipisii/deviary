import CommentCard from "./comment-card";

export default function CommentList() {
    
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-borderColor p-4">
      <h3 className="text-xl font-bold">Comments</h3>
      <div className="max-h-[450px] overflow-auto">
        <div className="flex flex-col gap-4 ">
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <CommentCard />
        </div>
      </div>
    </div>
  );
}
