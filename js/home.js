import postApi from './api/postAPI'
import { initPagination, initSearch, renderListPost, renderPagination } from './utils'
// Functions
async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location)
    if (filterName === 'title_like') url.searchParams.set('_page', 1)
    url.searchParams.set(filterName, filterValue)
    history.pushState({}, '', url)
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderListPost('postList', data)
    renderPagination('postsPagination', pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

// Main
;(async () => {
  try {
    const url = new URL(window.location)
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
    history.pushState({}, '', url)
    const queryParams = url.searchParams

    initPagination({
      elementID: 'postsPagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })
    initSearch({
      elementID: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', page),
    })

    const { data, pagination } = await postApi.getAll(queryParams)
    renderListPost('postList', data)
    renderPagination('postsPagination', pagination)
  } catch (err) {
    console.log('failed to fetch list post', err)
  }
})()
