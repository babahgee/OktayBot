import fs, { createReadStream, ReadStream, stat } from "fs";
import path from "path";

import { Player, QueryType, Queue, Track } from "discord-player";
import { AudioPlayer, AudioPlayerState, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";

import { Client, Message, MessageEmbed, MessageManager, VoiceChannel, VoiceState } from "discord.js";
import { TextEncodings, Prefix, HelpDictionary } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "play", 
        description: "Met deze opdracht kan jij een of meerdere nummers afspelen in een voice kanaal waar jij in zit.",
        keyword: "naam_van_nummer"
    };

    return dict;
}

function createAddedToQueueEmbedMessage(track: Track): MessageEmbed {

    const embed: MessageEmbed = new MessageEmbed({
        title: `${track.title} toegevoegd`,
        description: `Het nummer _'${track.title}'_ van _'${track.author}'_ is toegevoegd aan de wachtrij. Voer \`\`${Prefix} queue\`\` uit om de wachtrij te bekijken.`,
        author: {
            name: track.requestedBy.username,
            iconURL: track.requestedBy.displayAvatarURL()
        },
        thumbnail: {
            url: track.thumbnail
        },
        color: "RANDOM",
        fields: [
            {
                name: "Afspeeltijd",
                value: track.duration,
                inline: true
            },
            {
                name: "Wachtrij positie",
                value: track.queue.tracks.length === 0 ? "Wordt momenteel afgespeeld" : (track.queue.tracks.length).toString(),
                inline: true
            }
        ]
    });

    return embed;
}

/**
 * Executes the play function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    // Parse the provided track string.
    let trackName: string = commandArguments[0];

    // If no name has been given, return an error.
    if (trackName === "") return message.channel.send("Er is geen naam of URL van het gewenste nummer ingevoerd.");

    // Searching on any platform for results of the given track,
    const res = await player.search(trackName, {
        searchEngine: QueryType.AUTO,
        requestedBy: message.author
    });

    // If no results has been found, return an error.
    if (!res || !res.tracks.length) return message.channel.send("Er zijn geen resultaten gevonden voor " + trackName);

    // console.log(res);

    // If the guild property from the message object does not exist, return an error.
    if (message.guild === null) return message.channel.send("Kan spraakkanaal niet joinen omdat er een error is opgetreden. ``MESSAGE.GUILD has been defined as null``");

    // Create a queue
    const queue = await player.createQueue(message.guild, {
        metadata: message.channel,
        leaveOnEmpty: false,
        autoSelfDeaf: true,
        leaveOnEnd: false,
        leaveOnStop: true,
    });

    // Try to join the voice channel.
    try {

        if (!queue.connection) {

            if (message.member !== null && message.member.voice !== null && message.member.voice.channel !== null) {
                await queue.connect(message.member.voice.channel);
            }

        }

    } catch(e) { 

        // Delete queue if any error occured.
        await player.deleteQueue(message.guild.id);

        // Send error message.
        message.channel.send("Kan spraakkanaal niet joinen vanwege een error. Waarschijnlijk ben jij retarded ofzo idk vraag Oktay anders.");

        // Stop executing the rest of the code.
        return;
     
    }

    await message.channel.send({ content: `Opgevraagde ${res.playlist ? 'playlist' : 'nummer'} word geladen...` });


    // If the member property does not exist in the mesasge object, return an error.
    if (message.member === null) return;

    // Define the channel.
    const channel = message.member.voice.channel;

    // If channel does not exist.
    if (channel === null) return;

    // Create a connection
    const connection: VoiceConnection = joinVoiceChannel({
        channelId: channel.id, // Join the client in the channel id.
        guildId: channel.guild.id, // Pass the channel guild id.
        adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator, // Use voice adapter.
        selfDeaf: true // Self deafen
    });

    // If the search results is a playlist, add the entire playlist to the queue or else add the first track only.
    res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

    if (!res.playlist) message.channel.send({ embeds: [createAddedToQueueEmbedMessage(res.tracks[0] as Track)] });

    // If the queue is not playing, try to play the queue.
    if (!queue.playing) await queue.play();
}