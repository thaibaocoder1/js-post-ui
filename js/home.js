import postAPI from './api/postAPI'
import { setTextContent, truncateText } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
function createPostElement(post) {
  if (!post) return
  // find template clone template
  const postTemplate = document.getElementById('postItemTemplate')
  if (!postTemplate) return
  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return
  // update content
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
  setTextContent(liElement, '[data-id="author"]', post.author)
  // calculate timespan
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)
  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = `https://placehold.co/600x400?text=thumbnail`
    })
  }
  // attach events
  return liElement
}
function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return
  const ulElement = document.getElementById('postList')
  if (!ulElement) return
  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}
;(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    }
    const { data, pagination } = await postAPI.getAll(queryParams)
    renderPostList(data)
  } catch (error) {
    console.log('main js', error)
  }
})()
