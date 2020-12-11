module.exports = {
    commands: 'createvoicechannel',
    expectedArgs: '<name> [<categoryId> [<userLimit>]]',
    permissionError: 'You need admin permissions to run this command.',
    minArgs: 1,
    maxArgs: 3,
    callback: (message, arguments, text) => {
        let channelName = arguments[0]
        let category = ''
        let limit = 0
        if (arguments.length > 1) {
            category = arguments[1]
            if (arguments.length > 2) {
                limit = +arguments[2]
            }
        }

        message.guild.channels
            .create(channelName, {
                type: 'voice'
            })
            .then((channel) => {
                if (category) {
                    channel.setParent(category)
                }
                if (limit) {
                    channel.setUserLimit(limit)
                }
            })
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: ['Admin'],
    description: 'Creates a voice channel'
}