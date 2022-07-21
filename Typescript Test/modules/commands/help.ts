import fs from "fs";
import path from "path";

import { Client, Message, MessageEmbed } from "discord.js";
import { TextEncodings, Prefix, HelpDictionary } from "../utils";
import { Player } from "discord-player";

export function GetHelp(): HelpDictionary {
    const dict: HelpDictionary = {
        command: "help", 
        description: "Een opdracht die jou een beeld geeft over welke opdrachten OktayBot kan uitvoeren.",
        keyword: "opdracht"
    }

    return dict;
}


async function createGeneralHelpGuide(client: Client): Promise<MessageEmbed> {

    const commands: Array<string> = fs.readdirSync(path.join(__dirname));
    const embed: MessageEmbed = new MessageEmbed();
    const clientAvatar = client.user?.displayAvatarURL();

    embed.setTitle(":weary::weary::weary: omg oktayyyy je bent zoo hott");
    embed.setDescription("Hmmmm dus jij bent benieuwd naar welke opdrachten ik kan uitvoeren he? Als je deze opdracht MET een bestaand opdracht uitvoert, krijg je alle info over die ene opdracht jwz Oktay type beat.");
    embed.setColor("#70ff83");

    //@ts-expect-error
    embed.setThumbnail(clientAvatar);

    embed.setFields([{ name: "Prefix", value: Prefix }]);
    embed.setFields([{ name: TextEncodings.whiteSpace, value: "Oktay's beschikbare opdrachten zijn als volgt:" }]);

    embed.setFooter({ text: "Geloof het of niet maar deze bot is gemaakt door Oktay." });

    //@ts-expect-error
    embed.setAuthor({ name: client.user.username, iconURL: clientAvatar });

    return new Promise(async function (resolve, reject) {

        commands.forEach(async function (command: string) {

            const commandImportation = await import(path.join(__dirname, command));

            const helpDictionary: (HelpDictionary | null) = typeof commandImportation.GetHelp === "function" ? commandImportation.GetHelp() : null;

            if (helpDictionary !== null) embed.fields.push({ name: Prefix + " " + helpDictionary.command, value: helpDictionary.description, inline: false });

            resolve(embed);
        });


    })
}


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    let keyword: string = commandArguments[0];

    const availableCommands: Array<string> = fs.readdirSync(__dirname).map(cmd => cmd.split(".")[0]);

    for (let i = 0; i < keyword.length; i++) if (keyword.charAt(i) === " ") keyword = keyword.replace(" ", "");

    if (keyword === "") return message.channel.send({ embeds: [await createGeneralHelpGuide(client)] });

    if (!availableCommands.includes(keyword)) return message.channel.send(`Bruh, denk je dat '${keyword}' bestaat in mijn codebase? MEOW!!`);

    const commandImportation = await import(path.join(__dirname, keyword + ".js"));
    const dict: HelpDictionary = commandImportation.GetHelp();
    const embedMessage: MessageEmbed = new MessageEmbed();

    embedMessage.setColor("RANDOM");
    embedMessage.setTimestamp();
    embedMessage.setThumbnail("https://i1.sndcdn.com/artworks-000438293379-qmqr5v-t500x500.jpg");
    
    embedMessage.setTitle(`${Prefix} ${dict.command}`);
    embedMessage.setDescription(dict.description);

    if (dict.keyword) embedMessage.description += `\nHet uitvoeren van deze opdracht werkt als volgt: ${TextEncodings.graveAccent}${TextEncodings.graveAccent}${TextEncodings.graveAccent}${Prefix} ${dict.command} [${dict.keyword}] [argumenten?]${TextEncodings.graveAccent}${TextEncodings.graveAccent}${TextEncodings.graveAccent}`;

    if (dict.arguments) {

        embedMessage.description += "\n\nAlle beschikbare argumenten zijn als volgt:\n";

        dict.arguments.forEach(function (arg: string) {

            const argumentName: string = arg.split(" ")[0];

            embedMessage.addField("-" + argumentName, "``-" + arg + "``");
             
        });

    }

  

    return message.channel.send({embeds: [embedMessage]})
}