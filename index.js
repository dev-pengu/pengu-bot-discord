require('module-alias/register')

//const Discord = require('discord.js');
//const client = new Discord.Client();
const { MongoClient } = require('mongodb')
const MongoDBProvider = require('commando-provider-mongo')
const path = require('path')
const Commando = require('discord.js-commando')
const config = require('@root/config.json');
const loadCommands = require('@root/commands/load-commands')
const commandBase = require('@root/commands/command-base')
const loadFeatures = require('@root/features/load-features')

const client = new Commando.CommandoClient({
    owner: config.ownerId,
    commandPrefix: config.prefix
})

client.setProvider(
    MongoClient.connect(config.mongoPath, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => new MongoDBProvider(client, config.dbName))
    .catch((err) => {
        console.error(err)
    })
)

client.on('ready', async () => {
    console.log('The client is ready!')

    client.registry
        .registerGroups([
            ['misc', 'Misc Commands'],
            ['moderation', 'Moderation Commands'],
            ['economy', 'Commands for Economy System'],
            ['giveaway', 'Commands for Giveaways'],
            ['music', 'Music System Commands'],
            ['games', 'Game Related Commands']
        ])
        .registerDefaults()
        .registerCommandsIn(path.join(__dirname, 'cmds'))

    //commandBase.loadPrefixes(client)
    //loadCommands(client)
    //loadFeatures(client)
});

client.login(config.token);