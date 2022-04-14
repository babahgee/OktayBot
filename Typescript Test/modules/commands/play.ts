import fs, { createReadStream, ReadStream, stat } from "fs";
import path from "path";

import { Player, QueryType, Queue } from "discord-player";
import { AudioPlayer, AudioPlayerState, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";

import { Client, Message, MessageEmbed, VoiceChannel, VoiceState } from "discord.js";
import { TextEncodings, Prefix, HelpDictionary } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "play", 
        description: "Met deze opdracht kan jij een of meerdere nummers afspelen in een voice kanaal waar jij in zit.",
        keyword: "naam_van_nummer"
    };

    return dict;
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
        metadata: message.channel
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
        adapterCreator: channel.guild.voiceAdapterCreator, // Use voice adapter.
        selfDeaf: true // Self deafen
    });

    // If the search results is a playlist, add the entire playlist to the queue or else add the first track only.
    res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

    // If the queue is not playing, try to play the queue.
    if (!queue.playing) {

        // Play the queue.
        await queue.play();

        // Create an embed message to visualise the current playing song.
        const embedMessage: MessageEmbed = new MessageEmbed();

        embedMessage.setColor("#000000");
        embedMessage.setTitle(res.tracks[0].title);
        embedMessage.setDescription(res.tracks[0].author);
        embedMessage.setThumbnail(res.tracks[0].thumbnail);
        embedMessage.setURL(res.tracks[0].url);
        embedMessage.setFooter({
            text: `Opgevraagd door ${res.tracks[0].requestedBy.username}`
        });

        // Send the embed message.
        message.channel.send({ embeds: [embedMessage] });
    }

    player.once("queueEnd", function (queue: Queue) {

        message.channel.send("Doet");


        //const newConnection: VoiceConnection = joinVoiceChannel({
        //    channelId: channel.id, // Join the client in the channel id.
        //    guildId: channel.guild.id, // Pass the channel guild id.
        //    adapterCreator: channel.guild.voiceAdapterCreator, // Use voice adapter.
        //    selfDeaf: true // Self deafen
        //});

        //const soundEffects: Array<string> = fs.readdirSync(path.join(__dirname, "../../", "audio"), {encoding: "utf-8"});

        //const stream: ReadStream = createReadStream(path.join(__dirname, "../../", "audio", soundEffects[Math.floor(Math.random() * soundEffects.length)]));

        //const resource = createAudioResource(stream, {
        //    inlineVolume: true,
        //});

        //const newPlayer: AudioPlayer = createAudioPlayer();

        //newConnection.subscribe(newPlayer);

        //newPlayer.play(resource);

        //newPlayer.on("stateChange", function (state) {

        //    if (state.status === "idle") {

        //        newConnection.disconnect();
        //        newConnection.destroy();

        //        newPlayer.removeAllListeners();
        //    }

        //});

    });

}