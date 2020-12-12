const Commando = require('discord.js-commando');
const musicPlayer = require('@features/music')

module.exports = class SkipAudioCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'skipsong',
            group: 'music',
            memberName: 'skipsong',
            description: 'Skips music player to the next song',
            argsType: 'multiple'
        });
    }

    async run(message, args) {
        musicPlayer.skip(message, args);
    }
}