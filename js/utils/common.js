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
export function setFieldValue(form, selector, value) {
  if (!form) return
  const field = form.querySelector(selector)
  if (field) {
    field.value = value
  }
  return field
}
export function setBackgroundImage(parentElement, selector, imageUrl) {
  if (!parentElement) return
  const backgrounImg = parentElement.querySelector(selector)
  if (backgrounImg) backgrounImg.style.backgroundImage = `url(${imageUrl})`
  return backgrounImg
}
export function randomNumber(n) {
  if (n <= 0) return -1
  const random = Math.random() * n
  return Math.round(random)
}
