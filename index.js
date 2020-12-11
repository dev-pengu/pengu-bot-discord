require('module-alias/register')

const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('@root/config.json');
const loadCommands = require('@root/commands/load-commands')
const commandBase = require('@root/commands/command-base')
const loadFeatures = require('@root/features/load-features')

const mongo = require('@util/mongo')


client.on('ready', async () => {
    console.log('The client is ready!')

    commandBase.loadPrefixes(client)
    loadCommands(client)
    loadFeatures(client)
});

client.login(config.token);