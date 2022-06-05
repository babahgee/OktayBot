import { Player } from "discord-player";
import { Client, Message, MessageEmbed } from "discord.js";

import { AllPermissions, CommandExecutionWhitelist, HelpDictionary, Tokens } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "eval",
        description: "Een administratieve opdracht waarmee jij JavaScript opdrachten kun uitvoeren binnen de bot zelf. Let op: de token ``bot.permission.allowEval`` moet beschikbaar zijn in het ``bot.permissions.json`` bestand. Let er ook op dat alleen gemachtige gebruikers deze opdracht kunnen uitvoeren!"
    }

    return dict;
}


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player): Promise<Message> {

    if (client.user === null) return message.channel.send("Bruh");

    if (!Tokens.includes("bot.permission.allowEval")) return message.channel.send("Deze opdracht kan niet worden uitgevoerd omdat het token ``bot.permission.allowEval`` niet beschikbaar is. De bothoster kan deze optie beschikbaar maken");
    if (!CommandExecutionWhitelist.includes(message.author.id)) return message.channel.send("bruh jij bent niet bevoegd om deze opdracht uit te voeren.");

    const evalReturnStatus: any = eval(commandArguments[0]);
    const messageFormat: string = `[${new Date()}]: ${evalReturnStatus}`;

	console.log(`User '${message.author.username}' executed inline JS function: ${commandArguments[0]}`.yellow);

    return message.channel.send("```" + messageFormat + "```");
}