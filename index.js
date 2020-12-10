const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const command = require('./command')
//const firstMessage = require('./first-message')
//const privateMessage = require('./private-message')
//const roleClaim = require('./role-claim')
//const poll = require('./poll')
const welcome = require('./welcome')
//const sendMessage = require('./send-message')
const mongo = require('./mongo')
//const messageCount = require('./message-counter')
const mute = require('./mute')

// C:\Program Files\MongoDB\Server\4.4\bin mongod.exe to run mongodb
// https://andyfelong.com/2019/11/mongodb-4-2-x-64-bit-on-raspberry-pi-4/
// https://thehumblecode.com/blog/how-to-create-a-discord-bot-using-discord-js-and-run-it-on-raspberry-pi-by-doing-a-small-project-which-will-post-random-jokes-to-the-discordapp-channel-for-absolute-beginners/
client.on('ready', async () => {
    console.log('The client is ready!')
    //roleClaim(client)
    //poll(client)
    welcome(client)
    //messageCount(client)
    mute(client)

    await mongo().then(mongoose => {
        try {
            console.log('Connected to mongo!')
        } catch(e) {

        } finally {
            mongoose.connection.close()
        }
    })
/*
    command(client, ['ping', 'test'], (message) => {
        message.channel.send('Pong!')
    })

    command(client, 'servers', message => {
        client.guilds.cache.forEach((guild) => {
            message.channel.send(`${guild.name} has a total of ${guild.memberCount} members`);
        })
    })
*/
    command(client, ['cc', 'clearchannel'], message => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then(results => {
                message.channel.bulkDelete(results)
            })
        }
    })
/*
    command(client, 'status', message => {
        const content = message.content.replace('!status ', '')
        client.user.setPresence({
            activity: {
                name: content,
                type: 0,
            },
        })
    })

    command(client, 'createtextchannel', (message) => {
        const name = message.content.replace('!createtextchannel ', '')

        message.guild.channels
            .create(name, {
                type: 'text'
            })
            .then((channel) => {
                const categoryID = '711337538022932492'
                channel.setParent(categoryID)
            })
    })

    command(client, 'createvoicechannel', (message) => {
        const name = message.content.replace('!createvoicechannel ', '')

        message.guild.channels
            .create(name, {
                type: 'voice'
            })
            .then((channel) => {
                const categoryID = '711337538022932492'
                channel.setParent(categoryID)
                channel.setUserLimit(10)
            })
    })

    command(client, 'embed', (message) => {
        const logo = ''
        const embed = new Discord.MessageEmbed()
            .setTitle('Example text embed')
            .setURL('https://www.amazon.com/')
            .setAuthor(message.author.username)
            .setImage(logo)
            .setThumbnail(logo)
            .setFooter('This is a footer', logo)
            .setColor('#00AAFF')
            .addFields({
                name: 'Field1',
                value: 'Hello World',
                inline: true
            })

        message.channel.send(embed)
    })

    command(client, 'serverinfo', (message) => {
        const { guild } = message
        const { name, region, memberCount, owner } = guild
        const icon = guild.iconURL()

        const embed = new Discord.MessageEmbed()
            .setTitle(`Server info for "${name}"`)
            .setThumbnail(icon)
            .addFields({
                name: 'Region',
                value: region
            },
            {
                name: 'Members',
                value: memberCount
            },
            {
                name: 'Owner',
                value: owner.user.tag
            })

        message.channel.send(embed)
    })

    command(client, 'help', (message) => {
        message.channel.send(`
        These are my supported commands:

        **!help** - Displays the help menu
        **!serverinfo** - Displays server info
        **!embed <channel>** - Sends an embeded message to channel
        `)
    })

    command(client, 'ban', (message) => {
        const { member, mentions } = message
        const tag = `<@${member.id}>`
        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.ban()
                message.channel.send(`${tag} That user has been banned.`)
            } else {
                message.channel.send(`${tag} Please specify someone to ban.`)
            }
        } else {
            message.channel.send(`${tag} You do not have permission to use this command.`)
        }
    })

    command(client, 'kick', (message) => {
        const { member, mentions } = message
        const tag = `<@${member.id}>`
        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('KICK_MEMBERS')) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.kick()
                message.channel.send(`${tag} That user has been kicked.`)
            } else {
                message.channel.send(`${tag} Please specify someone to kick.`)
            }
        } else {
            message.channel.send(`${tag} You do not have permission to use this command.`)
        }
    })

/*
    const guild = client.guilds.cache.get('711337538022932490')
    const channel = guild.channels.cache.get('786471597279936534')
    sendMessage(channel, 'hello world', -1)
/*
    firstMessage(client, '786471597279936534', 'hello world!!!', ['🔥','🌊'])
/*
    privateMessage(client,'ping','Pong!')

    /*client.users.fetch('616755097560547359').then(user => {
        user.send('Hello World!')
    })*/
});

client.login(config.token);