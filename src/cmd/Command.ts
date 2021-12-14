import {Client, Message} from "discord.js";

export abstract class Command {
    check(bot: Client, msg: Message): boolean {
        if (msg.content.startsWith("e!")) {
            const command = msg.content.split(" ")[0]

            for (const alias of this.aliases) {
                if (command === "e!" + alias) {
                    this.run(bot, msg)
                    return true
                }
            }
        }

        return false
    }

    abstract description: string
    abstract aliases: string[]
    abstract run(bot: Client, msg: Message): void
}