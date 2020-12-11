const Commando = require('discord.js-commando');

module.exports = class EndGiveawayCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'endgiveaway',
            group: 'giveaway',
            memberName: 'endgiveaway',
            description: 'Ends a giveaway',
            userPermissions: [
                'ADMINISTRATOR'
            ]
        })
    }

    async run(message, args) {
        message.delete().then(() => {
            const { guild, channel } = message;

            channel.messages.fetch({ limit: 1 }).then(async messages => {
                message = messages.first();

                if (!message) {
                    channel.send('There are no giveaway messages');
                    return;
                }
                
                const { users } = await message.reactions.cache.first().fetch();
                const reactionUsers = await users.fetch();

                const possibleWinners = reactionUsers.array().filter((user) => !user.bot);

                const winner = possibleWinners[Math.floor(Math.random() * possibleWinners.length)];
                console.log(winner);
            });
        });
    }
}