import { Player } from "discord-player";
import { Client, Message, MessageEmbed } from "discord.js";

import { CommandExecutionWhitelist, HelpDictionary } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "botstat", 
        description: "Een administratieve opdracht waarmee je kunt zien hoe de bot runt."
    }

    return dict;
}


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    if (client.user === null) return message.channel.send("Bruh");

    if (!CommandExecutionWhitelist.includes(message.author.id)) return message.channel.send("bruh jij bent niet bevoegd om deze opdracht uit te voeren.");

    const userName = client.user?.username;
    const userAvatar = client.user?.displayAvatarURL();

    const embed: MessageEmbed = new MessageEmbed();

    embed.setAuthor({ name: userName, iconURL: userAvatar });
    embed.setTitle("Bot statistieken");
    embed.setColor("RED");
    embed.setThumbnail(userAvatar);

    //@ts-expect-error
    embed.addField("Uptime", client.uptime === null ? client.uptime.toString() : "Kan client uptime niet vinden");
    embed.addField("Proces uptime", process.uptime().toString());
    embed.addField("Geheugengebruik", process.memoryUsage().heapUsed.toString());
    embed.addField("Gebruikers CPU verbruik", process.cpuUsage().user.toString());
    embed.addField("Systeem CPU verbruik", process.cpuUsage().system.toString());

    message.channel.send({ embeds: [embed] });
}