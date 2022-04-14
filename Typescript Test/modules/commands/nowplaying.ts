import fs from "fs";
import path from "path";

import { Player, QueryType, Queue, Track } from "discord-player";
import { Client, Message, MessageAttachment, MessageEmbed, VoiceState } from "discord.js";

import { TextEncodings, Prefix, PlayerTimestamp, HelpDictionary } from "../utils";
import { createTrackPlayerImage } from "../essentials/canvas";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "nowplaying",
        description: "Als er nummer word afgespeeld, en jij wilt graag weten welk nummer er word afgespeeld, kun jij dat doen met deze opdracht.",
        arguments: ["all", "fancy"]
    };

    return dict;
}

/**
 * Executes the nowplaying function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    if (message.guild === null) return;

    console.log(commandArguments);

    const queue: Queue = player.getQueue(message.guild.id);

    if (!queue || !queue.playing) return message.channel.send(`Momenteel worden er geen nummers afgespeeld!`);

    const currentTrack: Track = queue.current;

    const trackTimestamp: PlayerTimestamp = queue.getPlayerTimestamp();
    const trackDuration: string = currentTrack.duration;
    const trackVolume: string = queue.volume.toString();
    const methods: Array<string> = ["uitgeschakeld", "huidige nummer", "afspeellijst"];
    const filters: string = queue.getFiltersEnabled().length > 0 ? queue.getFiltersEnabled().join(", ") : "geen filters";

    const embedMessage: MessageEmbed = new MessageEmbed();

    embedMessage.setTitle(currentTrack.title)
        .setThumbnail(currentTrack.thumbnail)
        .setColor("#03fc94")
        .setDescription(`van ${currentTrack.author}. ${ trackTimestamp.current } - ${ trackDuration }`)
        .setFooter(`Opdracht uitgevoerd door ${message.author.username}`);


    switch (true) {
        case commandArguments.includes("all"):

            embedMessage.addFields([
                {
                    name: "Volume",
                    value: trackVolume + "%"
                },
                {
                    name: "Herhaalmodus",
                    value: methods[queue.repeatMode]
                },
                {
                    name: "Link naar nummer",
                    value: currentTrack.url
                },
                {
                    name: "Filters",
                    value: filters
                },
            ]);

            break;
        case commandArguments.includes("fancy"):


            return message.channel.send("Deze feature is momenteel niet beschikbaar.");

            break;
    }


    message.channel.send({embeds: [embedMessage]})
}