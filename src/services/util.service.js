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

const REG_EXP = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD: /^.{8,20}$/,
}

export const utilService = {
    getPhrase,
    getFixedParameter, 
    getLocalStorage,
    formatNumber,
    formatFloat,
    parseNumber, 
    toSnakeCase,
    toKebabCase,

    makeId,
    saveToStorage,
    loadFromStorage,
    getPlatform,
    getShareMenu,
    debounce,
    throttle,
    priceFormat,
    percentFormat,
    PLATFORM,
    REG_EXP,
}

function getPhrase(key, phrases) {
    const phrase = phrases?.find(phrase => phrase.key === key)
    return phrase ? phrase.value : ""
}

function getFixedParameter(key, fixedParameters) {
    
    if (!fixedParameters) {
        return null
    }

    const fixedParameter = fixedParameters[key]
    
    if (fixedParameter) {
        return JSON.parse(fixedParameter)
    } 

    return null
}

function getLocalStorage(type, key) {
    if (localStorage.getItem(key)) {
        return localStorage.getItem(key)
    } else {
        if (type === "array") {
            return []
        } else {
            return null
        }
    }
}

function formatNumber(value, allowZero) {
    if (allowZero && value === 0) return 0
    if (!value || value === '') return ''
    value = value.toString().replace(/,/g, "")
    return parseInt(value, 10).toLocaleString()
}

function formatFloat(value) {
    return parseFloat(value).toFixed(1)
}

function parseNumber(value) {
    return value.toString().replace(/,/g, '')
}

function toSnakeCase(str) {
    return str?.replace(/([A-Z])/g, "_$1").toLowerCase()
}

function toKebabCase(str) {
    return str?.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
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

function getShareMenu(phrases, fixedParameters) {
    const appVersion = this.getFixedParameter("appVersion", fixedParameters)
    const webVersion = this.getFixedParameter("webVersion", fixedParameters)
     
    const isNative = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android'

    return {
        versionNumber: isNative
                    ? appVersion?.find(entry => entry.key === "lastVersion").value
                    : webVersion?.find(entry => entry.key === "lastVersion").value,
        url: isNative
                    ? `whatsapp://send?text= ${this.getPhrase("android_share_text", phrases)} ${appVersion?.find(entry => entry.key === "url").value}`
                    : `whatsapp://send?text= ${this.getPhrase("web_share_text", phrases)} ${webVersion?.find(entry => entry.key === "url").value}`,
        text: this.getPhrase("drawer_share", phrases) ,
        moreUrl: isNative
                    ? `${webVersion?.find(entry => entry.key === "url").value}`
                    : `${appVersion?.find(entry => entry.key === "url").value}`,
        moreIcon: isNative 
                    ? "web" 
                    : "android",
        moreText: isNative 
                    ? this.getPhrase("drawer_share_web", phrases) 
                    : this.getPhrase("drawer_share_android", phrases)
    }
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
    }).format(price)
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
