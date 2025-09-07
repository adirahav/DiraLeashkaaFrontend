import { httpService } from "./http.service"

const BASE_URL = 'contactUs/'

export const contactUsService = {
    send
}

async function send(messageToSend) {
    messageToSend = {
        ...messageToSend,
        appEnv: import.meta.env.MODE
    }
    const sentMessage = await httpService.post(BASE_URL, messageToSend)
    return sentMessage
}

