import {EduLinkResponse, sendRequest} from "./base.js";
import {config} from "dotenv";

config()
const {
    ESTABLISHMENT_ID
} = process.env

type LoginData = {
    authtoken: string,
    establishment: {
        applicant_admission_gropups: {id: number, name: string}[],
        application_intake_groups: {id: number, name: string}[],
        community_groups: {id: number, name: string}[],
        discover_groups: {id: number, name: string}[],
        form_groups: {id: number, name: string}[]
        logo: string,
        name: string,
        report_card_target_types: {id: number, code: string, description: string}[],
        rooms: {id: number, code: string, name: string}[],
        subjects: {id: number, name: string, active: boolean}[],
        teaching_groups: {id: number, name: string, employee_id: number, year_group_ids: number[]}[],
        year_groups: {id: number, name: string}[]
    },
    user: {
        avatar: {
            height: number,
            photo: string,
            width: number
        },
        community_group_id: number,
        establishment_id: number,
        forename: "string",
        form_group_id: number,
        gender: "Male" | "Female",
        id: number,
        surname: string,
        title: unknown,
        types: string[],
        username: string,
        year_group_id: number
    }
}

export type LoginResponse = LoginData & EduLinkResponse

export function loginReq(username: string, password: string): Promise<LoginResponse | undefined> {
    return sendRequest<LoginResponse>("EduLink.Login", {
        username,
        password,
        establishment_id: ESTABLISHMENT_ID
    })
}