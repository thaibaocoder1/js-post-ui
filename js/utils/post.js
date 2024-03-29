import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncateText } from './common'
dayjs.extend(relativeTime)
// Functions
export function createPostItem(postItem) {
  if (!postItem) return
  const postItemTemplate = document.getElementById('postItemTemplate')
  if (!postItemTemplate) return
  const postItemEl = postItemTemplate.content.firstElementChild.cloneNode(true)
  if (postItemEl) {
    setTextContent(postItemEl, "[data-id='title']", postItem.title)
    setTextContent(postItemEl, "[data-id='description']", truncateText(postItem.description, 100))
    setTextContent(postItemEl, "[data-id='author']", postItem.author)
    const thumbnailPostItem = postItemEl.querySelector("[data-id='thumbnail']")
    if (thumbnailPostItem) {
      thumbnailPostItem.src = postItem.imageUrl
      thumbnailPostItem.addEventListener('error', () => {
        thumbnailPostItem.src = 'https://placehold.co/600x400?text=thumbnail'
      })
    }
    setTextContent(postItemEl, "[data-id='timeSpan']", dayjs(postItem.updatedAt).fromNow())
  }
  // go to post detail when click div.post-item
  const divElement = postItemEl.firstElementChild
  if (!divElement) return
  divElement.addEventListener('click', (e) => {
    const menu = divElement.querySelector("[data-id='menu']")
    if (menu && menu.contains(e.target)) return
    window.location.assign(`/post-detail.html?id=${postItem.id}`)
  })
  const editButton = divElement.querySelector("[data-id='edit']")
  if (editButton) {
    editButton.addEventListener('click', () => {
      window.location.assign(`/add-edit-post.html?id=${postItem.id}`)
    })
  }
  const removeButton = divElement.querySelector("[data-id='remove']")
  if (removeButton) {
    removeButton.addEventListener('click', (e) => {
      const customEvent = new CustomEvent('post-delete', {
        bubbles: true,
        detail: postItem,
      })
      removeButton.dispatchEvent(customEvent)
    })
  }
  return postItemEl
}
export function renderListPost(elementID, listPost) {
  if (!Array.isArray(listPost)) return
  const ulElement = document.getElementById(elementID)
  if (!ulElement) return
  ulElement.textContent = ''
  listPost.forEach((post) => {
    const liElement = createPostItem(post)
    ulElement.appendChild(liElement)
  })
}
