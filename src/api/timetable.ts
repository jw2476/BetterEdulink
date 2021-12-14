import {loginReq} from "./login.js";
import {IUser} from "../models/User.js";
import {EduLinkResponse, sendRequest} from "./base.js";

type Timetable = {
    weeks: [{
        is_current: boolean,
        name: string,
        days: [{
            cycle_day_id: number,
            date: string,
            is_current: boolean,
            name: string,
            original_name: number,
            lessons: [{
                period_id: number,
                room: {
                    name: string,
                    id: number,
                    moved: false
                },
                teacher: {
                    id: number,
                    forename: string,
                    surname: string,
                    title: string
                },
                teachers: string,
                teaching_group: {
                    id: number,
                    name: string,
                    subject: string
                }
            }],
            periods: [{
                id: number,
                empty: boolean,
                end_time: string, // HH:MM
                name: string,
                sims_id: number,
                start_time: string // HH:MM
            }]
        }]
    }]
}

export type TimetableResponse = Timetable & EduLinkResponse

export async function timetableReq(user: IUser): Promise<TimetableResponse | undefined> {
    const loginRes = await loginReq(user.username, user.password)
    if (!loginRes) return

    const date = new Date(Date.now())

    return await sendRequest<TimetableResponse>("EduLink.Timetable", {
        date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
        learner_id: loginRes.user.id
    }, loginRes.authtoken)
}