import { Player } from "discord-player";
import { Client, Message, MessageEmbed } from "discord.js";

import { CommandExecutionWhitelist, HelpDictionary } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "clear",
        description: "Met deze opdracht kun jij een afspeellijst leegmaken."
    }

    return dict;
}


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    if (message.guild === null) return message.channel.send("Kan opdracht niet uitvoeren. ``MESSAGE_GUILD_UNDEFINED``");

    const queue = player.getQueue(message.guild.id);

    if (!queue || !queue.playing) return message.channel.send("Er spelen momenteel geen nummers af.");

    if (!queue.tracks[0]) return message.channel.send("Er zijn geen nummers meer in de wachtrij die leeg kunnen worden gemaakt.");

    await queue.clear();

    return message.channel.send("Afspeellijst succesvol leeggemaakt.");
}