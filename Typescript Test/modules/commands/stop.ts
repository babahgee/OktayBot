import { Player } from "discord-player";
import { Client, Message, MessageEmbed } from "discord.js";

import { CommandExecutionWhitelist, HelpDictionary } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "stop",
        description: "Met deze opdracht kun jij de gehele muziek-playback stoppen. Let op, alles word gereset dat kan betekenen dat je alles opnieuw moet gaan doen."
    }

    return dict;
}


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    if (message.guild === null) return message.channel.send("Kan opdracht niet uitvoeren. ``MESSAGE_GUILD_UNDEFINED``");

    const queue = player.getQueue(message.guild.id);

    if (!queue || !queue.playing) return message.channel.send("Er spelen momenteel geen nummers af.");
   
    await queue.destroy();

    return message.channel.send("Muziek-playback succesvol gestopt.");
}