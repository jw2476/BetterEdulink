import {Client, Message, MessageEmbed} from "discord.js";
import {IUser, User} from "../models/User.js";
import {timetableReq} from "../api/timetable.js";
import {addDays} from "date-fns";
import {Command} from "./Command.js";

export async function getTomorrowsLessons(user: IUser): Promise<MessageEmbed | undefined> {
    const now = new Date(Date.now())
    const tomorrow = addDays(now, 1)
    const tomorrowStr = `${tomorrow.getFullYear()}-${tomorrow.getMonth()+1}-${tomorrow.getDate()}`

    const timetable = await timetableReq(user)
    if (!timetable) return
    const tomorrowTimetable = timetable.weeks.flatMap(week => week.days).find(day => day.date === tomorrowStr)
    if (!tomorrowTimetable) return

    const embed = new MessageEmbed()
        .setTitle("Tomorrow's Lessons")

    for (const lesson of tomorrowTimetable.lessons) {
        embed.addField(lesson.teaching_group.subject, `${lesson.room.name} - ${lesson.teachers} `)
    }

    return embed
}

export class TomorrowCommand extends Command {
    aliases = ["tomorrow"];
    description = "Get tomorrow's lessons"

    async run(bot: Client, msg: Message): Promise<void> {
        const user: IUser = await User.findOne({discordID: msg.id}) as IUser
        if (!user) {
            await msg.reply("You don't have an account, signup with e!login")
            return
        }
        const tomorrowLessons = await getTomorrowsLessons(user)
        if (!tomorrowLessons) {
            await msg.reply("An error occurred during getting tomorrow's lessons")
            return
        }

        await msg.channel.send({embeds: [tomorrowLessons]})
    }
}