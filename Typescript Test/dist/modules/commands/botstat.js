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
exports.Execute = exports.GetCPUUsage = exports.GetHelp = void 0;
const discord_js_1 = require("discord.js");
const os_utils_1 = require("os-utils");
const git_repo_info_1 = __importDefault(require("git-repo-info"));
const utils_1 = require("../utils");
function GetHelp() {
    const dict = {
        command: "botstat",
        description: "Een administratieve opdracht waarmee je kunt zien hoe de bot runt."
    };
    return dict;
}
exports.GetHelp = GetHelp;
function GetCPUUsage() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            (0, os_utils_1.cpuUsage)(function (usage) {
                resolve(usage);
            });
        });
    });
}
exports.GetCPUUsage = GetCPUUsage;
function Execute(message, commandArguments, client, player) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (client.user === null)
            return message.channel.send("Bruh");
        if (!utils_1.CommandExecutionWhitelist.includes(message.author.id))
            return message.channel.send("bruh jij bent niet bevoegd om deze opdracht uit te voeren.");
        const userName = (_a = client.user) === null || _a === void 0 ? void 0 : _a.username;
        const userAvatar = (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL();
        const embed = new discord_js_1.MessageEmbed();
        const cpuUsage = ((yield GetCPUUsage()) * 100).toFixed(2);
        const moods = ["Normaal", "Opgewonden", "Verdrietig", "Quirky", "Oktay-achtig", "??"];
        const repoInfo = (0, git_repo_info_1.default)("https://github.com/babahgee/OktayBot");
        embed.setAuthor({ name: userName, iconURL: userAvatar });
        embed.setTitle("Bot statistieken");
        embed.setDescription("Uitvoerbaar door elk lid dat toegang heeft tot de bot. Opdracht laat zien hoe de bot zich momenteel gedraagt");
        embed.setColor("RED");
        embed.setThumbnail(userAvatar);
        embed.setFooter({
            text: userName,
            iconURL: userAvatar
        });
        //@ts-expect-error
        embed.addField("Uptime", client.uptime === null ? client.uptime.toString() : "Kan client uptime niet vinden");
        embed.addField("Proces uptime", process.uptime().toString());
        embed.addField("Geheugengebruik", (0, utils_1.BytesToSize)(process.memoryUsage().heapUsed).toString());
        embed.addField("CPU verbruik", cpuUsage.toString() + "%");
        embed.addField("Systeem CPU verbruik", process.cpuUsage().system.toString());
        embed.addField("Stemming", moods[Math.floor(Math.random() * moods.length)]);
        embed.addField("Bot (interne) rechten", (0, utils_1.CodeFormatTokens)().join(""));
        embed.addField(utils_1.TextEncodings.whiteSpace, utils_1.TextEncodings.whiteSpace);
        embed.addField("Bot repository link", "https://github.com/babahgee/OktayBot");
        embed.addField("Repository committer", repoInfo.committer);
        embed.addField("Repository committer date", repoInfo.committerDate);
        message.channel.send({ embeds: [embed] });
    });
}
exports.Execute = Execute;
