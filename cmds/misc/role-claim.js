const Commando = require('discord.js-commando');
const { MessageEmbed } = require('discord.js')
const mongo = require('@util/mongo');
const verificationChannelsSchema = require('@schemas/verification-channels-schema')
const { fetch } = require('@features/verification-channels')

// {_id: guildId, channelId: channelId, messageId: messageId, react-roles: [{emoji: emoji, roleId: roleId}] }

module.exports = class RoleClaimCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'reactionrole',
            group: 'misc',
            memberName: 'reactionrole',
            description: 'Sets up a reaction role message for the server',
            userPermissions: ['ADMINISTRATOR']
        });
    }

    async run(message) {
        const { guild } = message;
        let data = {"_id": guild.id};
        const milliseconds = 300000;
        let filter = m => m.author.id === message.author.id;
        let embed = new MessageEmbed()
            .setTitle('Reaction Role - Step 1')
            .setDescription(`First tag the channel where you would like the 
            Reaction Role to go.\nYou need to reply within 5 minutes of this 
            message or the process will be canceled. This time limit is active 
            for all following steps.\n\nYou can also cancel manually by replying 
            with **cancel** at anytime`)
        message.channel.send(embed).then(message => {
            const botMessage = message;

            message.channel.awaitMessages(filter, {
                max: 1,
                time: milliseconds,
                errors: ['time']
            })
            .then(message => {
                message = message.first();
                const { channel, content } = message;
                message.delete();
                if (content === 'cancel') {
                    return;
                }
                data["channelId"] = content.replace(/<|#|>/g, '');
                embed.setTitle('Reaction Role - Step 2')
                    .setDescription(`Next please reply with the message ID of of 
                    the message.\n\nIf you do not know how to find this information,
                    visit the link attached by clicking the title.`)
                    .setURL('https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-')
                    botMessage.edit(embed).then(message => {
                    channel.awaitMessages(filter, {
                        max: 1,
                        time: milliseconds,
                        errors: ['time']
                    })
                    .then(message => {
                        message = message.first();
                        const { channel, content } = message;
                        message.delete();
                        data["messageId"] = content;

                        embed.setTitle('Reaction Role - Step 3')
                            .setDescription(`Now **REACT** with the reaction you want
                            to use on **THIS MESSAGE**`)
                            .setURL(null)
                        botMessage.edit(embed).then(message => {
                            this.client.on('messageReactionAdd', async (reaction, user) => {
                                if (reaction.message.id === message.id) {
                                    const emoji = reaction._emoji.name;
                                    message.reactions.removeAll().then(message => {
                                        embed.setTitle('Reaction Role - Step 4')
                                            .setDescription(`Almost done. Please tag the 
                                            role you want to use.`)
                                        botMessage.edit(embed).then(message => {
                                            channel.awaitMessages(filter, {
                                                max: 1,
                                                time: milliseconds,
                                                errors: ['time']
                                            })
                                            .then(message => {
                                                message = message.first();
                                                let targetMention = message.mentions.roles.first();
                                                let targetname = targetMention
                                                    ? targetMention.name
                                                    : message.content.trim();
                                                if (!targetMention) {
                                                    //targetMention = message.guild.roles.cache
                                                    let role = message.guild.roles.cache.find((role) => role.name === targetname);
                                                }

                                                const targetId = targetMention ? targetMention.id : role.id;


                                            });
                                        });
                                    });

                                }
                                else {
                                    return;
                                }
                            });
                        });
                    });
                });
            });
        });
        
    }
}