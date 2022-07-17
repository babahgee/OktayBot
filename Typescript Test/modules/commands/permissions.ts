import { Player } from "discord-player";
import { Client, Message, MessageEmbed } from "discord.js";

import { AllPermissions, CodeFormatTokens, CommandExecutionWhitelist, HelpDictionary, SaveChangedBotPermissions, Tokens } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "permission",
        description: "Een administratieve opdracht waarmee jij JavaScript opdrachten kun uitvoeren binnen de bot zelf. Let op: de token ``bot.permission.allowEval`` moet beschikbaar zijn in het ``bot.permissions.json`` bestand. Let er ook op dat alleen gemachtige gebruikers deze opdracht kunnen uitvoeren!",
        arguments: ["add <token>", "remove <token>"]
    }

    return dict;
}


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player): Promise<Message> {

    if (client.user === null) return message.channel.send("Bruh");

    if (!CommandExecutionWhitelist.includes(message.author.id)) return message.channel.send("bruh jij bent niet bevoegd om deze opdracht uit te voeren.");

    const argFormat: Array<string> = commandArguments[0].replace(" ", "").split(" ");

   //  if (typeof argFormat[1] === "undefined" || argFormat[1] === "") return message.channel.send("Kan machtigings token niet toevoegen omdat er geen token is opgenoemd.");

    const keyword: string = argFormat[0];
    const token: string = argFormat[1];

    const embed: MessageEmbed = new MessageEmbed({
        title: "Bot machtigings tokens",
        description: "Dit zijn alle actieve machtigings tokens die ervoor zorgt dat de bot verschillende opdrachten kan uitvoeren. Mogelijk moet de bot opnieuw worden opgestart om wijzigingen toe te passen.",
        author: {
            name: message.author.username,
            icon_url: message.author.displayAvatarURL(),
        },
        color: "RANDOM",
        footer: {
            text: client.user.username,
            icon_url: client.user.displayAvatarURL()
        }
    });

    switch (keyword) {
        case "add":

            if (!AllPermissions.tokens.includes(token)) AllPermissions.tokens.push(token);

            embed.title = "Permissie token toegevoegd.";
            embed.description = `Permissie token ${token} is zojuist toegevoegd aan het register.`;

            break;
        case "remove":

            AllPermissions.tokens.forEach(function (_token: string, index: number) {
                if (token === _token) AllPermissions.tokens.splice(index, 1);
            });

            embed.title = "Permissie token verwijderdd.";
            embed.description = `Permissie token ${token} is zojuist verwijderd van het register.`;

            break;
    }

	console.log(keyword);

    embed.addField("Bot machtigingen", CodeFormatTokens().join(""));

    SaveChangedBotPermissions();

    return message.channel.send({
        embeds: [embed]
    });
}