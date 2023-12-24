import debounce from 'lodash.debounce'

export function initSearch({ elementID, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementID)
  if (!searchInput) return

  if (defaultParams && defaultParams.get('title_like')) {
    searchInput.value = defaultParams.get('title_like')
  }

  const debounceSearch = debounce((e) => {
    onChange?.(e.target.value)
  }, 500)
  searchInput.addEventListener('input', debounceSearch)
}
