import { format, formatDistance, isYesterday, isToday } from "date-fns";

export default function formatDate(date: Date) {
    if(isToday(date)) {
        return formatDistance(date, new Date(), { addSuffix: true })
    }

    if(isYesterday(date)) {
        return "Yesterday"
    }

    return format(date, 'MMMM d, yyyy')
}
