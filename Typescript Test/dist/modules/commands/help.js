"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
function GetHelp() {
    const dict = {
        command: "help",
        description: "Een opdracht die jou een beeld geeft over welke opdrachten OktayBot kan uitvoeren.",
        keyword: "opdracht"
    };
    return dict;
}
exports.GetHelp = GetHelp;
function createGeneralHelpGuide(client) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const commands = fs_1.default.readdirSync(path_1.default.join(__dirname));
        const embed = new discord_js_1.MessageEmbed();
        const clientAvatar = (_a = client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL();
        embed.setTitle(":weary::weary::weary: omg oktayyyy je bent zoo hott");
        embed.setDescription("Hmmmm dus jij bent benieuwd naar welke opdrachten ik kan uitvoeren he? Als je deze opdracht MET een bestaand opdracht uitvoert, krijg je alle info over die ene opdracht jwz Oktay type beat.");
        embed.setColor("#70ff83");
        //@ts-expect-error
        embed.setThumbnail(clientAvatar);
        embed.setFields([{ name: "Prefix", value: utils_1.Prefix }]);
        embed.setFields([{ name: utils_1.TextEncodings.whiteSpace, value: "Oktay's beschikbare opdrachten zijn als volgt:" }]);
        embed.setFooter({ text: "Geloof het of niet maar deze bot is gemaakt door Oktay." });
        //@ts-expect-error
        embed.setAuthor({ name: client.user.username, iconURL: clientAvatar });
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function* () {
                commands.forEach(function (command) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const commandImportation = yield Promise.resolve().then(() => __importStar(require(path_1.default.join(__dirname, command))));
                        const helpDictionary = typeof commandImportation.GetHelp === "function" ? commandImportation.GetHelp() : null;
                        if (helpDictionary !== null)
                            embed.fields.push({ name: utils_1.Prefix + " " + helpDictionary.command, value: helpDictionary.description, inline: false });
                        resolve(embed);
                    });
                });
            });
        });
    });
}
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        let keyword = commandArguments[0];
        const availableCommands = fs_1.default.readdirSync(__dirname).map(cmd => cmd.split(".")[0]);
        for (let i = 0; i < keyword.length; i++)
            if (keyword.charAt(i) === " ")
                keyword = keyword.replace(" ", "");
        if (keyword === "")
            return message.channel.send({ embeds: [yield createGeneralHelpGuide(client)] });
        if (!availableCommands.includes(keyword))
            return message.channel.send(`Bruh, denk je dat '${keyword}' bestaat in mijn codebase? MEOW!!`);
        const commandImportation = yield Promise.resolve().then(() => __importStar(require(path_1.default.join(__dirname, keyword + ".js"))));
        const dict = commandImportation.GetHelp();
        const embedMessage = new discord_js_1.MessageEmbed();
        embedMessage.setColor("RANDOM");
        embedMessage.setTimestamp();
        embedMessage.setThumbnail("https://i1.sndcdn.com/artworks-000438293379-qmqr5v-t500x500.jpg");
        embedMessage.setTitle(`${utils_1.Prefix} ${dict.command}`);
        embedMessage.setDescription(dict.description);
        if (dict.keyword)
            embedMessage.description += ` Het uitvoeren van deze opdracht werkt als volgt: ${utils_1.TextEncodings.graveAccent}${utils_1.Prefix} ${dict.command} [${dict.keyword}] [argumenten indien beschikbaar]${utils_1.TextEncodings.graveAccent}`;
        if (dict.arguments) {
            dict.arguments.forEach(function (arg) {
                embedMessage.addField(utils_1.TextEncodings.whiteSpace, "-" + arg, true);
            });
        }
        return message.channel.send({ embeds: [embedMessage] });
    });
}
exports.Execute = Execute;
