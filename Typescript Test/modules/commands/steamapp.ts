import "colors";

import axios, { AxiosResponse } from "axios";
import cheerio, { Cheerio, CheerioAPI } from "cheerio";


import { Client as DiscordClient, Message, MessageEmbed } from "discord.js";
import { HelpDictionary, Prefix } from "../utils";
import { Player } from "discord-player";

export function GetHelp(): HelpDictionary {

    const dict: HelpDictionary = {
        command: "steamapp",
        description: "Je kan hiermee gegevens van steam nakken als je wil.",
        keyword: "search, news, database",
        arguments: [
            "filter <about, tags, price, requirements, reviews>",
            "imageonly <true, false> (default = false)",
            "includepatchnotes <true, false> (default = false)",
        ]
    }

    return dict;
}

async function createPrefaceMessage(htmlContent: CheerioAPI, rootHref: string): Promise<MessageEmbed> {

    const appTitle: string = htmlContent(".apphub_AppName").first().text() as string;
    const appHeaderImage: string = htmlContent(".game_header_image_full").attr("src") as string;
    const appDescriptionSnipper: string = htmlContent(".game_description_snippet").text() as string;
    const appHighlightVideoSrc: string = htmlContent(".highlight_player_item").first().attr("data-mp4-source") as string;

    const userReviews = htmlContent(".game_review_summary").first().text();
    const releaseDate = htmlContent(".release_date").children(".date").text();
    const developer = htmlContent(".dev_row").children(".summary").text();
    const purchasePrice = htmlContent(".game_purchase_price").first().text();

    const message: MessageEmbed = new MessageEmbed({
        title: appTitle,
        description: appDescriptionSnipper + `\n\nSee ${rootHref} for more details.`,
        image: {
            url: appHeaderImage
        },
        color: "RANDOM",
        footer: {
            text: "Taken from https://store.steampowered.com/",
        }
    });

    message.addField("User reviews", userReviews.length < 3 ? "No details found" : userReviews);
    message.addField("Release date", releaseDate.length < 3 ? "No details found" : releaseDate);
    message.addField("Developer", developer.length < 3 ? "No details found" : developer);
    message.addField("Purchase price", purchasePrice.length < 3 ? "No details found" : purchasePrice);

    return message;
}


async function searchSteamApp(appName: string, args: Array<string>, message: Message) {

    args = args.map(arg => arg.trim());

    const fetchedData: AxiosResponse = await axios.get(`https://store.steampowered.com/search/?term=${appName}`),
        fetchHTMLContents = cheerio.load(fetchedData.data);

    const searchResults = fetchHTMLContents(".search_result_row");

    if (searchResults.length === 0) return await message.channel.send(`Er zijn geen resultaten gevonden voor '${appName}'.`);

    const firstResult = searchResults.first(),
        resultAttr: string = firstResult.attr("href") as string,
        appPage: AxiosResponse = await axios.get(resultAttr);

    const rootContents = cheerio.load(appPage.data);

    if (args.length > 0) return;

    return message.channel.send({embeds: [await createPrefaceMessage(rootContents, resultAttr as string)]});
}


/**
 * Executes the lyrics function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
export async function Execute(message: Message, commandArguments: Array<string>, client: DiscordClient, player: Player) {

    if (typeof commandArguments[0] !== "string" || commandArguments[0].trim().length < 1) return message.channel.send("Kan opdracht niet uitvoeren aangezien er geen trefwoord is opgegeven. Voer ``" + Prefix + " help steamapp`` uit om meer informatie te krijgen.");

    const keyword: string | undefined = commandArguments[0].trim().split(" ")[0].trim();
    const appName: string = commandArguments[0].trim().split(" ")[1].trim();

    commandArguments.shift();

    switch (keyword) {
        case "search":

            await searchSteamApp(appName, commandArguments, <Message> message);
            
            break;
        case "news":

            break;
        case "database":

            break;
        default:

            return message.channel.send(`Trefoord '${keyword}' is niet bekend bij mij.`);
            break;
    }
}