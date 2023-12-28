function showModal(modalElement) {
  const myModal = new window.bootstrap.Modal(modalElement)
  if (myModal) myModal.show()
}
export function registerLightbox({ modalID, imageSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalID)
  if (!modalElement) return
  if (modalElement.dataset.registered) return
  const imageElement = modalElement.querySelector(imageSelector)
  const prevButton = modalElement.querySelector(prevSelector)
  const nextButton = modalElement.querySelector(nextSelector)
  let imgList = []
  let currentIndex = 0
  if (!imageElement || !prevButton || !nextButton) return
  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src
  }
  document.addEventListener('click', (e) => {
    const { target } = e
    if (target.tagName !== 'IMG' || !target.dataset.album) return
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((x) => x === target)
    showImageAtIndex(currentIndex)
    showModal(modalElement)
  })
  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImageAtIndex(currentIndex)
  })
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length
    showImageAtIndex(currentIndex)
  })
  modalElement.dataset.registered = 'true'
}
