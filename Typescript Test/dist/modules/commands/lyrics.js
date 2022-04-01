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
require("colors");
const discord_js_1 = require("discord.js");
const genius_lyrics_1 = require("genius-lyrics");
const geniusClient = new genius_lyrics_1.Client();
/**
 * Executes the lyrics function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchName = commandArguments[0];
        if (searchName === "")
            return message.channel.send("Kan geen lyrics opzoeken. Er is geen naam opgegeven.");
        console.log(`Fetching data...`.yellow);
        const searchResults = yield geniusClient.songs.search(searchName);
        const firstResult = searchResults[0];
        const songTitle = firstResult.title, songFeatured = firstResult.featuredTitle, songThumbnail = firstResult.thumbnail, songImage = firstResult.image, songLyrics = yield firstResult.lyrics();
        const embedMessage = new discord_js_1.MessageEmbed();
        embedMessage.setTitle(`${songTitle} door ${songFeatured}`);
        embedMessage.setDescription(songLyrics);
        embedMessage.setThumbnail(songThumbnail);
        embedMessage.setFooter({
            text: `Opdracht uitgevoerd door ${message.author.username}`,
            iconURL: message.author.displayAvatarURL()
        });
        message.channel.send({ embeds: [embedMessage] });
    });
}
exports.Execute = Execute;
