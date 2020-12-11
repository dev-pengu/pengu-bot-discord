module.exports = {
    commands: 'status',
    expectedArgs: '<string>',
    permissionError: 'You need admin permissions to run this command',
    minArgs: 1,
    callback: (message, arguments, text, client) => {
        client.user.setPresence({
            activity: {
                name: text,
                type: 0,
            },
        })
    },
    permissions: 'ADMINISTRATOR',
    requiredRoles: ['Admin'],
    description: 'Sets my status'
}