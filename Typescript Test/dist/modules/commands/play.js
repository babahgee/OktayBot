"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execute = void 0;
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const discord_player_1 = require("discord-player");
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
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
        player.once("queueEnd", function (queue) {
            message.channel.send("Doet");
            const newConnection = (0, voice_1.joinVoiceChannel)({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: true // Self deafen
            });
            const soundEffects = fs_1.default.readdirSync(path_1.default.join(__dirname, "../../", "audio"), { encoding: "utf-8" });
            const stream = (0, fs_1.createReadStream)(path_1.default.join(__dirname, "../../", "audio", soundEffects[Math.floor(Math.random() * soundEffects.length)]));
            const resource = (0, voice_1.createAudioResource)(stream, {
                inlineVolume: true,
            });
            const newPlayer = (0, voice_1.createAudioPlayer)();
            newConnection.subscribe(newPlayer);
            newPlayer.play(resource);
            newPlayer.on("stateChange", function (state) {
                if (state.status === "idle") {
                    newConnection.disconnect();
                    newConnection.destroy();
                    newPlayer.removeAllListeners();
                }
            });
        });
    });
}
exports.Execute = Execute;
