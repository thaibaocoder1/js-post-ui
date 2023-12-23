export function setTextContent(parentElement, selector, text) {
  if (!parentElement) return
  const element = parentElement.querySelector(selector)
  if (element) {
    element.textContent = text
  }
  return element
}
export function truncateText(text, maxLength) {
  if (!text) return
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}
