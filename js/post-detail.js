import postAPI from './api/postAPI'
import { registerLightbox, setTextContent } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
// Functions
function renderInfoPost(postInfo) {
  if (!postInfo) return
  setTextContent(document, '#postDetailTitle', postInfo.title)
  setTextContent(document, '#postDetailDescription', postInfo.description)
  setTextContent(document, '#postDetailAuthor', postInfo.author)
  const postHeroImage = document.getElementById('postHeroImage')
  if (postHeroImage) {
    postHeroImage.style.backgroundImage = `url(${postInfo.imageUrl})`
    postHeroImage.addEventListener('error', (e) => {
      postHeroImage.src = 'https://placehold.co/1080x720'
    })
  }
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(postInfo.createdAt).format('- DD/MM/YYYY HH:mm'),
  )
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${postInfo.id}`
    editPageLink.textContent = 'Edit Post'
  }
}
// Main
;(async () => {
  registerLightbox({
    modalID: 'modalLightBox',
    imageSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  })
  try {
    // get post id from url
    const queryParams = new URLSearchParams(location.search)
    const postID = queryParams.get('id')
    if (!postID) return
    // fetch post by id
    const postInfo = await postAPI.getByID(postID)
    renderInfoPost(postInfo)
    // render post
  } catch (error) {
    console.log('post not found', error)
  }
})()
