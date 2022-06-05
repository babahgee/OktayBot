"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execute = exports.GetHelp = void 0;
const discord_player_1 = require("discord-player");
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
function GetHelp() {
    const dict = {
        command: "play",
        description: "Met deze opdracht kan jij een of meerdere nummers afspelen in een voice kanaal waar jij in zit.",
        keyword: "naam_van_nummer"
    };
    return dict;
}
exports.GetHelp = GetHelp;
/**
 * Executes the play function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        // Parse the provided track string.
        let trackName = commandArguments[0];
        // If no name has been given, return an error.
        if (trackName === "")
            return message.channel.send("Er is geen naam of URL van het gewenste nummer ingevoerd.");
        // Searching on any platform for results of the given track,
        const res = yield player.search(trackName, {
            searchEngine: discord_player_1.QueryType.AUTO,
            requestedBy: message.author
        });
        // If no results has been found, return an error.
        if (!res || !res.tracks.length)
            return message.channel.send("Er zijn geen resultaten gevonden voor " + trackName);
        // console.log(res);
        // If the guild property from the message object does not exist, return an error.
        if (message.guild === null)
            return message.channel.send("Kan spraakkanaal niet joinen omdat er een error is opgetreden. ``MESSAGE.GUILD has been defined as null``");
        // Create a queue
        const queue = yield player.createQueue(message.guild, {
            metadata: message.channel
        });
        // Try to join the voice channel.
        try {
            if (!queue.connection) {
                if (message.member !== null && message.member.voice !== null && message.member.voice.channel !== null) {
                    yield queue.connect(message.member.voice.channel);
                }
            }
        }
        catch (e) {
            // Delete queue if any error occured.
            yield player.deleteQueue(message.guild.id);
            // Send error message.
            message.channel.send("Kan spraakkanaal niet joinen vanwege een error. Waarschijnlijk ben jij retarded ofzo idk vraag Oktay anders.");
            // Stop executing the rest of the code.
            return;
        }
        yield message.channel.send({ content: `Opgevraagde ${res.playlist ? 'playlist' : 'nummer'} word geladen...` });
        // If the member property does not exist in the mesasge object, return an error.
        if (message.member === null)
            return;
        // Define the channel.
        const channel = message.member.voice.channel;
        // If channel does not exist.
        if (channel === null)
            return;
        // Create a connection
        const connection = (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true // Self deafen
        });
        // If the search results is a playlist, add the entire playlist to the queue or else add the first track only.
        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);
        // If the queue is not playing, try to play the queue.
        if (!queue.playing) {
            // Play the queue.
            yield queue.play();
            // Create an embed message to visualise the current playing song.
            const embedMessage = new discord_js_1.MessageEmbed();
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
    });
}
exports.Execute = Execute;
