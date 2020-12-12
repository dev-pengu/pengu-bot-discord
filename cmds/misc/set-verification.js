const Commando = require('discord.js-commando');
const mongo = require('@util/mongo');
const verificationChannelsSchema = require('@schemas/verification-channels-schema')
const { fetch } = require('@features/verification-channels')

module.exports = class SetVerificationCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'setverification',
            group: 'misc',
            memberName: 'setverification',
            description: 'Sets the verification channel for the discord',
            userPermissions: ['ADMINISTRATOR'],
            argsType: 'multiple'
        });
    }

    async run(message, args) {
        const milliseconds = 3000;

        if (args.length !== 2) {
            message.reply('You must provide an emoji to react with and a role ID')
                .then(message => {
                    message.delete({ timeout: milliseconds })
                });
            message.delete();
            return;
        }

        const { guild, channel } = message;
        let emoji = args[0];
        const roleId = args[1];

        if (emoji.includes(':')) {
            const split = args.split(':');
            const emojiName = split[1];
            emoji = guild.emojis.cache.find((emoji) => emoji.name === emojiName);
        }

        const role = guild.roles.cache.get(roleId);

        if (!role) {
            message.reply('That role does not exist')
                .then(message => {
                    message.delete({ timeout: milliseconds })
                });
            message.delete();
            return;
        }

        message.delete().then(() => {
            channel.messages.fetch({ limit: 1 }).then(async results => {
                const firstMessage = results.first();
                if (!firstMessage) {
                    channel.send('There is no message to react to').then((message) => {
                        message.delete({ timeout: milliseconds });
                    });

                    return;
                }

                firstMessage.react(emoji);

                await mongo().then(async (mongoose) => {
                    try {
                        await verificationChannelsSchema.findOneAndUpdate({
                            _id: guild.id
                        }, {
                            _id: guild.id,
                            channelId: channel.id,
                            roleId
                        }, {
                            upsert: true,
                            useFindAndModify: false
                        });
                    } finally {
                        mongoose.connection.close();
                    }
                });

                await fetch();
            });
        });
    }
}