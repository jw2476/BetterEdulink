import {Client, Message} from "discord.js";
import {IUser, User} from "../models/User.js";
import {Command} from "./Command.js";

export class ToggleReminders extends Command {
    aliases = ["toggleReminders"]
    description = "Toggle the lesson reminders"

    async run(bot: Client, msg: Message): Promise<void> {
        const user = await User.findOne({discordID: msg.author.id}) as IUser
        if (!user) {
            await msg.reply("Sign up with e!login first")
            return
        }

        await msg.reply(`Reminders have been ${user.remindersEnabled ? "Disabled" : "Enabled"}`)
        user.remindersEnabled = !user.remindersEnabled
        await user.save()
    }
}