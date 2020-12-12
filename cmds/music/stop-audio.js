const Commando = require('discord.js-commando');
const musicPlayer = require('@features/music')

module.exports = class StopAudioCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'stopmusic',
            group: 'music',
            memberName: 'stopmusic',
            description: 'Stops playing the music',
            argsType: 'multiple'
        });
    }

    async run(message, args) {
        musicPlayer.stop(message, args);
    }
}