export function formatTitleWithId(title: string, postId: string) {
    const titleArrayWithPostId = [...title.split(" "), postId];
    const formattedTitleWithDash = titleArrayWithPostId.join("-");

    return formattedTitleWithDash;
}