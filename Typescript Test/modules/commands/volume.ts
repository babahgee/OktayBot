import { Player } from "discord-player";
import { Client, Message, MessageEmbed } from "discord.js";

import { CommandExecutionWhitelist, HelpDictionary } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "volume",
        description: "Met deze opdracht kun jij de master volume aanpassen."
    }

    return dict;
}


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    if (message.guild === null) return message.channel.send("Kan opdracht niet uitvoeren. ``MESSAGE_GUILD_UNDEFINED``");

    return message.channel.send("Deze opdracht is momenteel niet beschikbaar. Ik raad je aan om zelf handmatig mijn volume aan te passen.");
}