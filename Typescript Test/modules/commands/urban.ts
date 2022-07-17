import cheerio from "cheerio";
import axios, { AxiosResponse } from "axios";

import { Player } from "discord-player";
import { Client, Message, MessageEmbed } from "discord.js";

import { HelpDictionary, TextEncodings } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "urban",
        description: "Een hele coole opdracht waarmee jij urban termen kan opzoeken.",
        keyword: "zoekopdracht"
    }

    return dict;
}


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player): Promise<any> {

    if (client.user === null) return message.channel.send("Bruh");

    if (commandArguments.length < 1) message.channel.send("Brah, je moet wel iets invoeren hé."); 

    const searchQuery = commandArguments[0].split(" ")[1];

    const page: AxiosResponse = await axios.get(`https://www.urbandictionary.com/define.php?term=${commandArguments[0]}`);
    const $ = cheerio.load(page.data);

    const allDefinitions = $(".definition");
    const definition = $(".definition").first();

    const header = $(definition).find("h1").first().text();
    const meaning = $(definition).find(".meaning").first().text();
    const contributer = $(definition).find(".contributor").first().text();


    const messageEmbed: MessageEmbed = new MessageEmbed({
        title: header,
        description: meaning,
        color: "RANDOM",
        thumbnail: {
            url: "https://play-lh.googleusercontent.com/unQjigibyJQvru9rcCOX7UCqyByuf5-h_tLpA-9fYH93uqrRAnZ0J2IummiejMMhi5Ch"
        },
        author: {
            name: `Betekenis voor ${header}`,
            iconURL: message.author.displayAvatarURL()
        },
        footer: {
            text: contributer as string,
        },
        fields: [{name: TextEncodings.whiteSpace, value: `En ${allDefinitions.length} meer definities.`}]
    });

    message.channel.send({ embeds: [messageEmbed] });
    message.channel.send(`Bekijk https://www.urbandictionary.com/define.php?term=${searchQuery} voor meer informatie.`)
}