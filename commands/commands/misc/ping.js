module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 0,
    description: 'Returns the bot and api latency',
    callback: (message, arguments, text, client) => {
        message.reply('Calculating ping...').then(resultMessage => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp
            resultMessage.edit(`Bot latency: ${ping}, API latency: ${client.ws.ping}`)
        })
    },
}