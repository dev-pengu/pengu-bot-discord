const Commando = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const CATEGORY = 'Among Us';


module.exports = class AmongUsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'au',
            group: 'games',
            memberName: 'au',
            description: 'Makes it easier to play Among Us with friends',
            argsType: 'multiple'
        });

        client.on('voiceStateUpdate', oldState => {
            const { channel } = oldState;
            if (channel && channel.name.startsWith(CATEGORY) && channel.members.size === 0) {
                console.log(`Deleting channel ${channel}`);
                channel.delete();
            }
        })
    }

    async run(message, args) {
        const [region, code] = args;
        if (!region || !code) {
            message.reply('Arguments missing. please specify the args <Region> <Lobby Code>');
        }

        const { channel, guild, member } = message;
        let categoryId = guild.channels.cache.find(category => category.name.toLowerCase() === CATEGORY.toLowerCase());
        if (!categoryId) {
            await guild.channels
            .create(CATEGORY, {
                type: 'category'
            })
            .then((channel) => {
                categoryId = channel.id;
            })
        }

        const channelName = `${CATEGORY} - ${code}`;
        const newChannel = await guild.channels.create(channelName, {
            type: 'voice',
            userLimit: 10,
            parent: categoryId
        })
        console.log(newChannel);

        const embed = new MessageEmbed()
            .setAuthor(
                member.nickname || member.displayName,
                member.user.displayAvatarURL()
            )
            .setDescription(
                `${member} created a new Among Us game. Join channel ${channelName}`
            )
            .addField('Region', region)
            .addField('Game Code', code)
            message.delete();

            channel.send(embed);
    }
}