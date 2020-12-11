/*command(client, 'ban', (message) => {
    const { member, mentions } = message
    const tag = `<@${member.id}>`
    if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')) {
        const target = mentions.users.first()
        if (target) {
            const targetMember = message.guild.members.cache.get(target.id)
            targetMember.ban()
            message.channel.send(`${tag} That user has been banned.`)
        } else {
            message.channel.send(`${tag} Please specify someone to ban.`)
        }
    } else {
        message.channel.send(`${tag} You do not have permission to use this command.`)
    }
})*/