module.exports = {
    commands: ['clearchannel', 'cc'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        message.channel.messages.fetch().then(results => {
            message.channel.bulkDelete(results)
        })
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles:['Moderators'],
    description: "Clears the channels messages",
    permissionError: 'You need admin permissions to run this command'
}