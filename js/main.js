import axiosClient from './api/axiosClient'
import postAPI from './api/postAPI'

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    }
    const data = await postAPI.getAll(queryParams)
    console.log(data)
  } catch (error) {
    console.log('main js', error)
  }
}
main()
