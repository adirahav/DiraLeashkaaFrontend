// STORE: STEP 5

import { GET_USERS, ADD_USER, UPDATE_USER, DELETE_USER, UNDO_DELETE_USER } from "../reducers/user.reducer.js";
import { userService } from "../../services/user.service.js";
import { store } from "../store.js";

export async function loadUsers() {
    try {
        /*const users = await userService.queryUsers();
        store.dispatch({type: GET_USERS, users});*/
        store.dispatch({type: GET_USERS, users: null});   
    }
    catch(err) {
        console.log("Had issues loading users");
        throw err;
    }
}

export async function saveUser(userToSave) {
    const type = userToSave.id ? UPDATE_USER : ADD_USER;
    try {
        /*const savedUser = await userService.saveUser(userToSave);
        store.dispatch({type, user: savedUser});*/
        store.dispatch({type, user: null});   
    }
    catch(err) {
        console.log("Had issues saving user");
        throw err;
    }
}

export async function removeUser(userID) {
    try {
        /*await userService.removeUser(userID);
        store.dispatch({type: DELETE_USER, userID}); */  
        store.dispatch({type, user: null});   
    }
    catch(err) {
        console.log("Had issues removing user");
        throw err;
    }
}
