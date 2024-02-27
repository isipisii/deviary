import readingTime from "reading-time";

export default function estimateReadingTime(content: string) {
    const { text } = readingTime(content);
    return text
}