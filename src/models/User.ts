import mongoose from "mongoose"
const {model, Schema} = mongoose

type IUserBase = {
    discordID: string,
    username: string,
    password: string,
    remindersEnabled: boolean
}

export type IUser = mongoose.Document & IUserBase

const userSchema = new Schema({
    username: String,
    password: String,
    discordID: String,
    remindersEnabled: Boolean
})

export const User = model<IUser>("User", userSchema)