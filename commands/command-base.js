const { connect } = require('mongoose')
const { prefix: globalPrefix } = require('@root/config.json')
const mongo = require('@util/mongo')
const commandPrefixSchema = require('@schemas/command-prefix-schema')
const guildPrefixes = {}

const validatePermissions = (permissions) => {
    const validPermissions = [
        'ADMINISTRATOR',
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS'
    ]

    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unknown permission node "${permission}`)
        }
    }
}

module.exports = (client, commandOptions) => {
    if(Object.entries(commandOptions).length === 0) {
        return
    }
    let {
        commands,
        expectedArgs = '',
        permissionError = 'You do not have permission to run this command.',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback
    } = commandOptions

    // Ensure the command and aliases are in an array
    if (typeof commands === 'string') {
        commands = [commands]
    }

    console.log(`Registering command "${commands[0]}"`)

    // Ensure the permissions are in an array and are all valid
    if (permissions.length) {
        if (typeof permissions === 'string') {
            permissions = [permissions]
        }

        validatePermissions(permissions)
    }

    // Listen for messages
    client.on('message', message => {
        const { member, content, guild } = message

        const prefix = guildPrefixes[guild.id] || globalPrefix

        for (const alias of commands) {
            const command = `${prefix}${alias.toLowerCase()}`
            if (content.toLowerCase().startsWith(`${command }`) || content.toLowerCase() === command) {
                // A command has been ran
                // Ensure the user has the required permissions
                for (const permission of permissions) {
                    if (!member.hasPermission(permission)) {
                        message.reply(permissionError)
                        return
                    }
                }

                // Ensure the user has the required roles
                for (const requiredRole of requiredRoles) {
                    const role = guild.roles.cache.find(role => 
                        role.name === requiredRole)

                    if (!role || !member.roles.cache.has(role.id)) {
                        message.reply(`You must have the "${requiredRole}" role to use this command`)
                        return
                    }
                }

                const arguments = content.split(/[ ]+/)
                //remove command
                arguments.shift()

                // Ensure we have the correct number of arguments
                if (arguments.length < minArgs || (
                    maxArgs !== null && arguments.length > maxArgs
                )) {
                    message.reply(`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`)
                    return
                }

                callback(message, arguments, arguments.join(' '), client)

                return
            }
        }
    })
}

module.exports.loadPrefixes = async (client) => {
    await mongo().then(async mongoose => {
        try {
            for (const guild of client.guilds.cache) {
                const result = await commandPrefixSchema.findOne({ _id: guild[1].id })
                guildPrefixes[guild[1].id] = result.prefix
            }
        } finally {
            mongoose.connection.close()
        }
    })
}

module.exports.savePrefix = (guildId, prefix) => {
    guildPrefixes[guildId] = prefix
}

module.exports.getPrefix = (guildId) => {
    return guildPrefixes[guildId]
}