import fs from "fs";
import path from "path";

import { Player, QueryType } from "discord-player";
import { joinVoiceChannel } from "@discordjs/voice";

import { Client, Message } from "discord.js";
import { TextEncodings, Prefix } from "../utils";


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    let trackName: string = commandArguments[0];

    if (trackName === "") {

        message.channel.send("Er is geen naam of URL van het gewenste nummer ingevoerd.");
        return;
    }

    const res = await player.search(trackName, {
        searchEngine: QueryType.AUTO,
        requestedBy: message.author
    });

    if (!res || !res.tracks.length) {

        message.channel.send("Er zijn geen resultaten gevonden voor " + trackName);
        return;
    }

    const queue = await player.createQueue(message.guild, {
        metadata: message.channel
    });

    const channel = message.member?.voice.channel;

    try {

        if (!queue.connection) await queue.connect(channel)

    } catch {



    }
}