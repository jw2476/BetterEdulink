import {config} from "dotenv";
import fetch from "node-fetch";

config()
const {
    EDULINK_API_SUBDOMAIN
} = process.env

export type EduLinkResponse = {
    method: string,
    success: boolean,
    error?: string
}

export async function sendRequest<R extends EduLinkResponse>(method: string, payload: any, authtoken?: string): Promise<R | undefined> {
    const url = `https://${EDULINK_API_SUBDOMAIN}.edulinkone.com/api/?method=${method}`

    const body = {
        jsonrpc: "2.0",
        id: 1,
        method,
        params: payload
    }

    const r: any = (await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "X-API-Method": method,
            "Authorization": `Bearer ${authtoken}`
        }
    }).then(res => res.json()))
    const res = r.result as R

    if (!res.success) {
        console.error(`Error with method ${method}: ${res.error}`)
    } else {
        return res
    }
}