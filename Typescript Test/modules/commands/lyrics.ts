import "colors";

import { Player } from "discord-player";
import { Client as DiscordClient, Message, MessageEmbed } from "discord.js";
import { Client as GeniusClient, Song } from "genius-lyrics";
import { HelpDictionary } from "../utils";


const geniusClient: GeniusClient = new GeniusClient();

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "lyrics",
        description: "Er zijn wel eens momenten waar je denkt van 'gaaaaa dayum, dit nummer is bussin' yo wat is hier de lyrics van?'. Met deze opdracht kan je dus songteksten ophalen vanuit Genius.",
        keyword: "naam_van_nummer"
    }

    return dict;
}


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