export function renderPagination(elementID, pagination) {
  const paginationEl = document.getElementById(elementID)
  if (!pagination || !paginationEl) return
  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)
  paginationEl.dataset.page = _page
  paginationEl.dataset.totalPages = totalPages
  if (_page <= 1) paginationEl.firstElementChild.classList.add('disabled')
  else paginationEl.firstElementChild.classList.remove('disabled')
  if (_page >= totalPages) paginationEl.lastElementChild.classList.add('disabled')
  else paginationEl.lastElementChild.classList.remove('disabled')
}
export function initPagination({ elementID, defaultParams, onChange }) {
  const paginationEl = document.getElementById(elementID)
  if (!paginationEl) return
  const prevLink = paginationEl.firstElementChild?.firstElementChild
  const nextLink = paginationEl.lastElementChild?.lastElementChild
  nextLink &&
    nextLink.addEventListener('click', (e) => {
      e.preventDefault()
      const page = Number.parseInt(paginationEl.dataset.page) || 1
      const totalPages = Number.parseInt(paginationEl.dataset.totalPages)
      if (page >= totalPages) return
      onChange?.(page + 1)
    })
  prevLink &&
    prevLink.addEventListener('click', (e) => {
      e.preventDefault()
      const page = Number.parseInt(paginationEl.dataset.page) || 1
      if (page <= 1) return
      onChange(page - 1)
    })
}
