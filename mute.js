const redis = require('./redis')
const command = require('./command')
const { redisKeyPrefix } = require('./config.json')

module.exports = client => {
    const getRole = (guild) => {
        return guild.roles.cache.find(role => role.name === 'Muted')
    }

    const giveRole = member => {
        const { guild } = member
        const role = getRole(guild)
        if (role) {
            member.roles.add(role)
            console.log('Muted ' + member.id)
        }
    }

    const removeRole = member => {
        const { guild } = member
        const role = getRole(guild)
        if (role) {
            member.roles.remove(role)
            console.log('Unmuted ' + member.id)
        }
    }

    redis.expire(message => {
        if (message.startsWith(redisKeyPrefix)) {
            const split = message.split('-')
            // [muted, userId, guildId]
            const guild = client.guilds.cache.get(split[2])
            const member = guild.members.cache.get(split[1])
            removeRole(member)
        }
    })


    const onJoin = async member => {
        const { id, guild } = member

        const redisClient = await redis();
        try {
            redisClient.get(`${redisKeyPrefix}${id}-${guild.id}`, (err, result) => {
                if (err) {
                    console.error('Redis GET error: ', err)
                } else if (result) {
                    giveRole(member)
                }
            })
        } finally {
            redisClient.quit()

        }
    }
    client.on('guildMemberAdd', member => {
        onJoin(member)
    })

    command(client, 'unmute', async message => {
        const { member, channel, mentions, guild } = message
        if (!member.hasPermission('ADMINISTRATOR')) {
            channel.send('You do not have permission to run this command.')
            return
        }

        const target = mentions.users.first()
        if (!target) {
            channel.send('Please tag a user to unmute.')
            return
        }
        const { id } = target
        const targetMember = guild.members.cache.get(id)
        const redisClient = await redis()
        try {
            const redisKey = `${redisKeyPrefix}${id}-${guild.id}`
            redisClient.del(redisKey, (err, reply) => {
                if (err) {
                    console.error('Redis del error: ', err)
                } else if (reply) {
                    removeRole(targetMember)
                }
            })
        } finally {
            redisClient.quit()
        }
    })


    command(client, 'mute', async message => {

        const syntax = '~mute <@> <duration as a number> <m, h, d, or life>'

        const { member, channel, content, mentions, guild } = message

        if (!member.hasPermission('ADMINISTRATOR')) {
            channel.send('You do not have permission to run this command.')
            return
        }

        const split = content.trim().split(' ')
        //!mute @ 10 h = ['!mute', '@', '10', 'h']
        if (split.length !== 4) {
            channel.send('Please use the correct command syntax: ' + syntax)
            return
        }

        const duration = split[2]
        const durationType = split[3]

        if (isNaN(duration)) {
            channel.send('Please provide a number for the duration. ' + syntax)
            return
        }

        const durations = {
            m: 60,
            h: 3600,
            d: 86400,
            life: -1
        }

        if (!durations[durationType]) {
            channel.send('Please provide a valid duration type. ' + syntax)
            return
        }

        const seconds = duration * durations[durationType]
        const target = mentions.users.first()
        if (!target) {
            channel.send('Please tag a user to mute.')
            return
        }
        const { id } = target
        const targetMember = guild.members.cache.get(id)
        giveRole(targetMember)
        const redisClient = await redis()
        try {
            const redisKey = `${redisKeyPrefix}${id}-${guild.id}`
            if (seconds < 0) {
                redisClient.set(redisKey, 'true')
            } else {
                redisClient.set(redisKey, 'true', 'EX', seconds)
            }
        } finally {
            redisClient.quit()
        }
    })
}