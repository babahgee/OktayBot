import fs from "fs";
import path from "path";

import { Player, QueryType, Queue, Track } from "discord-player";
import { AudioPlayer, createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, PlayerSubscription, StreamType, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";

import { Client, Message, MessageEmbed, VoiceState } from "discord.js";
import { TextEncodings, Prefix } from "../utils";

const { getVoiceStream } = require("discord-tts");


/**
 * Executes the skip function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    const ttsContent: string = commandArguments[0];

    if (ttsContent === "") return message.channel.send("Kan tekst-naar-spraak opdracht niet uitvoeren omdat er geen argumenten zijn ingevoerd.");

    if (ttsContent.length > 200) return message.channel.send("Jaaaaaaaaaaa bruh moment, ik kan blijkbaar niet meer dan 200 karakters oplezen. Bruh Rohan is tering lui om dat te fixen.");

    const stream = getVoiceStream(ttsContent);

    const audioPlayer: AudioPlayer = new AudioPlayer();

    const audioSource = createAudioResource(stream, {
        inlineVolume: true
    });

    if (message.member === null) return;

    const channel = message.member.voice.channel;

    if (channel === null) return;

    const voiceConnection: VoiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true
    });


    const subscription = voiceConnection.subscribe(audioPlayer);

    if (subscription === undefined) return;



    audioPlayer.play(audioSource);

    audioPlayer.on("stateChange", function (state) {

        if (state.status === "idle") {

            subscription.unsubscribe();

            subscription.connection.destroy();

            voiceConnection.disconnect();
            voiceConnection.destroy();
            
        }

    });
}