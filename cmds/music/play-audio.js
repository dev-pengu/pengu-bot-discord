const Commando = require('discord.js-commando');
const musicPlayer = require('@features/music')

module.exports = class PlayAudioCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'playmusic',
            group: 'music',
            memberName: 'playmusic',
            description: 'Plays some music',
            argsType: 'multiple'
        });
    }

    async run(message, args) {
        if (args.length < 1) {
            message.reply('You need to specify a youtube link to play');
            return;
        }
        for (const url of args) {
            await musicPlayer.execute(message, url);
        }
        //musicPlayer.execute(message, args);
    }
}