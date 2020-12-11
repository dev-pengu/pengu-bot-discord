module.exports = {
    commands: 'createtextchannel',
    expectedArgs: '<name> [<categoryId>]',
    permissionError: 'You need admin permissions to run this command.',
    minArgs: 1,
    maxArgs: 2,
    callback: (message, arguments, text) => {
        let channelName = arguments[0]
        let category = ''
        if (arguments.length > 1) {
            category = arguments[1]
        }

        message.guild.channels
            .create(channelName, {
                type: 'text'
            })
            .then((channel) => {
                if (category) {
                    channel.setParent(category)
                }
            })
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: ['Admin'],
    description: 'Creates a voice channel'
}