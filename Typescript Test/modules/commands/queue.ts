import fs from "fs";
import path from "path";

import { Player, QueryType, Queue, Track } from "discord-player";
import { joinVoiceChannel } from "@discordjs/voice";

import { Client, Message, MessageEmbed, VoiceState } from "discord.js";
import { TextEncodings, Prefix, HelpDictionary } from "../utils";


interface TrackEmbedDetail {
    name: string;
    author: string;
    requestedBy: string;
    queueIndexNumber: number;
}


export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "queue",
        description: "Met deze opdracht kun jij zien hoeveel en welke nummers er nog in de wachtrij staan."
    };

    return dict;
}


/**
 * Executes the queue function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    if (message.guild === null) return message.channel.send("bruh");

    const queue: Queue = player.getQueue(message.guild.id);

    if (!queue || !queue.playing) return message.channel.send("Er zijn momenteel geen nummers die afgespeeld worden.");
    if (!queue.tracks[0]) return message.channel.send("Er zijn geen andere nummers in de afspeellijst na het nummer dat nu word afspeeld.");

    const embedMessage: MessageEmbed = new MessageEmbed();

    embedMessage.setTitle("Afspeellijst");
    embedMessage.setColor("#fa52ef");

    const tracks: Array<TrackEmbedDetail> = queue.tracks.map(function (track: Track, index: number) {

        const o: TrackEmbedDetail = {
            queueIndexNumber: index + 1,
            name: track.title,
            author: track.author,
            requestedBy: track.requestedBy.username
        }

        return o;
    });

    const tracksLength: number = queue.tracks.length;

    const nextSong: string = tracksLength > 5 ?
        `En ${tracksLength - 5} andere nummers.` :
        `Er zijn nog ${tracksLength} nummbers in de afspeellijst`;

    embedMessage.setDescription(`Momenteel word het nummer **${queue.current.title}**`);

    tracks.splice(0, 5).forEach(function (track: TrackEmbedDetail) {

        embedMessage.fields.push({
            name: `[${track.queueIndexNumber}] - ${track.name}`,
            value: track.author,
            inline: false,
        });

    });

    embedMessage.setFooter({
        text: `Opdracht uitgevoerd door ${message.author.username}`
    });

    message.channel.send({embeds: [embedMessage]});
}