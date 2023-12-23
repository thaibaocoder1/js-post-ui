import postAPI from './api/postAPI'
import { getUlPagination, setTextContent, truncateText } from './utils'
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
function renderPagination(pagination) {
  const ulPagination = getUlPagination()
  if (!pagination) return
  // calculate total pages
  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)
  // save page and total pages to ul element
  if (!ulPagination) return
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages
  // check hide/show links
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')
  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}
async function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location)
  url.searchParams.set(filterName, filterValue)
  history.pushState({}, '', url)
  // fetch api
  // re-render post list
  const { data, pagination } = await postAPI.getAll(url.searchParams)
  renderPostList(data)
  renderPagination(pagination)
}
function handlePrevClick(e) {
  e.preventDefault()
  const ulPagination = getUlPagination()
  if (!ulPagination) return
  // get current page
  const page = Number.parseInt(ulPagination.dataset.page) || 1
  if (page <= 1) return
  // hanlde data change
  handleFilterChange('_page', page - 1)
}
function handleNextClick(e) {
  e.preventDefault()
  const ulPagination = getUlPagination()
  if (!ulPagination) return
  // get current page
  const page = Number.parseInt(ulPagination.dataset.page) || 1
  const totalPages = Number.parseInt(ulPagination.dataset.totalPages)
  if (page >= totalPages) return
  // hanlde data change
  handleFilterChange('_page', page + 1)
}
function initPagination() {
  // bind click event for prev/next link
  const ulPagination = getUlPagination()
  if (!ulPagination) return
  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick)
  }
  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.lastElementChild
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }
}
function initURL() {
  const url = new URL(window.location)
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
  history.pushState({}, '', url)
}

;(async () => {
  try {
    initPagination()
    initURL()
    const queryParams = new URLSearchParams(window.location.search)
    const { data, pagination } = await postAPI.getAll(queryParams)
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('main js', error)
  }
})()
