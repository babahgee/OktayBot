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
exports.Execute = void 0;
const discord_js_1 = require("discord.js");
/**
 * Executes the queue function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.guild === null)
            return message.channel.send("bruh");
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing)
            return message.channel.send("Er zijn momenteel geen nummers die afgespeeld worden.");
        if (!queue.tracks[0])
            return message.channel.send("Er zijn geen andere nummers in de afspeellijst na het nummer dat nu word afspeeld.");
        const embedMessage = new discord_js_1.MessageEmbed();
        embedMessage.setTitle("Afspeellijst");
        embedMessage.setColor("#fa52ef");
        const tracks = queue.tracks.map(function (track, index) {
            const o = {
                queueIndexNumber: index + 1,
                name: track.title,
                author: track.author,
                requestedBy: track.requestedBy.username
            };
            return o;
        });
        const tracksLength = queue.tracks.length;
        const nextSong = tracksLength > 5 ?
            `En ${tracksLength - 5} andere nummers.` :
            `Er zijn nog ${tracksLength} nummbers in de afspeellijst`;
        embedMessage.setDescription(`Momenteel word het nummer **${queue.current.title}**`);
        tracks.splice(0, 5).forEach(function (track) {
            embedMessage.fields.push({
                name: `[${track.queueIndexNumber}] - ${track.name}`,
                value: track.author,
                inline: false,
            });
        });
        embedMessage.setFooter({
            text: `Opdracht uitgevoerd door ${message.author.username}`
        });
        message.channel.send({ embeds: [embedMessage] });
    });
}
exports.Execute = Execute;
