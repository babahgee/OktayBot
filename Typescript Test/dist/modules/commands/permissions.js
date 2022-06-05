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
const utils_1 = require("../utils");
function GetHelp() {
    const dict = {
        command: "permission",
        description: "Een administratieve opdracht waarmee jij JavaScript opdrachten kun uitvoeren binnen de bot zelf. Let op: de token ``bot.permission.allowEval`` moet beschikbaar zijn in het ``bot.permissions.json`` bestand. Let er ook op dat alleen gemachtige gebruikers deze opdracht kunnen uitvoeren!",
        arguments: ["add <token>", "remove <token>"]
    };
    return dict;
}
exports.GetHelp = GetHelp;
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (client.user === null)
            return message.channel.send("Bruh");
        if (!utils_1.CommandExecutionWhitelist.includes(message.author.id))
            return message.channel.send("bruh jij bent niet bevoegd om deze opdracht uit te voeren.");
        const argFormat = commandArguments[0].replace(" ", "").split(" ");
        if (typeof argFormat[1] === "undefined" || argFormat[1] === "")
            return message.channel.send("Kan machtigings token niet toevoegen omdat er geen token is opgenoemd.");
        const keyword = argFormat[0];
        const token = argFormat[1];
        const embed = new discord_js_1.MessageEmbed({
            title: "Bot machtigings tokens",
            description: "Dit zijn alle actieve machtigings tokens die ervoor zorgt dat de bot verschillende opdrachten kan uitvoeren. Mogelijk moet de bot opnieuw worden opgestart om wijzigingen toe te passen.",
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL(),
            },
            color: "RANDOM",
            footer: {
                text: client.user.username,
                icon_url: client.user.displayAvatarURL()
            }
        });
        switch (keyword) {
            case "add":
                if (!utils_1.AllPermissions.tokens.includes(token))
                    utils_1.AllPermissions.tokens.push(token);
                break;
            case "remove":
                utils_1.AllPermissions.tokens.forEach(function (_token, index) {
                    if (token === _token)
                        utils_1.AllPermissions.tokens.splice(index, 1);
                });
                break;
        }
        embed.addField("Bot machtigingen", (0, utils_1.CodeFormatTokens)().join(""));
        (0, utils_1.SaveChangedBotPermissions)();
        return message.channel.send({
            embeds: [embed]
        });
    });
}
exports.Execute = Execute;
