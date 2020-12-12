const mongo = require('@util/mongo');
const verificationChannelsSchema = require('@schemas/verification-channels-schema')

// { 'channelId': 'emoji': { 'roleId'} }
let verificationCache = {}

const fetchData = async (client) => {
    await mongo().then(async mongoose => {
        try {
            const results = await verificationChannelsSchema.find({});

            for (const result of results) {
                const guild = client.guilds.cache.get(result._id);
                if (guild) {
                    const channel = guild.channels.cache.get(result.channelId);
                    if (channel) {
                        verificationCache[result.channelId] = result.roleId;
                        channel.messages.fetch()
                    }
                }
            }
        } finally {
            mongoose.connection.close();
        }
    });
}

const populateCache = async (client) => {
    verificationCache = {};

    await fetchData(client);

    setTimeout(populateCache, 60000);
}

module.exports = (client) => {
    populateCache(client);

    client.on('messageReactionAdd', (reaction, user) => {
        console.log(reaction);
        const channelId = reaction.message.channel.id;
        const roleId = verificationCache[channelId];

        if (roleId) {
            const { guild } = reaction.message;
            const member = guild.members.cache.get(user.id);
            member.roles.add(roleId);
        }
    });
}

module.exports.fetch = fetchData;