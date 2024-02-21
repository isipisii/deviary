import PostAside from "./post-aside";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import PostTags from "./post-tags";

export default function DiaryPost({ post }: { post: TPost }) {
  return (
    <section className="mt-[5rem] flex w-full items-center justify-center md:mt-[3.5rem]">
      <div
        className="flex w-full max-w-[1500px] flex-col-reverse 
          justify-center p-0 md:p-4 lg:flex-row"
      >
        {/* LEFT  */}
        <div className="order-1 flex w-full flex-col gap-4 px-4 lg:order-none lg:max-w-[800px]">
          <div className="space-y-2">
            <h1 className="text-[1.8rem] font-bold md:text-[2.3rem]">
              {post.diary?.title}
            </h1>
            <p className="whitespace-pre-wrap break-words text-navTextColor">
              {post.diary?.description}
            </p>
          </div>
          <PostTags tags={post.tags} />
          <div>
            <SyntaxHighlighter
              language="jsx"
              style={dracula}
              showLineNumbers
              customStyle={{
                fontSize: ".75rem",
                overflow: "auto",
                borderRadius: ".75rem",
                height: "600px",
              }}
            >
              {post.diary?.codeSnippet as string}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* RIGHT */}
        <PostAside post={post} />
      </div>
    </section>
  );
}
