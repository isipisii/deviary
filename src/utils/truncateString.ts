export default function truncateString(text: string): string {
    if(text.length > 70) {
        return text.slice(0, 70) + "..."
    } return text
}