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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const discord_js_1 = require("discord.js");
(function _(p) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = p.argv;
        const envPath = args[2];
        if (!envPath)
            return;
        const fileExists = fs_1.default.existsSync(path_1.default.join(__dirname, envPath));
        dotenv_1.default.config({ path: path_1.default.join(__dirname, envPath) });
        if (typeof p.env["BOT_TOKEN"] === "undefined")
            return;
        const botToken = p.env["BOT_TOKEN"];
        const client = new discord_js_1.Client({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
                discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
                discord_js_1.Intents.FLAGS.DIRECT_MESSAGES
            ]
        });
        client.once("ready", function (client) {
            return __awaiter(this, void 0, void 0, function* () {
                const members = [];
                client.guilds.cache.forEach(function (guild) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const guildMember = yield guild.members.fetch();
                        members.push(guildMember);
                        handle();
                    });
                });
                function handle() {
                    console.log(JSON.stringify(members));
                }
            });
        });
        client.login(botToken);
    });
})(process);
