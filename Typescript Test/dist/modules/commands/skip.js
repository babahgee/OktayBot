"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execute = exports.GetHelp = void 0;
const discord_js_1 = require("discord.js");
function GetHelp() {
    const dict = {
        command: "skip",
        description: "Met deze opdracht kan jij een nummer overslaan dat momenteel word afgespeeld."
    };
    return dict;
}
exports.GetHelp = GetHelp;
/**
 * Executes the skip function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.guild === null)
            return message.channel.send("Kan opdracht niet uitvoeren.");
        // Define the queue made in the message guild.
        const queue = player.getQueue(message.guild.id);
        // Create an embed message.
        const noPlayingTrackEmbedMessage = new discord_js_1.MessageEmbed({
            color: "#d1fff9",
            title: "Afspeelfout",
            description: "Er zijn momenteel geen andere nummers in de afspeellijst die geskipt kunnen worden.",
            footer: {
                text: `Opgevraagd door ${message.author.username}.`
            }
        });
        // Send the noPlayTrackEmbedMessage if no tracks are in the queue
        if (!queue || !queue.playing)
            return message.channel.send({ embeds: [noPlayingTrackEmbedMessage] });
        // Skip the queue.
        const success = queue.skip();
        // Create an empty embed message.
        const resultStateEmbedMessage = new discord_js_1.MessageEmbed();
        if (success) {
            // Set the content if the track succesfully got skipped.
            resultStateEmbedMessage.setTitle("Nice!")
                .setDescription(`Nummer succesvol geskipt. Speelt nu '${queue.current.title}' af, opgevraagd door ${queue.current.requestedBy.username}.`)
                .setColor("#fad1ff")
                .setImage(queue.current.thumbnail)
                .setFooter(`"Waar woon je Jop, ik koop dildo" ~ Mohammed`);
        }
        else {
            // Set the content if the track didn't got skipped.
            resultStateEmbedMessage.setTitle("Afspeelfout")
                .setDescription(`Iets ging er fout tijdens het uitvoeren van deze opdracht, waarschijnlijk is het Oktay geweest.`)
                .setColor("#ff6161")
                .setImage(queue.current.thumbnail)
                .setFooter(`Uitgevoerd door ${message.author.username}.`);
        }
        // Send the embed message.
        return message.channel.send({ embeds: [resultStateEmbedMessage] });
    });
}
exports.Execute = Execute;
