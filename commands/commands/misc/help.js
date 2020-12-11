const loadCommands = require('@root/commands/load-commands')
const { prefix: globalPrefix } = require('@root/config.json')
const commandBase = require('@root/commands/command-base')

module.exports = {
    commands: ['help', 'h'],
    description: "Describes all of this bot's commands",
    callback: (message, arguments, text) => {
        let reply = 'I am Pengu Bot, here are my supported commands:\n\n'

        const commands = loadCommands()
        const { guild } = message
        const prefix = commandBase.getPrefix(guild.id) || globalPrefix

        for (const command of commands) {
            // Check for permissions
            let permissions = command.permissions

            if(permissions) {
                let hasPermission = true
                if (typeof permissions === 'string') {
                    permissions = [permissions]
                }

                for (const permission of permissions) {
                    if(!message.member.hasPermission(permission)) {
                        hasPermission = false
                        break
                    }
                }

                if (!hasPermission) {
                    continue
                }
            }

            const mainCommand = typeof command.commands === 'string' ? command.commands : command.commands[0]
            const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
            const { description } = command

            reply += `**${prefix}${mainCommand}${args}** = ${description}\n`
        }

        message.channel.send(reply)
    }
}