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
exports.Execute = void 0;
const voice_1 = require("@discordjs/voice");
const { getVoiceStream } = require("discord-tts");
/**
 * Executes the skip function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        const ttsContent = commandArguments[0];
        if (ttsContent === "")
            return message.channel.send("Kan tekst-naar-spraak opdracht niet uitvoeren omdat er geen argumenten zijn ingevoerd.");
        if (ttsContent.length > 200)
            return message.channel.send("Jaaaaaaaaaaa bruh moment, ik kan blijkbaar niet meer dan 200 karakters oplezen. Bruh Rohan is tering lui om dat te fixen.");
        const stream = getVoiceStream(ttsContent);
        const audioPlayer = new voice_1.AudioPlayer();
        const audioSource = (0, voice_1.createAudioResource)(stream, {
            inlineVolume: true
        });
        if (message.member === null)
            return;
        const channel = message.member.voice.channel;
        if (channel === null)
            return;
        const voiceConnection = (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true
        });
        const subscription = voiceConnection.subscribe(audioPlayer);
        if (subscription === undefined)
            return;
        audioPlayer.play(audioSource);
        audioPlayer.on("stateChange", function (state) {
            if (state.status === "idle") {
                subscription.unsubscribe();
                subscription.connection.destroy();
                voiceConnection.disconnect();
                voiceConnection.destroy();
            }
        });
    });
}
exports.Execute = Execute;
