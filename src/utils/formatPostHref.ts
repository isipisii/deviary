export default function formatPostHref(post: TPost) {
  const href = `/@${post.author.name.split(" ").join(".")}/${
    post.blog
      ? formatTitleWithId(post.blog?.title, post.id)
      : formatTitleWithId(post.diary?.title as string, post.id)
  }`;

  return href;
}

function formatTitleWithId(title: string, postId: string) {
  const titleArrayWithPostId = [...title.split(" "), postId];
  const formattedTitleWithDash = titleArrayWithPostId.join("-");

  return formattedTitleWithDash;
}
