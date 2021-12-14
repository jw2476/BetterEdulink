import {Client, Message, MessageEmbed} from "discord.js";
import {IUser, User} from "../models/User.js";
import {timetableReq} from "../api/timetable.js";
import {Command} from "./Command.js";

export class TodayCommand extends Command {
    aliases = ["today", "t"];
    description = "Get the timetable for today";

    async run(bot: Client, msg: Message): Promise<void> {
        const user: IUser = await User.findOne({discordID: msg.author.id}) as IUser
        if (!user) {
            await msg.reply("You haven't logged in yet, use e!login")
            return
        }

        const timetableRes = await timetableReq(user)
        if (!timetableRes) {
            await msg.reply("An error has occurred")
            return
        }

        const embed = new MessageEmbed()
            .setTitle("Today's Timetable")

        const thisWeek = timetableRes.weeks.find(week => week.is_current)
        const thisDay = thisWeek!!.days.find(day => day.is_current)
        for (const lesson of thisDay!!.lessons) {
            embed.addField(lesson.teaching_group.subject, `${lesson.room.name} - ${lesson.teachers} `)
        }

        await msg.channel.send({embeds: [embed]})
    }

}