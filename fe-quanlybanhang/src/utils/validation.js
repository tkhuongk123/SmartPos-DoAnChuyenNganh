
export default function validation(element) {
    const value = element.value.trim()
    if(value === "") {
        element.style.borderColor = "red"
        element.focus()
        return false
    } else {
        element.style.borderColor = "#ccc"
        return true
    }
}
