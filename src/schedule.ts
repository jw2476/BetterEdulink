import {IUser} from "./models/User";

export type Task = {
    time: number,
    run: () => void
}

export const schedule: Task[] = []

export function addToSchedule(task: Task) {
    schedule.push(task)
}

