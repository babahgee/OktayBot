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
        highWaterMark: 1 << 25
    }
});
const commands = FS.readdirSync(Path.join(__dirname, "modules", "commands"), { encoding: "utf-8" });
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
            message.channel.send("Please enter a command.");
            return;
        }
        if (!commands.includes(command + ".js")) {
            message.channel.send(`${utils_1.TextEncodings.graveAccent}Kan opdracht '${command}' niet uitvoeren sinds opdracht niet bestaat in codebase.${utils_1.TextEncodings.graveAccent}`);
            return;
        }
        const commandExecution = yield Promise.resolve().then(() => __importStar(require(Path.join(__dirname, "modules", "commands", command + ".js"))));
        yield commandExecution.Execute(message, commandArguments, client, player);
    });
});
client.on("ready", function (client) {
    var _a;
    console.log("Client succesfully has been initialized.".green);
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        status: "online",
        activities: [{
                name: `Prefix: ${utils_1.Prefix}`
            }]
    });
});
client.login(process.env.BOT_TOKEN).then(function (value) {
    console.log(`Client succesfully logged in.`.green);
});
