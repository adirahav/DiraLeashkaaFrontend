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

function notify(tag, message) {
    console.warn(tag, message)
}

function warning(tag, message) {

    console.warn(tag, message)
}

function error(tag, message) {
    console.error(tag, message)
}