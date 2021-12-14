import {Client, Message, MessageEmbed} from "discord.js";
import { LoginCommand} from "./login.js";
import { TodayCommand} from "./today.js";
import { TomorrowCommand} from "./tomorrow.js";
import {ToggleReminders} from "./toggleReminders.js";
import {Command} from "./Command.js";

const commandList: Command[] = [
    new LoginCommand(),
    new TodayCommand(),
    new ToggleReminders(),
    new TomorrowCommand()
]

export async function commands(bot: Client, msg: Message) {
    if (msg.content.split(" ")[0] === "e!help") {
        const embed = new MessageEmbed()
            .setTitle("Better Edulink Commands")

        for (const command of commandList) {
            embed.addField(command.aliases.toString().replace("[", "").replace("]", "").replaceAll(",", ", "), command.description)
        }

        await msg.channel.send({embeds: [embed]})
    }

    for (const command of commandList) {
        if (command.check(bot, msg)) {
            return // Exit early if match found
        }
    }
}