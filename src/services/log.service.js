import { showErrorToast } from "../cmps/Toast"
import { utilService } from "./util.service"

const LOG_TYPE = {
    DEBUG: 'DEBUG',
    NOTIFY: 'NOTIFY',
    WARNING: 'WARNING',
    ERROR: 'ERROR'
}

const isDebug = process.env.NODE_ENV === 'development'

export const logService = {
    debug,
    notify,
    warning,
    error
}
    
function debug(tag, message) {
    console.debug(tag, message)
}

function notify(tag, message, showToast = true) {
    
    console.warn(tag, message)

    if (isDebug && showToast) {
        showToastMessage(tag, message, '#0000ff')
    }
}

function warning(tag, message, showToast = true) {

    console.warn(tag, message)

    if (isDebug && showToast) {
        showToastMessage(tag, message, '#ffcc00')
    }
}

function error(logType, tag, message, showToast = true) {
    console.error(tag, message)

    if (isDebug && showToast) {
        showErrorToast({ message: utilService.getPhrase("general_error", phrases) })
    }

    composeEmail(LOG_TYPE.ERROR, tag, message)
}

const showToastMessage = (tag, message, color) => {
    /*if (typeof Toast !== 'undefined') {
        Toast.show({
            text: `<b>${tag}</b>: ${message}`,
            color,
            duration: 2000,
        })
    } else {
        console.log(`Toast Message: ${tag} - ${message}`)
    }*/
}

const composeEmail = async (logType, subject, message) => {
    /*try {
        const response = await axios.post(`${process.env.ERROR_REPORT_URL}`, {
            type: logType.toUpperCase(),
            subject,
            message,
            appEnv: process.env.NODE_ENV.toUpperCase()
        })
        console.log("Email report sent successfully:", response.status)
    } catch (error) {
        console.error("Failed to send email report:", error)
    }*/
}