const PLATFORM = {
    MOBILE: "MOBILE",
    TABLET: "TABLET",
    DESKTOP: "DESKTOP"
}

const MEDIA_WIDTH = {
    MOBILE: 807,
    TABLET: 808,
    DESKTOP: 1064
}

export const utilService = {
    makeId,
    saveToStorage,
    loadFromStorage,
    getPlatform,
    debounce,
    throttle,
    priceFormat,
    percentFormat,
    PLATFORM
}

function makeId(length = 5) {
    var text = ""
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function saveToStorage(key, value) {
    localStorage[key] = JSON.stringify(value)
}

function loadFromStorage(key, defaultValue = null) {
    const value = localStorage[key] || defaultValue
    return JSON.parse(value)
}

function getPlatform() {
    return window.innerWidth <= MEDIA_WIDTH.MOBILE
                ? PLATFORM.MOBILE
                : window.innerWidth >= MEDIA_WIDTH.DESKTOP
                    ? PLATFORM.DESKTOP
                    : PLATFORM.TABLET
}

// debounce calls a function when a user has not carried
// out an event in a specific amount of time
function debounce(fn, wait) {
    let timer
    return function(...args) {
        if (timer) {
            clearTimeout(timer) // clear any pre-existing timer
        }
        const context = this // get the current context
        timer = setTimeout(() => {
            fn.apply(context, args) // call the function if time expires
        }, wait)
    }
}

// throttle() calls a function at intervals of a specified time
// while the user is carrying out an event
function throttle(fn, wait) {
    let throttled = false
    return function(...args) {
        if (!throttled) {
            fn.apply(this, args)
            throttled = true
            setTimeout(() => {
                throttled = false
            }, wait)
        }
    }
}

function priceFormat(price) {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
}

function percentFormat(value) {
    return `${value.toFixed(1)}%`
}
  
Number.prototype.fractionToFloatFormat = function(digits) {
    if (this !== null) {
        return (this * 100).toFixed(digits)
    } else {
        return (0).toFixed(digits)
    }
}
