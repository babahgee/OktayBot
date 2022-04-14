import { Player } from "discord-player";
import { Client, Message, MessageEmbed } from "discord.js";

import { CommandExecutionWhitelist, HelpDictionary } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "exit",
        description: "Een administratieve opdracht waarmee je de bot kan sluiten."
    }

    return dict;
}


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    if (client.user === null) return message.channel.send("Bruh");

    if (!CommandExecutionWhitelist.includes(message.author.id)) return message.channel.send("bruh jij bent niet bevoegd om deze opdracht uit te voeren.");

    message.reply("Als jij de bot wilt gaan afsluiten, kun je dat doen via de openstaande opdracht-prompt tabblad. Voer de toetsenbordcombinatie CTRL+C uit (dubbel keer aub).");
}