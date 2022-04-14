import { Player } from "discord-player";
import { Client, Message, MessageAttachment, MessageEmbed } from "discord.js";
import { createOktay } from "../essentials/canvas";

import { HelpDictionary } from "../utils";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "oktay",
        description: "Oktay?!?!??!!??"
    };

    return dict;
}


function createNoAttachmentsEmbedMessage(): MessageEmbed {

    const message: MessageEmbed = new MessageEmbed();

    message.setTitle("Nigard");
    message.setDescription(`Er zijn geen bijlagen toegevoegd. Om deze opdracht uit te voeren.`);
    message.setTimestamp();
    message.setColor("RANDOM");
    message.setThumbnail("https://www.expoxl.nl/wp-content/uploads/sex-bel-ring-for-sex.jpg");

    return message;

}


export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    if (message.attachments.size === 0) return message.reply({ embeds: [createNoAttachmentsEmbedMessage()] }); 

    //@ts-expect-error
    const attachment: MessageAttachment = message.attachments.first();

    const oktay: string = await createOktay(attachment.url);
    const customAttachment: MessageAttachment = new MessageAttachment(oktay, "oktay.png");

    const embedMessage: MessageEmbed = new MessageEmbed();
    embedMessage.setThumbnail("attachment://oktay.png");
   

    message.channel.send({ files: [customAttachment]});

    message.delete();

}