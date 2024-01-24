import postApi from './api/postAPI'
import { initPostForm } from './utils'
import { toast } from './utils/toast'
// Functions
function removeUnusedFields(formValues) {
  const payload = { ...formValues }
  if (payload.imageSource === 'upload') {
    delete payload.imageUrl
  } else {
    delete payload.image
  }
  delete payload.imageSource
  if (!payload.id) delete payload.id
  return payload
}

function jsonToFormData(jsonObject) {
  const formData = new FormData()
  for (const key in jsonObject) {
    formData.set(key, jsonObject[key])
  }
  return formData
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnusedFields(formValues)
    const formData = jsonToFormData(payload)
    // check add/edit mode
    // call API
    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData)
    // show success message
    toast.success('Save post successfully!')
    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`)
    }, 2000)
  } catch (error) {
    console.log('failed to save post', error)
    toast.error(`Failed to save post with error: ${error.message}`)
  }
}
// Main
;(async () => {
  try {
    const seachParams = new URLSearchParams(location.search)
    const postID = seachParams.get('id')
    const defaultValues = Boolean(postID)
      ? await postApi.getByID(postID)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }
    initPostForm({
      formID: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log('failed to fetch post details', error)
  }
})()
