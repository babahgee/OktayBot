import { Player } from "discord-player";
import { Client, Message, MessageEmbed } from "discord.js";
import { cpu, cpuCurrentSpeed } from "systeminformation";
import { cpuUsage } from "os-utils";
import gitRepoInfo, { GitRepoInfo } from "git-repo-info";

import { AllPermissions, BytesToSize, CodeFormatTokens, CommandExecutionWhitelist, HelpDictionary, TextEncodings, Tokens } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "botstat", 
        description: "Een administratieve opdracht waarmee je kunt zien hoe de bot runt."
    }

    return dict;
}

export async function GetCPUUsage(): Promise<number> {

    return new Promise(function (resolve, reject) {
        cpuUsage(function (usage: number) {
            resolve(usage as number);
        });
    });
}


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    if (client.user === null) return message.channel.send("Bruh");

    if (!CommandExecutionWhitelist.includes(message.author.id)) return message.channel.send("bruh jij bent niet bevoegd om deze opdracht uit te voeren.");

    const userName = client.user?.username;
    const userAvatar = client.user?.displayAvatarURL();

    const embed: MessageEmbed = new MessageEmbed();

    const cpuUsage: string = (await GetCPUUsage() as number * 100).toFixed(2);
    const moods: Array<string> = ["Normaal", "Opgewonden", "Verdrietig", "Quirky", "Oktay-achtig", "??"];
    const repoInfo: GitRepoInfo = gitRepoInfo("https://github.com/babahgee/OktayBot");

    embed.setAuthor({ name: userName, iconURL: userAvatar });
    embed.setTitle("Bot statistieken");
    embed.setDescription("Uitvoerbaar door elk lid dat toegang heeft tot de bot. Opdracht laat zien hoe de bot zich momenteel gedraagt");
    embed.setColor("RED");
    embed.setThumbnail(userAvatar);
    embed.setFooter({
        text: userName,
        iconURL: userAvatar
    });

    //@ts-expect-error
    embed.addField("Uptime", client.uptime === null ? client.uptime.toString() : "Kan client uptime niet vinden");
    embed.addField("Proces uptime", process.uptime().toString());
    embed.addField("Geheugengebruik", BytesToSize(process.memoryUsage().heapUsed as number).toString());
    embed.addField("CPU verbruik", cpuUsage.toString() + "%");
    embed.addField("Systeem CPU verbruik", process.cpuUsage().system.toString());
    embed.addField("Stemming", moods[Math.floor(Math.random() * moods.length)]);
    embed.addField("Bot (interne) rechten", CodeFormatTokens().join(""));
    embed.addField(TextEncodings.whiteSpace, TextEncodings.whiteSpace);
    embed.addField("Bot repository link", "https://github.com/babahgee/OktayBot");
    embed.addField("Repository committer", repoInfo.committer);
    embed.addField("Repository committer date", repoInfo.committerDate);


    message.channel.send({ embeds: [embed] });
}