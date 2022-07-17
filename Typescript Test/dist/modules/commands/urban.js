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
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
function GetHelp() {
    const dict = {
        command: "urban",
        description: "Een hele coole opdracht waarmee jij urban termen kan opzoeken.",
        keyword: "zoekopdracht"
    };
    return dict;
}
exports.GetHelp = GetHelp;
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (client.user === null)
            return message.channel.send("Bruh");
        if (commandArguments.length < 1)
            message.channel.send("Brah, je moet wel iets invoeren h�.");
        const searchQuery = commandArguments[0].split(" ")[1];
        const page = yield axios_1.default.get(`https://www.urbandictionary.com/define.php?term=${commandArguments[0]}`);
        const $ = cheerio_1.default.load(page.data);
        const allDefinitions = $(".definition");
        const definition = $(".definition").first();
        const header = $(definition).find("h1").first().text();
        const meaning = $(definition).find(".meaning").first().text();
        const contributer = $(definition).find(".contributor").first().text();
        const messageEmbed = new discord_js_1.MessageEmbed({
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
                text: contributer,
            },
            fields: [{ name: utils_1.TextEncodings.whiteSpace, value: `En ${allDefinitions.length} meer definities.` }]
        });
        message.channel.send({ embeds: [messageEmbed] });
        message.channel.send(`Bekijk https://www.urbandictionary.com/define.php?term=${searchQuery} voor meer informatie.`);
    });
}
exports.Execute = Execute;
