import {Client, Message} from "discord.js";
import {input} from "../utils.js";
import {loginReq} from "../api/login.js";
import {IUser, User} from "../models/User.js";
import {Command} from "./Command.js";

export class LoginCommand extends Command {
    aliases = ["login", "setup"];
    description = "Login to EduLink and setup your new Better Edulink account!"

    async run(bot: Client, msg: Message): Promise<void> {
        const dmChannel = await msg.author.createDM()

        await dmChannel.send("Please send your username below...")
        const usernameMsg = await input(dmChannel, msg.author)
        if (!usernameMsg) {
            await dmChannel.send("An error has occurred, you will need to restart by running e!login")
            return
        }

        await dmChannel.send(`Username: ${usernameMsg.content}, please send your password below...`)
        const passwordMsg = await input(dmChannel, msg.author)
        if (!passwordMsg) {
            await dmChannel.send("An error has occurred, you will need to restart by running e!login")
            return
        }

        await dmChannel.send("Password received (please delete the password message), checking credentials...")
        const loginRes = await loginReq(usernameMsg.content, passwordMsg.content)
        if (!loginRes) {
            await dmChannel.send("An error has occurred, you will need to restart by running e!login")
            return
        }

        await dmChannel.send(`You are ${loginRes.user.forename} ${loginRes.user.surname} from ${loginRes.establishment.name}. Credentials verified`)

        const existingUser: IUser = await User.findOne({discordID: msg.author.id}) as IUser
        if (existingUser) {
            await dmChannel.send("You are already signed up, if you want your password changed ask Jw2476")
        } else {
            await new User({
                username: usernameMsg.content,
                password: passwordMsg.content,
                discordID: msg.author.id,
                remindersEnabled: true
            }).save()
        }
    }

}