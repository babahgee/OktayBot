import "colors";

import { Player } from "discord-player";
import { Client as DiscordClient, Message, MessageEmbed } from "discord.js";
import { Client as GeniusClient, Song } from "genius-lyrics";


const geniusClient: GeniusClient = new GeniusClient();




/**
 * Executes the lyrics function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
export async function Execute(message: Message, commandArguments: Array<string>, client: DiscordClient, player: Player) {

    const searchName: string = commandArguments[0];

    if (searchName === "") return message.channel.send("Kan geen lyrics opzoeken. Er is geen naam opgegeven.");


    console.log(`Fetching data...`.yellow);

    const searchResults = await geniusClient.songs.search(searchName);

    const firstResult: Song = searchResults[0];

    const songTitle: string = firstResult.title,
        songFeatured: string = firstResult.featuredTitle,
        songThumbnail: string = firstResult.thumbnail,
        songImage: string = firstResult.image,
        songLyrics: string = await firstResult.lyrics();

    const embedMessage: MessageEmbed = new MessageEmbed();

    embedMessage.setTitle(`${songTitle} door ${songFeatured}`);
    embedMessage.setDescription(songLyrics);
    embedMessage.setThumbnail(songThumbnail);
    embedMessage.setFooter({
        text: `Opdracht uitgevoerd door ${message.author.username}`,
        iconURL: message.author.displayAvatarURL()
    });

    message.channel.send({embeds: [embedMessage]});
}