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
    PLATFORM
}

function makeId(length = 5) {
    var text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function saveToStorage(key, value) {
    localStorage[key] = JSON.stringify(value);
}

function loadFromStorage(key, defaultValue = null) {
    const value = localStorage[key] || defaultValue;
    return JSON.parse(value);
}

function getPlatform() {
    return window.innerWidth <= MEDIA_WIDTH.MOBILE
                ? PLATFORM.MOBILE
                : window.innerWidth >= MEDIA_WIDTH.DESKTOP
                    ? PLATFORM.DESKTOP
                    : PLATFORM.TABLET;
}
