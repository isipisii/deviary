export default function formatDate(date: Date) {
    const currentDate = new Date().toLocaleDateString()
    const dateParam = new Date(date)

    if(currentDate === dateParam.toLocaleDateString()) {
        return "Today"
    }

    if(isYesterday(dateParam)) {
        return "Yesterday"
    }

    return dateParam.toDateString().split(" ").slice(1).join(" ")
}

function isYesterday (date: Date) {  
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
  
    return date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
}