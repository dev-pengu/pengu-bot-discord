const mongo = require('@util/mongo')
const commandPrefixSchema = require('@schemas/command-prefix-schema')
const commandBase = require('@root/commands/command-base')

module.exports = {
    commands: 'setprefix',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<This bot's new command prefix>",
    permissionError: 'You must be an admin to run this command.',
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments, text) => {
        await mongo().then(async mongoose => {
            try {
                const guildId = message.guild.id

                await commandPrefixSchema.findOneAndUpdate({
                    _id: guildId
                }, {
                    _id: guildId,
                    prefix: arguments[0]
                }, {
                    upsert: true
                })
                commandBase.savePrefix(guildId, arguments[0])
                message.reply(`The prefix for this bot is now ${arguments[0]}`)
            } finally {
                mongoose.connection.close()
            }
        })
    },
    description: "Sets my command prefix for this server"
}