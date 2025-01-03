import axios from 'axios';
import { SetPosts } from '../redux/postSlice';

const API_URL = 'http://localhost:8800';

export const API = axios.create({
    baseURL: API_URL,
    responseType: 'json',
});

export const apiRequest = async ({url, token, data, method}) => {
    try {
        const result = await API(url, {
            method: method || 'GET',
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });
        return result?.data;
    } catch (error) {
        return { status: error.success, message: error.message }
    }
}


export const fetchPost = async(token, dispatch,uri,data) =>{

    try {
        const response = await apiRequest({
            method: 'POST',
            url: uri || "/posts",
            data: data || {},
            token: token,
        });
        dispatch(SetPosts(response?.data));
        return;
    } catch (error) {
        console.log(error)
    }
}

export const likePost = async ({token, uri}) =>{
    try {
        const response = await apiRequest({
            method: 'POST',
            url: uri,
            token: token,
        });
        return response;
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = async (id, token) =>{
    try {
        await apiRequest({
            method: 'DELETE',
            url: `/posts/${id}`,
            token: token,
        });
        return;
    } catch (error) {
        console.log(error)
    }
}

export const getUserInfo = async (token, id) =>{
    try {
        const uri = id === undefined ? "/users/get-user" : `/users/get-user/${id}`;
        const response = await apiRequest({
            method: 'POST',
            url: uri,
            token: token,
        });
        if (response?.message === "Authentication failed"){
            localStorage.removeItem('user');
            window.alert("Session expired, please login again");
            window.location.href = "/login";
        }

        return response?.user;
    } catch (error) {
        console.log(error)
    }
}

export const sendFriendRequest = async (token, id) =>{
    try {
        await apiRequest({
            method: 'POST',
            url: `/users/friend-request`,
            token: token,
            data: {requestTo: id},
        });

        return;
    } catch (error) {
        console.log(error)
    }
}

export const acceptFriendRequest = async (token, id) =>{
    try {
        await apiRequest({
            method: 'POST',
            url: `/users/accept-friend-request`,
            token: token,
            data: {requestFrom: id},
        });

        return;
    } catch (error) {
        console.log(error)
    }
}

export const viewUserProfile = async (token, id) =>{
    try {
        await apiRequest({
            method: 'POST',
            url: `/users/profile-view`,
            token: token,
            data: {id},
        });

        return;
    } catch (error) {
        console.log(error)
    }
}

export const addComment = async (token, data, url) =>{
    try{    
    await apiRequest({
            method: 'POST',
            url: url,
            token: token,
            data: data,
        });
        return;
    }
    catch (error) {
        console.log(error)
    }

        
}

export const getComments = async (token, id, uri) =>{
    try {
        const response = await apiRequest({
            method: 'GET',
            url: uri,
            token: token,
        });

        return response?.data;
    } catch (error) {
        console.log(error)
    }
}

