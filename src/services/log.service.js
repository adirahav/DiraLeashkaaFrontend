/*const LOG_TYPE = {
    DEBUG: 'DEBUG',
    NOTIFY: 'NOTIFY',
    WARNING: 'WARNING',
    ERROR: 'ERROR'
}*/

//const isDebug = import.meta.env.MODE === 'development'

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