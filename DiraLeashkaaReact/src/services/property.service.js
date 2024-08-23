import { httpService } from './http.service.js'
import { userService } from './user.service.js'
import { utilService } from './util.service.js'

const BASE_URL = 'property/'

export const propertyService = {
    //query,
    //explore,
    //save,
    //remove,
    getById,
}

async function query(pageNumber, pagingSize, variant) {
    
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) throw 'user error'
    
    const filter = { variant }
    const sort = { sortBy: 'createdAt', sortDir: -1 }
    const paging = { pageNumber, pagingSize }
    const params = { ...filter, ...sort, ...paging }

    try {
        const postsData = await httpService.get(BASE_URL, params)
        return postsData    
    } catch(err) {
        console.log("Had problems getting posts")
        throw err
    }
}

async function getById(propertyId) {
    debugger
    const property = await httpService.get(BASE_URL + propertyId)
    return property
}

function remove(postId) {
    //return storageService.remove(STORAGE_KEY, postId)
}

async function save(postToSave) {
    if (postToSave._id) {
        return await httpService.put(BASE_URL, postToSave)
    } else {
        return await httpService.post(BASE_URL, postToSave)
    }
}

function getDefaultFilter() {
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) throw 'user error'

    return {
        createdBy: loggedinUser,
    }
}

async function createPost(text, mediaURL) {
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) throw 'user error'

    const post = { 
        createdBy: loggedinUser,
        createdAt: new Date().getTime(),
        media: [{url: mediaURL, type: utilService.getMediaType(mediaURL)}], 
        text: text, 
        likes: [], 
        comments: [],
        saves: []
    }
    
    await save(post)
}

async function like(postId) {
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) throw 'user error'

    return await httpService.put(BASE_URL + postId + "/like")
}

async function unlike(postId) {
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) throw 'user error'

    return await httpService.put(BASE_URL + postId + "/unlike")
}

async function saveByUser(postId) {
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) throw 'user error'

    return await httpService.put(BASE_URL + postId + "/save")
}

async function unsaveByUser(postId) {
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) throw 'user error'

    return await httpService.put(BASE_URL + postId + "/unsave")
}

async function addComment(postId, comment) {
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) throw 'user error'

    const commentToAdd = {
        comment
    }
    
    return await httpService.put(BASE_URL + postId + "/comment", commentToAdd)
}

async function savedByUser(postToSave) {
    httpService.put(BASE_URL + postToSave + '/save/')
    return postToSave
}

async function unsavedByUser(postToUnsave) {
    await httpService.put(BASE_URL + postToUnsave + '/unsave/')
    return postToUnsave
}