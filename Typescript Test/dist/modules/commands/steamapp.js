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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execute = exports.GetHelp = void 0;
require("colors");
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
function GetHelp() {
    const dict = {
        command: "steamapp",
        description: "Je kan hiermee gegevens van steam nakken als je wil.",
        keyword: "search, news, database",
        arguments: [
            "filter <about, tags, price, requirements, reviews>",
            "imageonly <true, false> (default = false)",
            "includepatchnotes <true, false> (default = false)",
        ]
    };
    return dict;
}
exports.GetHelp = GetHelp;
function createPrefaceMessage(htmlContent, rootHref) {
    return __awaiter(this, void 0, void 0, function* () {
        const appTitle = htmlContent(".apphub_AppName").first().text();
        const appHeaderImage = htmlContent(".game_header_image_full").attr("src");
        const appDescriptionSnipper = htmlContent(".game_description_snippet").text();
        const appHighlightVideoSrc = htmlContent(".highlight_player_item").first().attr("data-mp4-source");
        const userReviews = htmlContent(".game_review_summary").first().text();
        const releaseDate = htmlContent(".release_date").children(".date").text();
        const developer = htmlContent(".dev_row").children(".summary").text();
        const purchasePrice = htmlContent(".game_purchase_price").first().text();
        const message = new discord_js_1.MessageEmbed({
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
    });
}
function searchSteamApp(appName, args, message) {
    return __awaiter(this, void 0, void 0, function* () {
        args = args.map(arg => arg.trim());
        const fetchedData = yield axios_1.default.get(`https://store.steampowered.com/search/?term=${appName}`), fetchHTMLContents = cheerio_1.default.load(fetchedData.data);
        const searchResults = fetchHTMLContents(".search_result_row");
        if (searchResults.length === 0)
            return yield message.channel.send(`Er zijn geen resultaten gevonden voor '${appName}'.`);
        const firstResult = searchResults.first(), resultAttr = firstResult.attr("href"), appPage = yield axios_1.default.get(resultAttr);
        const rootContents = cheerio_1.default.load(appPage.data);
        if (args.length > 0)
            return;
        return message.channel.send({ embeds: [yield createPrefaceMessage(rootContents, resultAttr)] });
    });
}
/**
 * Executes the lyrics function.
 * @param message Passed message object.
 * @param commandArguments Command arguments.
 * @param client Main client.
 * @param player Main player.
 */
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof commandArguments[0] !== "string" || commandArguments[0].trim().length < 1)
            return message.channel.send("Kan opdracht niet uitvoeren aangezien er geen trefwoord is opgegeven. Voer ``" + utils_1.Prefix + " help steamapp`` uit om meer informatie te krijgen.");
        const keyword = commandArguments[0].trim().split(" ")[0].trim();
        const appName = commandArguments[0].trim().split(" ")[1].trim();
        commandArguments.shift();
        switch (keyword) {
            case "search":
                yield searchSteamApp(appName, commandArguments, message);
                break;
            case "news":
                break;
            case "database":
                break;
            default:
                return message.channel.send(`Trefoord '${keyword}' is niet bekend bij mij.`);
                break;
        }
    });
}
exports.Execute = Execute;
