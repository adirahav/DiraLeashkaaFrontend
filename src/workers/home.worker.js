import { userService } from "../services/user.service.js"

self.onmessage = async (event) => {
    if (event.data.type === 'fetchFullData') {
        try {
            const homeFullData = await userService.home(true) 
            self.postMessage({ type: 'fullData', data: homeFullData })
        } catch (error) {
            self.postMessage({ type: 'error', error: error.message })
        }
    }
}