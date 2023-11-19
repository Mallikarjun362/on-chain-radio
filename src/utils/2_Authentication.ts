import * as jwt from 'jsonwebtoken';
import { JWT_AUTHENTICATION, NOUNCE } from "./3_Constants"
import axios from "axios";

export function setCookie(cname: string, cvalue: string) {
    const d = new Date();
    d.setTime(d.getTime() + JWT_AUTHENTICATION.expiresIn);
    document.cookie = cname + "=" + cvalue + ";" + "expires=" + d.toUTCString() + ";path=/";
}

export function delete_cookie(name: string) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function getCookieValue(cookie_name: string) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(cookie_name + '=') === 0) {
            return cookie.substring(cookie_name.length + 1, cookie.length);
        }
    }
    return null;
}

export const generateJwtToken = (data: any): string => {
    const expiresIn = JWT_AUTHENTICATION.expiresIn;
    const jwt_token = jwt.sign(data, JWT_AUTHENTICATION.jwt_secret_key, { expiresIn });
    return jwt_token;
};

export const verifyJwtToken = (jwt_token: string) => {
    try {
        const decoded = jwt.verify(jwt_token, JWT_AUTHENTICATION.jwt_secret_key);
        return true;
    } catch (error) {
        return false
    }
}

const connect1 = async (wallet_address: string, public_key: string) => {
    const CONNECT1_URL = "/api/auth/connect1"
    const response = await axios.post(CONNECT1_URL, { wallet_address, public_key }).catch((err: any) => {
        throw new Error("Connect 1 Error");
    })
    return response.data.nounce_message;
}

const connect2 = async (wallet_address: string, signature: string,) => {
    const CONNECT1_URL = "/api/auth/connect2"
    const response = await axios.post(CONNECT1_URL, { wallet_address, signature }).catch((err: any) => {
        throw new Error("Connect 2 Error");
    });
    return response.data.jwt_auth_token;
}

const signMessage = async (nounce_message: any) => {
    const response = await (window as any).aptos.signMessage({
        message: nounce_message,
        nonce: NOUNCE,
    });
    return response.signature;
}

export const connectToBackend = async (wallet_address: string, public_key: string): Promise<string> => {
    if (!wallet_address || !public_key) {
        alert('Wallet Not Connected');
        return ''
    }
    const nounce_message = await connect1(wallet_address, public_key);
    const signature = await signMessage(nounce_message);
    const jwt_auth_token = await connect2(wallet_address, signature);
    setCookie('jwt_auth_token', jwt_auth_token)
    return jwt_auth_token
};