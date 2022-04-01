import fs from "fs";
import path from "path";

import { Player, QueryType, Queue } from "discord-player";
import { joinVoiceChannel } from "@discordjs/voice";

import { Client, Message, MessageEmbed, VoiceState } from "discord.js";
import { TextEncodings, Prefix } from "../utils";

/**
 * Executes the skip function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
export async function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    if (message.guild === null) return message.channel.send("Kan opdracht niet uitvoeren.");

    // Define the queue made in the message guild.
    const queue: Queue = player.getQueue(message.guild.id);

    // Create an embed message.
    const noPlayingTrackEmbedMessage: MessageEmbed = new MessageEmbed({
        color: "#d1fff9",
        title: "Afspeelfout",
        description: "Er zijn momenteel geen andere nummers in de afspeellijst die geskipt kunnen worden.", 
        footer: {
            text: `Opgevraagd door ${message.author.username}.`
        }
    });

    // Send the noPlayTrackEmbedMessage if no tracks are in the queue
    if (!queue || !queue.playing) return message.channel.send({ embeds: [noPlayingTrackEmbedMessage] });

    // Skip the queue.
    const success = queue.skip();

    // Create an empty embed message.
    const resultStateEmbedMessage: MessageEmbed = new MessageEmbed();

    if (success) {

        // Set the content if the track succesfully got skipped.
        resultStateEmbedMessage.setTitle("Nice!")
            .setDescription(`Nummer succesvol geskipt. Speelt nu '${queue.current.title}' af, opgevraagd door ${queue.current.requestedBy.username}.`)
            .setColor("#fad1ff")
            .setImage(queue.current.thumbnail)
            .setFooter(`"Waar woon je Jop, ik koop dildo" ~ Mohammed`);

    } else {

        // Set the content if the track didn't got skipped.

        resultStateEmbedMessage.setTitle("Afspeelfout")
            .setDescription(`Iets ging er fout tijdens het uitvoeren van deze opdracht, waarschijnlijk is het Oktay geweest.`)
            .setColor("#ff6161")
            .setImage(queue.current.thumbnail)
            .setFooter(`Uitgevoerd door ${message.author.username}.`);

    }

    // Send the embed message.
    return message.channel.send({ embeds: [resultStateEmbedMessage] });

}
