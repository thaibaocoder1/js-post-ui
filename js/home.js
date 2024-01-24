import postApi from './api/postAPI'
import { initPagination, initSearch, renderListPost, renderPagination } from './utils'
import { toast } from './utils/toast'
// Functions
async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location)
    if (filterName) url.searchParams.set(filterName, filterValue)
    if (filterName === 'title_like') url.searchParams.set('_page', 1)
    history.pushState({}, '', url)
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderListPost('postList', data)
    renderPagination('postsPagination', pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}
function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (e) => {
    try {
      const post = e.detail
      if (window.confirm(`Are you sure to remove post?`)) {
        await postApi.remove(post.id)
        await handleFilterChange()
        toast.success('Remove post success')
      }
    } catch (error) {
      console.log('failed to remove post', error)
      toast.error(error.message)
    }
  })
}
// Main
;(async () => {
  try {
    const url = new URL(window.location)
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
    history.pushState({}, '', url)
    const queryParams = url.searchParams

    registerPostDeleteEvent()

    initPagination({
      elementID: 'postsPagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })
    initSearch({
      elementID: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    handleFilterChange()
  } catch (err) {
    console.log('failed to fetch list post', err)
  }
})()
