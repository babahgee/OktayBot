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
Object.defineProperty(exports, "__esModule", { value: true });
const DiscordJS = __importStar(require("discord.js"));
const DiscordPlayer = __importStar(require("discord-player"));
const FS = __importStar(require("fs"));
const Path = __importStar(require("path"));
require("colors");
require("dotenv");
const utils_1 = require("./modules/utils");
if (typeof process.env.BOT_TOKEN !== "string") {
    console.log("Failed to run program since bot token has not been defined in the process environment.".red);
    process.exit();
}
console.log("Initializing Discord client, YTDL DiscordPlayer client and main program...".yellow);
const client = new DiscordJS.Client({
    intents: [
        DiscordJS.Intents.FLAGS.GUILDS,
        DiscordJS.Intents.FLAGS.GUILD_MEMBERS,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
        DiscordJS.Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});
const player = new DiscordPlayer.Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
    connectionTimeout: 10000
});
let lastMessageGuild;
player.on("trackStart", function (queue, track) {
    var _a;
    const embed = new DiscordJS.MessageEmbed({
        title: `Speelt '${track.title}' af`,
        description: `_${track.title}_ van _${track.author}_ word nu afgespeeld.`,
        thumbnail: {
            url: track.thumbnail
        },
        footer: {
            text: `Opgevraagd door '${track.requestedBy.username}'`
        }
    });
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        status: "online",
        activities: [{
                name: track.title,
                url: track.url,
                type: "LISTENING",
            }]
    });
    if (typeof lastMessageGuild !== "undefined")
        lastMessageGuild.channel.send({ embeds: [embed] });
});
player.on("queueEnd", function (queue) {
    var _a;
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        status: "online",
        activities: [{
                name: `Mijn prefix is ${utils_1.Prefix}`,
                type: "PLAYING",
            }]
    });
});
const commands = FS.readdirSync(Path.join(__dirname, "modules", "commands"), { encoding: "utf-8" });
function createInvalidCommandEmbedMessage(command) {
    const msg = new DiscordJS.MessageEmbed();
    const possibleCommands = [];
    commands.forEach(function (cmd) {
        if (cmd.indexOf(command) > -1)
            possibleCommands.push("``" + `${utils_1.Prefix} ${cmd.split(".js")[0]}` + "``");
    });
    msg.setColor("RANDOM");
    msg.setTimestamp();
    if (client.user !== null)
        msg.setAuthor(client.user.username, client.user.displayAvatarURL());
    msg.setTitle("Onbekende opdracht");
    msg.setDescription(`De ingevoerde opdracht bestaat niet in mijn codebase. Voer ${utils_1.Prefix} help uit om te zien tot welke opdrachten ter beschikking zijn.\n\n Bedoel je misschien ${possibleCommands.join(", ")}`);
    return msg;
}
function createNoGivenCommandEmbedMessage() {
    const msg = new DiscordJS.MessageEmbed();
    msg.setColor("RANDOM");
    msg.setTimestamp();
    if (client.user !== null)
        msg.setAuthor(client.user.username, client.user.displayAvatarURL());
    msg.setTitle("Ulan");
    msg.setDescription(`Er zijn geen opdrachten ingevoerd. Voer ${utils_1.Prefix} help uit om te zien tot welke opdrachten ter beschikking zijn.`);
    return msg;
}
client.on("messageCreate", function (message) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (message.author.id === ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id) || message.author.bot)
            return;
        if (!message.content.startsWith(utils_1.Prefix))
            return;
        const msg = message.content, format = msg.split(" ");
        const command = typeof format[1] === "string" ? format[1].toLowerCase() : "no_command_given";
        const commandArguments = msg.substring(command.length + (utils_1.Prefix.length + 1)).split("-");
        if (command === "no_command_given") {
            console.log(`User '${message.author.username}' tried executing a non-given command at ${new Date()}`.yellow);
            message.channel.send({ embeds: [createNoGivenCommandEmbedMessage()] });
            return;
        }
        if (!commands.includes(command + ".js")) {
            console.log(`User '${message.author.username}' tried executing a non-existing command '${command}' at ${new Date()}`.yellow);
            message.channel.send({ embeds: [createInvalidCommandEmbedMessage(command)] });
            return;
        }
        const commandExecution = yield Promise.resolve().then(() => __importStar(require(Path.join(__dirname, "modules", "commands", command + ".js"))));
        try {
            yield commandExecution.Execute(message, commandArguments, client, player);
            lastMessageGuild = message;
        }
        catch (err) {
            const error = err;
            console.log(`Failed to execute command '${command}'. Error message: ${error.message}. Error stack: ${error.stack}`.bgBlack.red);
            message.channel.send(error.message);
        }
    });
});
client.on("ready", function (client) {
    var _a;
    console.log(`Client succesfully has been initialized at ${new Date()}. Now ready to execute commands. To close this window, hit CTRL + C twice and the process should kill itself.`.green);
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        status: "online",
        activities: [{
                name: `Mijn prefix is ${utils_1.Prefix}`,
                type: "PLAYING",
            }]
    });
});
client.login(process.env.BOT_TOKEN).then(function (value) {
    console.log(`Client succesfully logged in at ${new Date()}.`.rainbow.bgBlack);
});
