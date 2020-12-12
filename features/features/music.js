const queue = new Map();
const ytdl = require('ytdl-core');
require('ffmpeg');
require('fluent-ffmpeg');
const fs = require('fs');

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

module.exports.execute =  async (message, url) => {
    const serverQueue = queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        message.reply('You need to be in a voice channel to play music');
        return;
    }

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        message.reply('I need permissions to join and speak in your voice channel');
    }

    const songInfo = await ytdl.getInfo(url);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    if (!serverQueue) {

    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        message.reply(`${song.title} has been added to the queue!`);
        return;
    }

    const queueContract = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
    };

    queue.set(message.guild.id, queueContract);
    queueContract.songs.push(song);

    try {
        var connection = await voiceChannel.join();
        queueContract.connection = connection;
        play(message.guild, queueContract.songs[0]);
    } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
    }
}

module.exports.skip = (message, args) => {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel) {
        return message.channel.send('You have to be in a voice channel to stop the music!');
    }
    if (!serverQueue) {
        return message.channel.send('There is no song playing to skip');
    }
    serverQueue.connection.dispatcher.end();
}

module.exports.stop = (message, args) => {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel) {
        return message.channel.send('You have to be in a voice channel to stop the music!');
    }
    serverQueue.songs= [];
    serverQueue.connection.dispatcher.end();
}