import { userService } from "../services/user.service.js"

// home.worker.js

self.onmessage = async (event) => {
  try {
    const { type, getHomeFunc, token } = event.data

    if (type === 'fetchFullData') {
        try {
            const homeFullData = await userService.home(true, token) 
            self.postMessage({ type: 'fullData', data: homeFullData })
        } catch (error) {
            self.postMessage({ type: 'error', error: error.message })
        }
    }
  } catch (err) {
    self.postMessage({ type: 'error', error: err.message })
  }

  
}

