import {Message, MessageCollector, TextBasedChannels, User} from "discord.js";
import {createCipheriv} from "crypto";
import {config} from "dotenv";

config()
const {
    SECRET
} = process.env

export function input(channel: TextBasedChannels, user: User): Promise<Message | undefined> {
    return new Promise((res) => {
        const collector = new MessageCollector(channel, {})
        collector.on("collect", msg => {
            res(msg)
        })
    })
}