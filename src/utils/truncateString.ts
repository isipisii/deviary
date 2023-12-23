export default function truncateString(text: string, maximumCharacters: number): string {
    if(text.length > maximumCharacters) {
        return text.slice(0, maximumCharacters) + "..."
    } return text
}