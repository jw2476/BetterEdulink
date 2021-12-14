import {Client, Intents} from "discord.js";
import {config} from "dotenv";
import {commands} from "./cmd/index.js";
import mongoose from "mongoose";
import {User} from "./models/User.js";
import {addToSchedule, schedule} from "./schedule.js";
import {timetableReq} from "./api/timetable.js";
import {addMinutes, setHours, setMinutes, setSeconds} from "date-fns"
import {getTomorrowsLessons} from "./cmd/tomorrow.js";

config()
const {
    TOKEN,
    MONGO_URI
} = process.env

mongoose.connect(MONGO_URI!!).then(() => {
    console.log("Connected to DB!")
})

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const bot = new Client({intents: ["GUILDS", "GUILD_MEMBERS", "DIRECT_MESSAGES", "GUILD_MESSAGES"], partials: ["CHANNEL"]})

bot.on("ready", async client => {
    console.log(`Logged in as: ${client.user.username}`)

    let last = 0

    while (true) {
        let now = Date.now()

        // Run any tasks that were in the last time window
        for (const task of schedule) {
            if (last <= task.time && task.time < now) {
                console.log("running tasks")
                task.run()

                const idx = schedule.indexOf(task)
                if (idx > -1) {
                    schedule.splice(idx, 1)
                }
            }
        }

        if (new Date(last).getDate() !== new Date(now).getDate()) { // If days are different, generate new tasks
            const users = await User.find()
            for (const user of users) {
                // Set reminders for lessons 5 mins before
                if ((await user).remindersEnabled) { // User disabled reminders
                    // Get timetable and today's lessons
                    const timetable = await timetableReq(await user)

                    if (!timetable) continue
                    const thisWeek = timetable.weeks.find(week => week.is_current)
                    const thisDay = thisWeek?.days.find(day => day.is_current)
                    if (!thisDay) continue // No school!

                    let i = 0
                    for (const lesson of thisDay.lessons) {
                        const period = thisDay.periods.find(p => p.id === lesson.period_id)
                        if (!period) continue
                        const hour = parseInt(period.start_time.split(":")[0])
                        const minutes = parseInt(period.start_time.split(":")[1])
                        let time = new Date(Date.now())
                        time = setHours(time, hour)
                        time = setMinutes(time, 0)
                        time = addMinutes(time, minutes - 5)

                        addToSchedule({
                            time: time.getTime(),
                            run: async () => {
                                console.log("Running")
                                console.log(user)
                                const discordUser = await bot.users.fetch((await user).discordID)
                                const dmChannel = await discordUser.createDM()
                                await dmChannel.send(`You have ${lesson.teaching_group.subject} in ${lesson.room.name} with ${lesson.teachers}`)
                            }
                        })
                    }
                }

                // Set morning notification for tomorrow's lessons
                let time = new Date(Date.now())
                time = setHours(time, 19)
                time = setMinutes(time, 0)
                time = setSeconds(time, 0)

                addToSchedule({
                    time: time.getTime(),
                    run: async () => {
                        const discordUser = await bot.users.fetch((await user).discordID)
                        const dmChannel = await discordUser.createDM()
                        const tomorrowLessons = await getTomorrowsLessons(await user)
                        if (tomorrowLessons) await dmChannel.send({embeds: []})
                    }
                })
            }
        }

        last = now
        await sleep(5 * 60 * 1000) // Run every 5 mins
    }
})

bot.on("messageCreate", msg => commands(bot, msg))

bot.login(TOKEN).then(() => {
    console.log("Bot is online")
})