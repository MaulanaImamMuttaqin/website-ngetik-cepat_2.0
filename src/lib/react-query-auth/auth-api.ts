import { storage } from "../../utils/storage";
import { request } from "../axios/axios";


interface AuthResponse {
    data: {
        access: string,
        refresh: string
    }
}

export interface User {
    id: string;
    email: string;
    name?: string;
}


export async function handleApiResponse(response: any) {
    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
        return Promise.reject(data);
    }
}

export async function getUserProfile() {

    return request({ url: '/superheroes', method: 'post', data: 'tes' })

    // return await fetch(`${API_URL}/auth/me`, {
    //     headers: {
    //         Authorization: storage.getToken()
    //     }
    // }).then(handleApiResponse);
}

export async function loginwithUsernameAndPassword(data: any): Promise<AuthResponse> {
    return request({ url: '/auth/token/obtain/', method: 'post', data })
}

export async function registerWithEmailAndPassword(data: any): Promise<AuthResponse> {
    return request({ url: '/superheroes', method: 'post', data })
}
