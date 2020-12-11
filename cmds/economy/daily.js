const Commando = require('discord.js-commando');
const mongo = require('@util/mongo');
const dailyRewardsSchema = require('@schemas/daily-rewards-schema')

// Array of member Ids who have claimed their daily rewards in the last 24 hours
// Resets every 10 minutes
let claimedCache = [];

const clearCache = () => {
    claimedCache = [];
    setTimeout(clearCache, 60000);
}

clearCache();

module.exports = class DailyCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'daily',
            group: 'economy',
            memberName: 'daily',
            description: 'Claims daily rewards'
        })
    }

    async run(message) {
        const { guild, member } = message;
        if (!guild) {
            return;
        }
        const { id } = member;

        const obj = {
            guildId: guild.id,
            userId: id
        };

        if (claimedCache.some(person => (person.guildId === obj.guildId && person.userId === obj.userId))) {
            message.reply('You have already claimed your daily rewards');
            return;
        }

        console.log('Fetching from mongo');

        await mongo().then(async mongoose => {
            try {
                const result = await dailyRewardsSchema.findOne(obj);
                if (result) {
                     const then = new Date(result.updatedAt).getTime();
                     const now = new Date().getTime();
                     const diffTime = Math.abs(now - then);
                     const diffDays = Math.round(diffTime / (86400000));

                     console.log(diffTime);

                     if (diffDays <= 1) {
                         claimedCache.push(obj);
                         message.reply('You have already claimed your daily rewards');
                         return;
                     }
                }
                await dailyRewardsSchema.findOneAndUpdate(obj, obj, { upsert: true, useFindAndModify: false });
                claimedCache.push(obj);

                //TODO: Give the rewards

                message.reply('You have claimed your daily rewards!')
            } finally {
                mongoose.connection.close();
            }
        })
    }
}